"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { type UIMessage } from "ai"
import { useGlobalChatRuntime } from "@/app/context/GlobalChatRuntimeContext"
import { estimateTokens, type TokenEstimate } from "@/lib/ai/token-estimate"

interface UseThreadChatOptions {
  threadId: string
  initialMessages?: UIMessage[]
  onMessagesPersist?: (messages: UIMessage[]) => void
}

const SLOW_REQUEST_THRESHOLD_MS = 5000
const VERY_SLOW_REQUEST_THRESHOLD_MS = 15000

export function useThreadChat({
  threadId,
  initialMessages = [],
  onMessagesPersist,
}: UseThreadChatOptions) {
  const { getOrCreateChat } = useGlobalChatRuntime()

  // Get or create the global Chat instance for this thread.
  const chat = useMemo(
    () => getOrCreateChat(threadId, initialMessages),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threadId, getOrCreateChat],
  )

  // Subscribe to the global Chat instance.
  const [lastError, setLastError] = useState<(Error & { status?: number }) | undefined>(undefined)

  const { messages, sendMessage, status, error, stop } = useChat({
    chat,
    onError: (err) => {
      setLastError(err as Error & { status?: number })
    },
  })

  // Clear local error when stream completes or resets
  useEffect(() => {
    if (status === "ready" || status === "streaming") {
      setLastError(undefined)
    }
  }, [status])

  // Throttled persistence: write back to the persistence layer
  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!onMessagesPersist) return

    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current)
    }

    persistTimeoutRef.current = setTimeout(() => {
      onMessagesPersist(messages)
    }, 300)

    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current)
      }
    }
  }, [messages, onMessagesPersist])

  // Busy / slow detection
  const isBusy = status === "submitted" || status === "streaming"

  const [slowPhase, setSlowPhase] = useState<"normal" | "slow" | "verySlow">("normal")
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const verySlowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isBusy) {
      setSlowPhase("normal")
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current)
      if (verySlowTimerRef.current) clearTimeout(verySlowTimerRef.current)
      return
    }

    setSlowPhase("normal")
    slowTimerRef.current = setTimeout(() => {
      setSlowPhase("slow")
    }, SLOW_REQUEST_THRESHOLD_MS)
    verySlowTimerRef.current = setTimeout(() => {
      setSlowPhase("verySlow")
    }, VERY_SLOW_REQUEST_THRESHOLD_MS)

    return () => {
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current)
      if (verySlowTimerRef.current) clearTimeout(verySlowTimerRef.current)
    }
  }, [isBusy])

  const estimateInputTokens = useCallback(
    (pendingInput: string): TokenEstimate =>
      estimateTokens({
        messages,
        pendingInput,
      }),
    [messages],
  )

  return {
    chat,
    messages,
    sendMessage,
    status,
    error: lastError,
    stop,
    isBusy,
    slowPhase,
    estimateInputTokens,
  }
}
