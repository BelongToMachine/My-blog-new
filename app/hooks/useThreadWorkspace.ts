"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type {
  ThreadWorkspaceState,
  WorkspaceArtifact,
  WorkspaceArtifactStatus,
  WorkspacePendingIntent,
} from "@/app/types/ai-workspace"
import { getEmptyWorkspaceState } from "@/app/types/ai-workspace"

const WORKSPACE_STORAGE_KEY_PREFIX = "jie-ai-workspace"
const MAX_APPLIED_TOOL_OUTPUT_IDS = 200

type WorkspaceMutationOptions = {
  focus?: boolean
}

type NewWorkspaceArtifact = Omit<
  WorkspaceArtifact,
  "id" | "threadId" | "createdAt" | "updatedAt"
>

function getStorageKey(threadId: string): string {
  return `${WORKSPACE_STORAGE_KEY_PREFIX}-${threadId}`
}

function generateArtifactId(): string {
  return `art-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function trimAppliedToolOutputIds(ids: string[]) {
  if (ids.length <= MAX_APPLIED_TOOL_OUTPUT_IDS) {
    return ids
  }
  return ids.slice(ids.length - MAX_APPLIED_TOOL_OUTPUT_IDS)
}

function normalizeLoadedState(
  threadId: string,
  parsed: Partial<ThreadWorkspaceState> | null | undefined,
): ThreadWorkspaceState {
  const fallback = getEmptyWorkspaceState(threadId)

  if (!parsed || parsed.threadId !== threadId) {
    return fallback
  }

  const artifacts = Array.isArray(parsed.artifacts)
    ? parsed.artifacts.map((artifact) => ({
        ...artifact,
        status: artifact.status === "error" ? ("error" as const) : ("ready" as const),
      }))
    : []
  const appliedToolOutputIds = Array.isArray(parsed.appliedToolOutputIds)
    ? parsed.appliedToolOutputIds.filter((id): id is string => typeof id === "string")
    : artifacts
        .map((artifact) => artifact.sourceMessageId)
        .filter((id): id is string => typeof id === "string")

  const pendingIntent =
    parsed.pendingIntent && typeof parsed.pendingIntent === "object"
      ? (parsed.pendingIntent as WorkspacePendingIntent)
      : null

  return {
    ...fallback,
    ...parsed,
    threadId,
    artifacts,
    appliedToolOutputIds: trimAppliedToolOutputIds(appliedToolOutputIds),
    pendingIntent,
    activeArtifactId:
      typeof parsed.activeArtifactId === "string" &&
      artifacts.some((artifact) => artifact.id === parsed.activeArtifactId)
        ? parsed.activeArtifactId
        : artifacts[artifacts.length - 1]?.id ?? null,
  }
}

function loadState(threadId: string): ThreadWorkspaceState {
  if (typeof window === "undefined") {
    return getEmptyWorkspaceState(threadId)
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(threadId))
    if (!raw) {
      return getEmptyWorkspaceState(threadId)
    }

    const parsed = JSON.parse(raw) as Partial<ThreadWorkspaceState>
    return normalizeLoadedState(threadId, parsed)
  } catch {
    return getEmptyWorkspaceState(threadId)
  }
}

function saveState(state: ThreadWorkspaceState) {
  if (typeof window === "undefined" || !state.threadId) return

  try {
    const persistentState: ThreadWorkspaceState = {
      ...state,
      pendingIntent: null,
      artifacts: state.artifacts.map((artifact) =>
        artifact.status === "updating"
          ? {
              ...artifact,
              status: "ready",
            }
          : artifact,
      ),
    }

    window.localStorage.setItem(
      getStorageKey(state.threadId),
      JSON.stringify(persistentState),
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
    threadId ? loadState(threadId) : getEmptyWorkspaceState(""),
  )

  const latestStateRef = useRef(state)
  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    latestStateRef.current = state
  }, [state])

  useEffect(() => {
    if (!threadId) {
      setState(getEmptyWorkspaceState(""))
      return
    }

    setState(loadState(threadId))
  }, [threadId])

  useEffect(() => {
    if (!threadId) return

    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current)
    }

    persistTimeoutRef.current = setTimeout(() => {
      saveState(latestStateRef.current)
    }, 300)

    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current)
      }
    }
  }, [state, threadId])

  useEffect(() => {
    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current)
      }

      const current = latestStateRef.current
      if (current.threadId) {
        saveState(current)
      }
    }
  }, [])

  const addArtifact = useCallback(
    (partial: NewWorkspaceArtifact, options?: WorkspaceMutationOptions) => {
      if (!threadId) return null

      const now = Date.now()
      const artifact: WorkspaceArtifact = {
        ...partial,
        id: generateArtifactId(),
        threadId,
        createdAt: now,
        updatedAt: now,
      }

      setState((prev) => ({
        ...prev,
        artifacts: [...prev.artifacts, artifact],
        activeArtifactId:
          options?.focus === false && prev.activeArtifactId
            ? prev.activeArtifactId
            : artifact.id,
        lastUpdatedAt: now,
      }))

      return artifact.id
    },
    [threadId],
  )

  const updateArtifact = useCallback(
    (
      artifactId: string,
      updates: Partial<Omit<WorkspaceArtifact, "id" | "threadId" | "createdAt">>,
      options?: WorkspaceMutationOptions,
    ) => {
      if (!threadId) return false

      let updatedArtifactId: string | null = null
      const now = Date.now()

      setState((prev) => {
        const index = prev.artifacts.findIndex((artifact) => artifact.id === artifactId)
        if (index === -1) return prev

        const updated: WorkspaceArtifact = {
          ...prev.artifacts[index],
          ...updates,
          updatedAt: now,
        }
        updatedArtifactId = updated.id

        const nextArtifacts = [...prev.artifacts]
        nextArtifacts[index] = updated

        return {
          ...prev,
          artifacts: nextArtifacts,
          activeArtifactId:
            options?.focus === false && prev.activeArtifactId
              ? prev.activeArtifactId
              : updated.id,
          lastUpdatedAt: now,
        }
      })

      return updatedArtifactId !== null
    },
    [threadId],
  )

  const removeArtifact = useCallback(
    (artifactId: string) => {
      if (!threadId) return

      setState((prev) => {
        const filtered = prev.artifacts.filter((artifact) => artifact.id !== artifactId)
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

  const removeArtifactsByType = useCallback(
    (
      type: WorkspaceArtifact["type"],
      options?: { preserveArtifactId?: string | null },
    ) => {
      if (!threadId) return

      setState((prev) => {
        const filtered = prev.artifacts.filter(
          (artifact) =>
            artifact.type !== type ||
            artifact.id === (options?.preserveArtifactId ?? null),
        )

        const activeArtifactStillExists =
          prev.activeArtifactId &&
          filtered.some((artifact) => artifact.id === prev.activeArtifactId)

        return {
          ...prev,
          artifacts: filtered,
          activeArtifactId: activeArtifactStillExists
            ? prev.activeArtifactId
            : filtered[filtered.length - 1]?.id ?? null,
          lastUpdatedAt: Date.now(),
        }
      })
    },
    [threadId],
  )

  const replaceArtifacts = useCallback(
    (artifacts: NewWorkspaceArtifact[], options?: WorkspaceMutationOptions) => {
      if (!threadId) return []

      const now = Date.now()
      const nextArtifacts: WorkspaceArtifact[] = artifacts.map((artifact) => ({
        ...artifact,
        id: generateArtifactId(),
        threadId,
        createdAt: now,
        updatedAt: now,
      }))

      setState((prev) => ({
        ...prev,
        artifacts: nextArtifacts,
        activeArtifactId:
          options?.focus === false && prev.activeArtifactId
            ? prev.activeArtifactId
            : nextArtifacts[0]?.id ?? null,
        lastUpdatedAt: now,
      }))

      return nextArtifacts.map((artifact) => artifact.id)
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

    setState((prev) => ({
      ...getEmptyWorkspaceState(threadId),
      appliedToolOutputIds: prev.appliedToolOutputIds,
    }))
  }, [threadId])

  const setArtifactStatus = useCallback(
    (artifactId: string, status: WorkspaceArtifactStatus) => {
      updateArtifact(artifactId, { status })
    },
    [updateArtifact],
  )

  const markToolOutputApplied = useCallback((outputId: string) => {
    setState((prev) => {
      if (prev.appliedToolOutputIds.includes(outputId)) {
        return prev
      }

      return {
        ...prev,
        appliedToolOutputIds: trimAppliedToolOutputIds([
          ...prev.appliedToolOutputIds,
          outputId,
        ]),
      }
    })
  }, [])

  const setPendingIntent = useCallback((intent: WorkspacePendingIntent | null) => {
    setState((prev) => {
      const nextIntent = intent
        ? {
            ...intent,
            focus: intent.focus ?? true,
          }
        : null

      return {
        ...prev,
        pendingIntent: nextIntent,
      }
    })
  }, [])

  const clearPendingIntent = useCallback((sourceId?: string) => {
    setState((prev) => {
      if (!prev.pendingIntent) return prev
      if (sourceId && prev.pendingIntent.sourceId !== sourceId) {
        return prev
      }

      return {
        ...prev,
        pendingIntent: null,
      }
    })
  }, [])

  const activeArtifact = state.artifacts.find(
    (artifact) => artifact.id === state.activeArtifactId,
  )

  return useMemo(
    () => ({
      artifacts: state.artifacts,
      activeArtifact,
      activeArtifactId: state.activeArtifactId,
      appliedToolOutputIds: state.appliedToolOutputIds,
      pendingIntent: state.pendingIntent,
      addArtifact,
      updateArtifact,
      replaceArtifacts,
      removeArtifact,
      removeArtifactsByType,
      setActiveArtifact,
      clearWorkspace,
      setArtifactStatus,
      markToolOutputApplied,
      setPendingIntent,
      clearPendingIntent,
    }),
    [
      state.artifacts,
      activeArtifact,
      state.activeArtifactId,
      state.appliedToolOutputIds,
      state.pendingIntent,
      addArtifact,
      updateArtifact,
      replaceArtifacts,
      removeArtifact,
      removeArtifactsByType,
      setActiveArtifact,
      clearWorkspace,
      setArtifactStatus,
      markToolOutputApplied,
      setPendingIntent,
      clearPendingIntent,
    ],
  )
}
