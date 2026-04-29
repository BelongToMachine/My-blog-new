"use client"

import { useEffect, useMemo, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { type UIMessage } from "ai"
import { useGlobalChatRuntime } from "@/app/context/GlobalChatRuntimeContext"

interface UseThreadChatOptions {
  threadId: string
  initialMessages?: UIMessage[]
  onMessagesPersist?: (messages: UIMessage[]) => void
}

export function useThreadChat({
  threadId,
  initialMessages = [],
  onMessagesPersist,
}: UseThreadChatOptions) {
  const { getOrCreateChat } = useGlobalChatRuntime()

  // Get or create the global Chat instance for this thread.
  // initialMessages are only used when the instance is first created;
  // after that the instance retains its own live state.
  const chat = useMemo(
    () => getOrCreateChat(threadId, initialMessages),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threadId, getOrCreateChat],
  )

  // Subscribe to the global Chat instance.
  // useChat re-registers callbacks on mount, so locale switches are safe.
  const { messages, sendMessage, status, error, stop } = useChat({
    chat,
  })

  // Throttled persistence: write back to the persistence layer
  // (e.g. localStorage via useChatThreads) every ~300ms.
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

  const isBusy = status === "submitted" || status === "streaming"

  return {
    chat,
    messages,
    sendMessage,
    status,
    error,
    stop,
    isBusy,
  }
}
