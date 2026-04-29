"use client"

import React, { createContext, useCallback, useContext, useRef } from "react"
import { Chat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"

interface GlobalChatRuntimeContextValue {
  getOrCreateChat: (
    threadId: string,
    initialMessages?: UIMessage[],
  ) => Chat<UIMessage>
  removeChat: (threadId: string) => void
}

const GlobalChatRuntimeContext =
  createContext<GlobalChatRuntimeContextValue | null>(null)

export function GlobalChatRuntimeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const registryRef = useRef<Map<string, Chat<UIMessage>>>(new Map())

  const getOrCreateChat = useCallback(
    (threadId: string, initialMessages: UIMessage[] = []) => {
      const existing = registryRef.current.get(threadId)
      if (existing) {
        return existing
      }

      const chat = new Chat<UIMessage>({
        id: threadId,
        messages: initialMessages,
        transport: new DefaultChatTransport({
          api: "/api/ai/chat",
        }),
      })

      registryRef.current.set(threadId, chat)
      return chat
    },
    [],
  )

  const removeChat = useCallback((threadId: string) => {
    registryRef.current.delete(threadId)
  }, [])

  return (
    <GlobalChatRuntimeContext.Provider value={{ getOrCreateChat, removeChat }}>
      {children}
    </GlobalChatRuntimeContext.Provider>
  )
}

export function useGlobalChatRuntime() {
  const context = useContext(GlobalChatRuntimeContext)
  if (!context) {
    throw new Error(
      "useGlobalChatRuntime must be used within GlobalChatRuntimeProvider",
    )
  }
  return context
}
