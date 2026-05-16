"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { UIMessage } from "ai"

export interface ChatThread {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: UIMessage[]
  summary?: string
  isStarred?: boolean
}

// ─── LocalStorage fallback for graceful degradation ───

const LS_THREADS_KEY = "jie-ai-chat-threads-v2"
const LS_ACTIVE_KEY = "jie-ai-chat-active-thread-v2"

function lsLoadThreads(): ChatThread[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(LS_THREADS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ChatThread[]
    return Array.isArray(parsed)
      ? parsed.map((thread) => ({
          ...thread,
          isStarred: Boolean(thread.isStarred),
        }))
      : []
  } catch {
    return []
  }
}

function lsSaveThreads(threads: ChatThread[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(LS_THREADS_KEY, JSON.stringify(threads))
  } catch {
    // ignore
  }
}

function lsLoadActiveId(): string | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage.getItem(LS_ACTIVE_KEY)
  } catch {
    return null
  }
}

function lsSaveActiveId(id: string | null) {
  if (typeof window === "undefined") return
  try {
    if (id) window.localStorage.setItem(LS_ACTIVE_KEY, id)
    else window.localStorage.removeItem(LS_ACTIVE_KEY)
  } catch {
    // ignore
  }
}

interface ApiThread {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

interface ApiThreadWithMessages extends ApiThread {
  messages: Array<{
    id: string
    role: string
    content: string
    parts: string
    createdAt: string
  }>
}

function sortThreads(threads: ChatThread[]): ChatThread[] {
  return [...threads].sort((a, b) => {
    if (Boolean(a.isStarred) !== Boolean(b.isStarred)) {
      return a.isStarred ? -1 : 1
    }

    return b.updatedAt - a.updatedAt
  })
}

function mergeThreadsWithLocalCache(
  apiThreads: ChatThread[],
  cachedThreads: ChatThread[],
): ChatThread[] {
  const cachedById = new Map(cachedThreads.map((thread) => [thread.id, thread]))

  return apiThreads.map((thread) => {
    const cached = cachedById.get(thread.id)
    if (!cached) {
      return {
        ...thread,
        isStarred: Boolean(thread.isStarred),
      }
    }

    const preferCached = cached.updatedAt > thread.updatedAt

    return {
      ...thread,
      title: preferCached && cached.title ? cached.title : thread.title,
      messages: preferCached && cached.messages.length > 0 ? cached.messages : thread.messages,
      summary: preferCached && cached.summary ? cached.summary : thread.summary,
      isStarred: Boolean(cached.isStarred),
    }
  })
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
    summary: undefined,
    isStarred: false,
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

function apiThreadToChatThread(api: ApiThread): ChatThread {
  return {
    id: api.id,
    title: api.title,
    createdAt: new Date(api.createdAt).getTime(),
    updatedAt: new Date(api.updatedAt).getTime(),
    messages: [],
    isStarred: false,
  }
}

function apiThreadWithMessagesToChatThread(api: ApiThreadWithMessages): ChatThread {
  return {
    id: api.id,
    title: api.title,
    createdAt: new Date(api.createdAt).getTime(),
    updatedAt: new Date(api.updatedAt).getTime(),
    messages: api.messages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content,
      parts: JSON.parse(msg.parts) as UIMessage["parts"],
      createdAt: new Date(msg.createdAt).getTime(),
    })),
    isStarred: false,
  }
}

/* ─── Server persistence circuit breaker ─── */
// When the server-side DB is down, every chat-stream delta would otherwise
// fire another failing POST. Trip a 60s breaker on first failure so the
// console isn't flooded and we silently fall back to localStorage.
const PERSIST_COOLDOWN_MS = 60_000
let persistTrippedUntil = 0

function isPersistTripped(): boolean {
  return Date.now() < persistTrippedUntil
}

function tripPersist(reason: string) {
  if (!isPersistTripped()) {
    console.warn(
      `[chat] server persistence unavailable (${reason}); using localStorage for ~60s`,
    )
  }
  persistTrippedUntil = Date.now() + PERSIST_COOLDOWN_MS
}

function resetPersist() {
  persistTrippedUntil = 0
}

async function fetchThreads(): Promise<ChatThread[]> {
  if (isPersistTripped()) return []
  try {
    const res = await fetch("/api/ai/threads")
    if (!res.ok) {
      tripPersist(`GET /threads ${res.status}`)
      return []
    }
    const data = (await res.json()) as ApiThread[]
    resetPersist()
    return data.map(apiThreadToChatThread)
  } catch (err) {
    tripPersist(`GET /threads ${err instanceof Error ? err.message : "network"}`)
    return []
  }
}

async function fetchThreadWithMessages(id: string): Promise<ChatThread | null> {
  if (isPersistTripped()) return null
  try {
    const res = await fetch(`/api/ai/threads/${id}`)
    if (!res.ok) {
      if (res.status === 404) return null
      tripPersist(`GET /threads/:id ${res.status}`)
      return null
    }
    const data = (await res.json()) as ApiThreadWithMessages
    resetPersist()
    return apiThreadWithMessagesToChatThread(data)
  } catch (err) {
    tripPersist(`GET /threads/:id ${err instanceof Error ? err.message : "network"}`)
    return null
  }
}

async function createThreadApi(): Promise<ChatThread> {
  if (isPersistTripped()) throw new Error("persist-tripped")
  try {
    const res = await fetch("/api/ai/threads", { method: "POST" })
    if (!res.ok) {
      tripPersist(`POST /threads ${res.status}`)
      throw new Error("persist-tripped")
    }
    const data = (await res.json()) as ApiThread
    resetPersist()
    return apiThreadToChatThread(data)
  } catch (err) {
    if (err instanceof Error && err.message === "persist-tripped") throw err
    tripPersist(`POST /threads ${err instanceof Error ? err.message : "network"}`)
    throw new Error("persist-tripped")
  }
}

async function deleteThreadApi(id: string): Promise<void> {
  if (isPersistTripped()) return
  try {
    const res = await fetch(`/api/ai/threads/${id}`, { method: "DELETE" })
    if (!res.ok) {
      tripPersist(`DELETE /threads/:id ${res.status}`)
      return
    }
    resetPersist()
  } catch (err) {
    tripPersist(`DELETE /threads/:id ${err instanceof Error ? err.message : "network"}`)
  }
}

async function saveMessagesApi(
  id: string,
  messages: UIMessage[],
  title?: string,
): Promise<void> {
  if (isPersistTripped()) return
  try {
    const res = await fetch(`/api/ai/threads/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content:
            msg.parts.find((p) => p.type === "text") &&
            "text" in (msg.parts.find((p) => p.type === "text") as { text: string })
              ? (msg.parts.find((p) => p.type === "text") as { text: string }).text
              : "",
          parts: msg.parts,
        })),
        title,
      }),
    })
    if (!res.ok) {
      tripPersist(`POST /threads/:id/messages ${res.status}`)
      return
    }
    resetPersist()
  } catch (err) {
    tripPersist(`POST /threads/:id/messages ${err instanceof Error ? err.message : "network"}`)
  }
}

const THREADS_QUERY_KEY = ["ai-threads"]

export function useChatThreads() {
  const queryClient = useQueryClient()
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [localThreads, setLocalThreads] = useState<ChatThread[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load threads from API
  const threadsQuery = useQuery({
    queryKey: THREADS_QUERY_KEY,
    queryFn: fetchThreads,
    staleTime: 30000,
  })

  // Sync API threads to local state on load (with localStorage fallback)
  useEffect(() => {
    if (!threadsQuery.isSuccess || hydrated) return

    const apiThreads = threadsQuery.data
    const lsThreads = lsLoadThreads()

    if (apiThreads.length > 0) {
      const mergedThreads = sortThreads(mergeThreadsWithLocalCache(apiThreads, lsThreads))
      const activeId = lsLoadActiveId()
      setLocalThreads(mergedThreads)
      setActiveThreadId(
        activeId && mergedThreads.some((thread) => thread.id === activeId)
          ? activeId
          : mergedThreads[0].id,
      )
      setHydrated(true)
      return
    }

    // API returned empty → try localStorage fallback
    if (lsThreads.length > 0) {
      const sortedThreads = sortThreads(lsThreads)
      setLocalThreads(sortedThreads)
      const activeId = lsLoadActiveId()
      setActiveThreadId(
        activeId && sortedThreads.some((t) => t.id === activeId)
          ? activeId
          : sortedThreads[0].id,
      )
      setHydrated(true)
      return
    }

    // Nothing anywhere → create initial thread
    const initial = createInitialThread()
    setLocalThreads([initial])
    setActiveThreadId(initial.id)
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadsQuery.isSuccess, threadsQuery.data, hydrated])

  const createThreadMut = useMutation({
    mutationFn: createThreadApi,
    onSuccess: (newThread) => {
      queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY })
      setLocalThreads((prev) => {
        const next = sortThreads([newThread, ...prev.filter((t) => t.id !== newThread.id)])
        lsSaveThreads(next)
        return next
      })
      setActiveThreadId(newThread.id)
    },
    onError: () => {
      // API failed → local thread is already in state, just sync LS
      lsSaveThreads(localThreads)
    },
  })

  const deleteThreadMut = useMutation({
    mutationFn: deleteThreadApi,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY })
      setLocalThreads((prev) => {
        const next = sortThreads(prev.filter((t) => t.id !== id))
        lsSaveThreads(next)
        return next
      })
      setActiveThreadId((current) => {
        if (current === id) {
          const nextId = localThreads.find((t) => t.id !== id)?.id ?? null
          lsSaveActiveId(nextId)
          return nextId
        }
        return current
      })
    },
    onError: (_, id) => {
      // API failed → still delete locally and sync LS
      setLocalThreads((prev) => {
        const next = sortThreads(prev.filter((t) => t.id !== id))
        lsSaveThreads(next)
        return next
      })
    },
  })

  const saveMessagesMut = useMutation({
    mutationFn: ({
      id,
      messages,
      title,
    }: {
      id: string
      messages: UIMessage[]
      title?: string
    }) => saveMessagesApi(id, messages, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY })
    },
    onError: () => {
      // API failed → state is already updated, just sync LS
      lsSaveThreads(localThreads)
    },
  })

  const persistInFlightRef = useRef<Set<string>>(new Set())
  const queuedPersistRef = useRef<
    Map<
      string,
      {
        messages: UIMessage[]
        title?: string
      }
    >
  >(new Map())

  const persistLatestMessages = useCallback(
    ({
      id,
      messages,
      title,
    }: {
      id: string
      messages: UIMessage[]
      title?: string
    }) => {
      if (persistInFlightRef.current.has(id)) {
        queuedPersistRef.current.set(id, {
          messages: JSON.parse(JSON.stringify(messages)) as UIMessage[],
          title,
        })
        return
      }

      persistInFlightRef.current.add(id)

      saveMessagesMut.mutate(
        { id, messages, title },
        {
          onSettled: () => {
            persistInFlightRef.current.delete(id)

            const queued = queuedPersistRef.current.get(id)
            if (!queued) return

            queuedPersistRef.current.delete(id)
            persistLatestMessages({
              id,
              messages: queued.messages,
              title: queued.title,
            })
          },
        },
      )
    },
    [saveMessagesMut],
  )

  const createThread = useCallback(() => {
    const tempThread = createInitialThread()
    setLocalThreads((prev) => {
      const next = sortThreads([tempThread, ...prev])
      lsSaveThreads(next)
      return next
    })
    setActiveThreadId(tempThread.id)

    createThreadMut.mutate(undefined, {
      onSuccess: (serverThread) => {
        setLocalThreads((prev) => {
          const next = sortThreads(
            prev.map((t) =>
              t.id === tempThread.id
                ? {
                    ...serverThread,
                    isStarred: t.isStarred,
                  }
                : t,
            ),
          )
          lsSaveThreads(next)
          return next
        })
        setActiveThreadId(serverThread.id)
      },
      onError: () => {
        // Keep local thread if API fails
      },
    })

    return tempThread.id
  }, [createThreadMut])

  const deleteThread = useCallback(
    (id: string) => {
      setLocalThreads((prev) => {
        const next = sortThreads(prev.filter((t) => t.id !== id))
        lsSaveThreads(next)
        return next
      })
      setActiveThreadId((current) => (current === id ? null : current))
      deleteThreadMut.mutate(id)
    },
    [deleteThreadMut],
  )

  const updateThreadMessages = useCallback(
    (id: string, messages: UIMessage[]) => {
      const extractedTitle =
        messages.length > 0 ? extractTitleFromMessages(messages) : undefined

      let nextTitle: string | undefined

      setLocalThreads((prev) => {
        const exists = prev.find((t) => t.id === id)
        if (!exists) return prev

        nextTitle =
          exists.title === "New Chat" ? (extractedTitle ?? exists.title) : exists.title

        // 如果消息内容和标题都没有变化，不触发更新和排序
        const messagesUnchanged =
          JSON.stringify(exists.messages) === JSON.stringify(messages)
        const titleUnchanged = exists.title === nextTitle
        if (messagesUnchanged && titleUnchanged) return prev

        const updated: ChatThread = {
          ...exists,
          title: nextTitle,
          updatedAt: Date.now(),
          messages: JSON.parse(JSON.stringify(messages)),
        }

        const next = sortThreads([updated, ...prev.filter((t) => t.id !== id)])
        lsSaveThreads(next)
        return next
      })

      if (nextTitle !== undefined) {
        persistLatestMessages({ id, messages, title: nextTitle })
      }
    },
    [persistLatestMessages],
  )

  const renameThread = useCallback(
    (id: string, title: string) => {
      const nextTitle = title.trim()
      if (!nextTitle) return

      let nextMessages: UIMessage[] = []

      setLocalThreads((prev) => {
        const exists = prev.find((thread) => thread.id === id)
        if (!exists) return prev

        nextMessages = JSON.parse(JSON.stringify(exists.messages))

        const updated: ChatThread = {
          ...exists,
          title: nextTitle,
          updatedAt: Date.now(),
        }

        const next = sortThreads([updated, ...prev.filter((thread) => thread.id !== id)])
        lsSaveThreads(next)
        return next
      })

      persistLatestMessages({ id, messages: nextMessages, title: nextTitle })
    },
    [persistLatestMessages],
  )

  const toggleThreadStar = useCallback((id: string) => {
    setLocalThreads((prev) => {
      const exists = prev.find((thread) => thread.id === id)
      if (!exists) return prev

      const updated: ChatThread = {
        ...exists,
        isStarred: !exists.isStarred,
      }

      const next = sortThreads([updated, ...prev.filter((thread) => thread.id !== id)])
      lsSaveThreads(next)
      return next
    })
  }, [])

  const setActiveThread = useCallback((id: string | null) => {
    setActiveThreadId(id)
    lsSaveActiveId(id)
  }, [])

  // Ensure there is always at least one thread
  useEffect(() => {
    if (!hydrated) return

    if (localThreads.length === 0) {
      createThread()
    }
  }, [localThreads.length, hydrated, createThread])

  // Ensure active thread is valid
  useEffect(() => {
    if (!hydrated) return

    if (!activeThreadId && localThreads[0]) {
      setActiveThreadId(localThreads[0].id)
      return
    }

    if (
      activeThreadId &&
      !localThreads.find((thread) => thread.id === activeThreadId)
    ) {
      setActiveThreadId(localThreads[0]?.id ?? null)
    }
  }, [localThreads, activeThreadId, hydrated])

  // Load messages for active thread when switching
  useEffect(() => {
    if (!activeThreadId || !hydrated) return

    const thread = localThreads.find((t) => t.id === activeThreadId)
    if (thread && thread.messages.length === 0) {
      fetchThreadWithMessages(activeThreadId).then((fullThread) => {
        if (fullThread && fullThread.messages.length > 0) {
          setLocalThreads((prev) => {
            const next = prev.map((t) =>
              t.id === activeThreadId
                ? {
                    ...fullThread,
                    isStarred: t.isStarred,
                  }
                : t,
            )
            lsSaveThreads(next)
            return next
          })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThreadId, hydrated])

  return {
    hydrated,
    threads: localThreads,
    activeThreadId,
    createThread,
    deleteThread,
    renameThread,
    toggleThreadStar,
    updateThreadMessages,
    setActiveThread,
    isLoading: threadsQuery.isLoading || createThreadMut.isLoading,
  }
}
