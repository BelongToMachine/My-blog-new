"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type {
  WorkspaceArtifact,
  WorkspaceArtifactStatus,
  ThreadWorkspaceState,
} from "@/app/types/ai-workspace"

const WORKSPACE_STORAGE_KEY_PREFIX = "jie-ai-workspace"

function getStorageKey(threadId: string): string {
  return `${WORKSPACE_STORAGE_KEY_PREFIX}-${threadId}`
}

function generateArtifactId(): string {
  return `art-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadState(threadId: string): ThreadWorkspaceState {
  if (typeof window === "undefined") {
    return {
      threadId,
      artifacts: [],
      activeArtifactId: null,
      lastUpdatedAt: Date.now(),
    }
  }
  try {
    const raw = window.localStorage.getItem(getStorageKey(threadId))
    if (!raw) {
      return {
        threadId,
        artifacts: [],
        activeArtifactId: null,
        lastUpdatedAt: Date.now(),
      }
    }
    const parsed = JSON.parse(raw) as ThreadWorkspaceState
    if (parsed.threadId !== threadId) {
      return {
        threadId,
        artifacts: [],
        activeArtifactId: null,
        lastUpdatedAt: Date.now(),
      }
    }
    return {
      ...parsed,
      artifacts: Array.isArray(parsed.artifacts) ? parsed.artifacts : [],
    }
  } catch {
    return {
      threadId,
      artifacts: [],
      activeArtifactId: null,
      lastUpdatedAt: Date.now(),
    }
  }
}

function saveState(state: ThreadWorkspaceState) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      getStorageKey(state.threadId),
      JSON.stringify(state),
    )
  } catch {
    // localStorage might be full; silently fail
  }
}

export function removeWorkspaceForThread(threadId: string) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(getStorageKey(threadId))
  } catch {
    // ignore
  }
}

export function useThreadWorkspace(threadId: string | null) {
  const [state, setState] = useState<ThreadWorkspaceState>(() =>
    threadId ? loadState(threadId) : {
      threadId: "",
      artifacts: [],
      activeArtifactId: null,
      lastUpdatedAt: Date.now(),
    }
  )

  // Reset state when threadId changes
  useEffect(() => {
    if (!threadId) {
      setState({
        threadId: "",
        artifacts: [],
        activeArtifactId: null,
        lastUpdatedAt: Date.now(),
      })
      return
    }
    setState(loadState(threadId))
  }, [threadId])

  // Throttled persistence
  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!threadId) return

    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current)
    }

    persistTimeoutRef.current = setTimeout(() => {
      saveState(state)
    }, 300)

    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current)
      }
    }
  }, [state, threadId])

  // Force save on unmount
  useEffect(() => {
    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current)
      }
      if (threadId) {
        saveState(state)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId])

  const addArtifact = useCallback(
    (partial: Omit<WorkspaceArtifact, "id" | "threadId" | "createdAt" | "updatedAt">) => {
      if (!threadId) return
      const now = Date.now()
      const artifact: WorkspaceArtifact = {
        ...partial,
        id: generateArtifactId(),
        threadId,
        createdAt: now,
        updatedAt: now,
      }
      setState((prev) => {
        const next: ThreadWorkspaceState = {
          ...prev,
          artifacts: [...prev.artifacts, artifact],
          activeArtifactId: artifact.id,
          lastUpdatedAt: now,
        }
        return next
      })
      return artifact.id
    },
    [threadId],
  )

  const updateArtifact = useCallback(
    (
      artifactId: string,
      updates: Partial<Omit<WorkspaceArtifact, "id" | "threadId" | "createdAt">>,
    ) => {
      if (!threadId) return
      const now = Date.now()
      setState((prev) => {
        const index = prev.artifacts.findIndex((a) => a.id === artifactId)
        if (index === -1) return prev
        const updated: WorkspaceArtifact = {
          ...prev.artifacts[index],
          ...updates,
          updatedAt: now,
        }
        const nextArtifacts = [...prev.artifacts]
        nextArtifacts[index] = updated
        return {
          ...prev,
          artifacts: nextArtifacts,
          activeArtifactId: updated.id,
          lastUpdatedAt: now,
        }
      })
    },
    [threadId],
  )

  const updateArtifactByType = useCallback(
    (
      type: WorkspaceArtifact["type"],
      updates: Partial<Omit<WorkspaceArtifact, "id" | "threadId" | "createdAt">>,
    ) => {
      if (!threadId) return
      const now = Date.now()
      setState((prev) => {
        const index = prev.artifacts.findIndex((a) => a.type === type)
        if (index === -1) return prev
        const updated: WorkspaceArtifact = {
          ...prev.artifacts[index],
          ...updates,
          updatedAt: now,
        }
        const nextArtifacts = [...prev.artifacts]
        nextArtifacts[index] = updated
        return {
          ...prev,
          artifacts: nextArtifacts,
          activeArtifactId: updated.id,
          lastUpdatedAt: now,
        }
      })
    },
    [threadId],
  )

  const replaceArtifacts = useCallback(
    (artifacts: Omit<WorkspaceArtifact, "id" | "threadId" | "createdAt" | "updatedAt">[]) => {
      if (!threadId) return
      const now = Date.now()
      const newArtifacts: WorkspaceArtifact[] = artifacts.map((a) => ({
        ...a,
        id: generateArtifactId(),
        threadId,
        createdAt: now,
        updatedAt: now,
      }))
      setState((prev) => ({
        ...prev,
        artifacts: newArtifacts,
        activeArtifactId: newArtifacts[0]?.id ?? null,
        lastUpdatedAt: now,
      }))
      return newArtifacts.map((a) => a.id)
    },
    [threadId],
  )

  const removeArtifact = useCallback(
    (artifactId: string) => {
      if (!threadId) return
      setState((prev) => {
        const filtered = prev.artifacts.filter((a) => a.id !== artifactId)
        return {
          ...prev,
          artifacts: filtered,
          activeArtifactId:
            prev.activeArtifactId === artifactId
              ? filtered[filtered.length - 1]?.id ?? null
              : prev.activeArtifactId,
          lastUpdatedAt: Date.now(),
        }
      })
    },
    [threadId],
  )

  const setActiveArtifact = useCallback((artifactId: string | null) => {
    setState((prev) => ({
      ...prev,
      activeArtifactId: artifactId,
    }))
  }, [])

  const clearWorkspace = useCallback(() => {
    if (!threadId) return
    setState({
      threadId,
      artifacts: [],
      activeArtifactId: null,
      lastUpdatedAt: Date.now(),
    })
  }, [threadId])

  const setArtifactStatus = useCallback(
    (artifactId: string, status: WorkspaceArtifactStatus) => {
      updateArtifact(artifactId, { status })
    },
    [updateArtifact],
  )

  const activeArtifact = state.artifacts.find(
    (a) => a.id === state.activeArtifactId,
  )

  return useMemo(
    () => ({
      artifacts: state.artifacts,
      activeArtifact,
      activeArtifactId: state.activeArtifactId,
      addArtifact,
      updateArtifact,
      updateArtifactByType,
      replaceArtifacts,
      removeArtifact,
      setActiveArtifact,
      clearWorkspace,
      setArtifactStatus,
    }),
    [
      state.artifacts,
      activeArtifact,
      state.activeArtifactId,
      addArtifact,
      updateArtifact,
      updateArtifactByType,
      replaceArtifacts,
      removeArtifact,
      setActiveArtifact,
      clearWorkspace,
      setArtifactStatus,
    ],
  )
}
