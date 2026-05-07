import { createAgentUIStreamResponse } from "ai"
import { portfolioAgent } from "@/lib/ai/portfolio-agent"
import {
  checkIpRateLimit,
  checkSessionRateLimit,
  checkWeightedRateLimit,
  rateLimitHeaders,
} from "@/lib/ai/rate-limit.server"
import {
  acquireIpLock,
  acquireThreadLock,
} from "@/lib/ai/concurrency-lock.server"
import {
  validateChatRequest,
  getLastUserText,
} from "@/lib/ai/chat-schema"
import {
  assembleContextWindow,
  shouldTriggerSummary,
  type ThreadContextState,
} from "@/lib/ai/context-window"
import {
  generateThreadSummary,
  buildContextState,
} from "@/lib/ai/thread-summary.server"
import {
  attachAiSessionCookie,
  getAiSession,
  type AiSession,
} from "@/lib/ai/session.server"

export const maxDuration = 45
export const dynamic = "force-dynamic"

const UPSTREAM_TIMEOUT_MS = 30_000

// Per-instance summary cache. Persist to DB/Redis if cross-instance consistency is needed.
const threadSummaryCache = new Map<string, ThreadContextState>()

function jsonResponse(
  session: AiSession,
  body: { error: string },
  init: ResponseInit,
): Response {
  const headers = new Headers(init.headers)
  headers.set("Content-Type", "application/json")

  return attachAiSessionCookie(
    new Response(JSON.stringify(body), {
      ...init,
      headers,
    }),
    session,
  )
}

function withStreamCleanup(
  response: Response,
  cleanup: () => Promise<void>,
): Response {
  if (!response.body) {
    void cleanup()
    return response
  }

  const reader = response.body.getReader()
  let cleanupPromise: Promise<void> | null = null

  const runCleanup = () => {
    cleanupPromise ??= cleanup()
    return cleanupPromise
  }

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read()

        if (done) {
          controller.close()
          await runCleanup()
          return
        }

        controller.enqueue(value)
      } catch (error) {
        await runCleanup()
        controller.error(error)
      }
    },
    async cancel(reason) {
      try {
        await reader.cancel(reason)
      } finally {
        await runCleanup()
      }
    },
  })

  return new Response(stream, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  })
}

export async function POST(request: Request) {
  const session = getAiSession(request)

  /* ─── 1. Parse & validate body ─── */
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonResponse(session, { error: "Invalid JSON body" }, { status: 400 })
  }

  const validation = validateChatRequest(body)
  if (!validation.ok) {
    return jsonResponse(
      session,
      { error: validation.error },
      { status: validation.status },
    )
  }

  const { messages, threadId } = validation.data
  const lastUserText = getLastUserText(messages)
  const effectiveThreadId = `${session.id}:${threadId ?? "anon"}`

  /* ─── 2. Rate limits ─── */
  const ipLimit = await checkIpRateLimit(request)
  if (!ipLimit.allowed) {
    return jsonResponse(
      session,
      { error: "Rate limit exceeded. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((ipLimit.resetAt - Date.now()) / 1000)),
          ...rateLimitHeaders(ipLimit),
        },
      },
    )
  }

  const sessionLimit = await checkSessionRateLimit(session.id)
  if (!sessionLimit.allowed) {
    return jsonResponse(
      session,
      { error: "Daily limit reached. Please try again tomorrow." },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders(sessionLimit),
        },
      },
    )
  }

  const weightedLimit = await checkWeightedRateLimit(request, lastUserText)
  if (!weightedLimit.allowed) {
    return jsonResponse(
      session,
      { error: "Request quota exceeded. Please slow down." },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders(weightedLimit),
        },
      },
    )
  }

  /* ─── 3. Concurrency locks ─── */
  const threadLock = await acquireThreadLock(effectiveThreadId)
  if (!threadLock) {
    return jsonResponse(
      session,
      { error: "A generation is already in progress for this conversation." },
      { status: 423 },
    )
  }

  const ipLock = await acquireIpLock(request)
  if (!ipLock) {
    await threadLock.release()
    return jsonResponse(
      session,
      { error: "Too many concurrent requests. Please wait." },
      { status: 429 },
    )
  }

  /* ─── 4. Lazy summary generation ─── */
  const cachedContextState = threadSummaryCache.get(effectiveThreadId)
  let summary = cachedContextState?.summary

  const needsSummary = shouldTriggerSummary({
    messages,
    contextState: cachedContextState,
  })

  if (needsSummary) {
    try {
      const newSummary = await generateThreadSummary(messages)
      summary = newSummary
      threadSummaryCache.set(
        effectiveThreadId,
        buildContextState({
          messages,
          summary: newSummary,
        }),
      )
    } catch {
      // Summary failure is non-fatal; continue without it
    }
  }

  /* ─── 5. Assemble context window ─── */
  const contextMessages = assembleContextWindow({ messages, summary })

  /* ─── 6. Call model with timeout ─── */
  const abortController = new AbortController()
  let timedOut = false
  const timeoutId = setTimeout(() => {
    timedOut = true
    abortController.abort()
  }, UPSTREAM_TIMEOUT_MS)

  // Merge with request signal
  const abortFromRequest = () => abortController.abort()
  if (request.signal.aborted) {
    abortController.abort()
  } else {
    request.signal.addEventListener("abort", abortFromRequest)
  }

  const cleanup = async () => {
    clearTimeout(timeoutId)
    request.signal.removeEventListener("abort", abortFromRequest)
    const results = await Promise.allSettled([
      threadLock.release(),
      ipLock.release(),
    ])

    results.forEach((result) => {
      if (result.status === "rejected") {
        console.warn("[api/ai/chat] failed to release lock:", result.reason)
      }
    })
  }

  try {
    const response = await createAgentUIStreamResponse({
      agent: portfolioAgent,
      uiMessages: contextMessages,
      abortSignal: abortController.signal,
    })

    return withStreamCleanup(
      attachAiSessionCookie(response, session),
      cleanup,
    )
  } catch (error) {
    await cleanup()

    if (timedOut) {
      return jsonResponse(
        session,
        { error: "Request timed out. Please retry." },
        { status: 504 },
      )
    }

    console.error("[api/ai/chat] stream error:", error)
    return jsonResponse(
      session,
      { error: "AI service error. Please try again later." },
      { status: 503 },
    )
  }
}
