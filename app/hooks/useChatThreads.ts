"use client"

import { useCallback, useEffect, useState } from "react"
import type { UIMessage } from "ai"

const STORAGE_KEY = "jie-ai-chat-threads"
const ACTIVE_THREAD_KEY = "jie-ai-chat-active-thread"

export interface ChatThread {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: UIMessage[]
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function createInitialThread(): ChatThread {
  return {
    id: generateId(),
    title: "New Chat",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  }
}

function extractTitleFromMessages(messages: UIMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user")
  if (!firstUser) return "New Chat"

  const textPart = firstUser.parts.find((p) => p.type === "text")
  if (textPart && "text" in textPart) {
    const text = textPart.text.trim()
    return text.length > 24 ? text.slice(0, 24) + "..." : text
  }
  return "New Chat"
}

function loadThreads(): ChatThread[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ChatThread[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveThreads(threads: ChatThread[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
  } catch {
    // localStorage might be full; silently fail
  }
}

function loadActiveThreadId(): string | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage.getItem(ACTIVE_THREAD_KEY)
  } catch {
    return null
  }
}

function saveActiveThreadId(id: string | null) {
  if (typeof window === "undefined") return
  try {
    if (id) {
      window.localStorage.setItem(ACTIVE_THREAD_KEY, id)
    } else {
      window.localStorage.removeItem(ACTIVE_THREAD_KEY)
    }
  } catch {
    // ignore
  }
}

export function useChatThreads() {
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const persistedThreads = loadThreads()
    const persistedActiveThreadId = loadActiveThreadId()

    if (persistedThreads.length > 0) {
      setThreads(persistedThreads)
      setActiveThreadId(
        persistedActiveThreadId &&
          persistedThreads.some((thread) => thread.id === persistedActiveThreadId)
          ? persistedActiveThreadId
          : persistedThreads[0].id,
      )
    } else {
      const initialThread = createInitialThread()
      setThreads([initialThread])
      setActiveThreadId(initialThread.id)
    }

    setHydrated(true)
  }, [])

  // Persist threads whenever they change
  useEffect(() => {
    if (!hydrated) return
    saveThreads(threads)
  }, [threads, hydrated])

  // Persist active thread id whenever it changes
  useEffect(() => {
    if (!hydrated) return
    saveActiveThreadId(activeThreadId)
  }, [activeThreadId, hydrated])

  const createThread = useCallback(() => {
    const newThread = createInitialThread()
    setThreads((prev) => [newThread, ...prev])
    setActiveThreadId(newThread.id)
    return newThread.id
  }, [])

  const deleteThread = useCallback((id: string) => {
    setThreads((prev) => prev.filter((thread) => thread.id !== id))
    setActiveThreadId((current) => {
      return current === id ? null : current
    })
  }, [])

  const updateThreadMessages = useCallback(
    (id: string, messages: UIMessage[]) => {
      setThreads((prev) => {
        const exists = prev.find((t) => t.id === id)
        if (!exists) return prev

        const title =
          messages.length > 0 ? extractTitleFromMessages(messages) : exists.title

        const updated: ChatThread = {
          ...exists,
          title: exists.title === "New Chat" ? title : exists.title,
          updatedAt: Date.now(),
          messages: JSON.parse(JSON.stringify(messages)), // deep clone for safety
        }

        // Move to top
        const next = prev.filter((t) => t.id !== id)
        return [updated, ...next]
      })
    },
    [],
  )

  const setActiveThread = useCallback((id: string | null) => {
    setActiveThreadId(id)
  }, [])

  // Ensure there is always at least one thread if none exists
  useEffect(() => {
    if (!hydrated) return

    if (threads.length === 0) {
      const fallbackThread = createInitialThread()
      setThreads([fallbackThread])
      setActiveThreadId(fallbackThread.id)
    }
  }, [threads.length, hydrated])

  // Ensure active thread is valid
  useEffect(() => {
    if (!hydrated) return

    if (!activeThreadId && threads[0]) {
      setActiveThreadId(threads[0].id)
      return
    }

    if (activeThreadId && !threads.find((thread) => thread.id === activeThreadId)) {
      setActiveThreadId(threads[0]?.id ?? null)
    }
  }, [threads, activeThreadId, hydrated])

  return {
    hydrated,
    threads,
    activeThreadId,
    createThread,
    deleteThread,
    updateThreadMessages,
    setActiveThread,
  }
}
