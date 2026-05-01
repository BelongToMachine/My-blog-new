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

export const maxDuration = 45
export const dynamic = "force-dynamic"

const UPSTREAM_TIMEOUT_MS = 30_000

// Per-instance summary cache. Persist to DB/Redis if cross-instance consistency is needed.
const threadSummaryCache = new Map<string, ThreadContextState>()

export async function POST(request: Request) {
  /* ─── 1. Parse & validate body ─── */
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }

  const validation = validateChatRequest(body)
  if (!validation.ok) {
    return new Response(
      JSON.stringify({ error: validation.error }),
      { status: validation.status, headers: { "Content-Type": "application/json" } },
    )
  }

  const { messages, threadId } = validation.data
  const lastUserText = getLastUserText(messages)
  const effectiveThreadId = threadId ?? "anon"

  /* ─── 2. Rate limits ─── */
  const ipLimit = await checkIpRateLimit(request)
  if (!ipLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil((ipLimit.resetAt - Date.now()) / 1000)),
          ...rateLimitHeaders(ipLimit),
        },
      },
    )
  }

  const sessionLimit = await checkSessionRateLimit(request, effectiveThreadId)
  if (!sessionLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Daily limit reached. Please try again tomorrow." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...rateLimitHeaders(sessionLimit),
        },
      },
    )
  }

  const weightedLimit = await checkWeightedRateLimit(request, lastUserText)
  if (!weightedLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Request quota exceeded. Please slow down." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...rateLimitHeaders(weightedLimit),
        },
      },
    )
  }

  /* ─── 3. Concurrency locks ─── */
  const threadLock = await acquireThreadLock(effectiveThreadId)
  if (!threadLock) {
    return new Response(
      JSON.stringify({ error: "A generation is already in progress for this conversation." }),
      { status: 423, headers: { "Content-Type": "application/json" } },
    )
  }

  const ipLock = await acquireIpLock(request)
  if (!ipLock) {
    await threadLock.release()
    return new Response(
      JSON.stringify({ error: "Too many concurrent requests. Please wait." }),
      { status: 429, headers: { "Content-Type": "application/json" } },
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
  if (request.signal) {
    request.signal.addEventListener("abort", () => abortController.abort())
  }

  try {
    return await createAgentUIStreamResponse({
      agent: portfolioAgent,
      uiMessages: contextMessages,
      abortSignal: abortController.signal,
    })
  } catch (error) {
    clearTimeout(timeoutId)

    if (timedOut) {
      return new Response(
        JSON.stringify({ error: "Request timed out. Please retry." }),
        { status: 504, headers: { "Content-Type": "application/json" } },
      )
    }

    console.error("[api/ai/chat] stream error:", error)
    return new Response(
      JSON.stringify({ error: "AI service error. Please try again later." }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    )
  } finally {
    clearTimeout(timeoutId)
    await threadLock.release()
    await ipLock.release()
  }
}
