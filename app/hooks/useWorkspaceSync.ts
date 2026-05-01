"use client"

import { useEffect, useMemo } from "react"
import { isToolUIPart, type UIMessage } from "ai"
import type { useThreadWorkspace } from "@/app/hooks/useThreadWorkspace"
import {
  articleSummaryArtifactDataSchema,
  profileCardArtifactDataSchema,
  projectGridArtifactDataSchema,
  safeParseWorkspaceArtifactPayload,
  type WorkspaceArtifact,
  type WorkspaceArtifactPayload,
  type WorkspaceArtifactType,
  type WorkspacePendingIntent,
  type WorkspaceVisualToolName,
} from "@/app/types/ai-workspace"

type WorkspaceRuntime = ReturnType<typeof useThreadWorkspace>

const LEGACY_WORKSPACE_TOOL_MAP: Record<
  Exclude<WorkspaceVisualToolName, "build_ui_block">,
  WorkspaceArtifactType
> = {
  get_profile_summary: "profile-card",
  list_projects: "project-grid",
  search_articles: "article-summary",
}

export function getToolName(part: { type: string; toolName?: string }): string {
  const toolPrefix = "tool-"
  if (part.type === "dynamic-tool" && part.toolName) {
    return part.toolName
  }
  if (part.type.startsWith(toolPrefix)) {
    return part.type.slice(toolPrefix.length)
  }
  return part.type
}

function isVisualToolName(toolName: string): toolName is WorkspaceVisualToolName {
  return (
    toolName === "build_ui_block" ||
    toolName === "get_profile_summary" ||
    toolName === "list_projects" ||
    toolName === "search_articles"
  )
}

function getLatestArtifactOfType(
  artifacts: WorkspaceArtifact[],
  type: WorkspaceArtifactType,
) {
  return [...artifacts].reverse().find((artifact) => artifact.type === type)
}

function resolveTargetArtifact(
  payload: WorkspaceArtifactPayload,
  artifacts: WorkspaceArtifact[],
  activeArtifact?: WorkspaceArtifact,
) {
  if (payload.artifactId) {
    const explicitTarget = artifacts.find(
      (artifact) => artifact.id === payload.artifactId,
    )
    if (explicitTarget) {
      return explicitTarget
    }
  }

  if (activeArtifact?.type === payload.artifactType) {
    return activeArtifact
  }

  return getLatestArtifactOfType(artifacts, payload.artifactType)
}

function normalizeLegacyToolInput(
  toolName: Exclude<WorkspaceVisualToolName, "build_ui_block">,
): WorkspacePendingIntent {
  return {
    sourceId: "",
    toolName,
    artifactType: LEGACY_WORKSPACE_TOOL_MAP[toolName],
    operation: "replace",
    focus: true,
    surface: "chat",
    reveal: false,
    priority: "low",
  }
}

function normalizeVisualToolInput(
  toolName: WorkspaceVisualToolName,
  input: unknown,
): WorkspacePendingIntent | null {
  if (toolName === "build_ui_block") {
    const payload = safeParseWorkspaceArtifactPayload(input)
    if (!payload) return null

    return {
      sourceId: "",
      toolName,
      artifactType: payload.artifactType,
      operation: payload.operation,
      title: payload.title,
      summary: payload.summary,
      focus: payload.focus ?? true,
      surface: payload.surface ?? "artifact",
      reveal: payload.reveal ?? false,
      priority: payload.priority ?? "low",
    }
  }

  return normalizeLegacyToolInput(toolName)
}

function normalizeVisualToolOutput(
  toolName: WorkspaceVisualToolName,
  output: unknown,
): WorkspaceArtifactPayload | null {
  if (toolName === "build_ui_block") {
    return safeParseWorkspaceArtifactPayload(output)
  }

  if (toolName === "get_profile_summary") {
    const parsed = profileCardArtifactDataSchema.safeParse(output)
    if (!parsed.success) return null

    return {
      artifactType: "profile-card",
      operation: "replace",
      focus: true,
      data: parsed.data,
    }
  }

  if (toolName === "list_projects") {
    const parsed = projectGridArtifactDataSchema.safeParse({
      projects: Array.isArray(output) ? output : [],
    })
    if (!parsed.success) return null

    return {
      artifactType: "project-grid",
      operation: "replace",
      focus: true,
      data: parsed.data,
    }
  }

  const parsed = articleSummaryArtifactDataSchema.safeParse({
    articles: Array.isArray(output) ? output : [],
  })
  if (!parsed.success) return null

  return {
    artifactType: "article-summary",
    operation: "replace",
    focus: true,
    data: parsed.data,
  }
}

function applyResolvedPayload(
  payload: WorkspaceArtifactPayload,
  sourceId: string,
  workspace: WorkspaceRuntime,
  reveal: boolean,
) {
  const target = resolveTargetArtifact(
    payload,
    workspace.artifacts,
    workspace.activeArtifact,
  )

  const artifactBase = {
    type: payload.artifactType,
    title: payload.title,
    data: payload.data,
    status: "ready" as const,
    summary: payload.summary,
    sourceMessageId: sourceId,
  }

  // Only auto-focus (reveal) if explicitly requested
  const focus = reveal && (payload.focus ?? true)

  if (payload.operation === "append") {
    workspace.addArtifact(artifactBase, { focus })
    return
  }

  if (payload.operation === "replace") {
    if (!target) {
      workspace.addArtifact(artifactBase, { focus })
      return
    }

    workspace.updateArtifact(
      target.id,
      {
        ...artifactBase,
        title: payload.title ?? target.title,
        summary: payload.summary ?? target.summary,
      },
      { focus },
    )
    workspace.removeArtifactsByType(payload.artifactType, {
      preserveArtifactId: target.id,
    })
    return
  }

  if (target) {
    workspace.updateArtifact(
      target.id,
      {
        ...artifactBase,
        title: payload.title ?? target.title,
        summary: payload.summary ?? target.summary,
      },
      { focus },
    )
    return
  }

  workspace.addArtifact(artifactBase, { focus })
}

export function useWorkspaceSync({
  messages,
  workspace,
}: {
  messages: UIMessage[]
  workspace: WorkspaceRuntime
}) {
  const appliedOutputIds = useMemo(
    () => new Set(workspace.appliedToolOutputIds),
    [workspace.appliedToolOutputIds],
  )

  useEffect(() => {
    messages.forEach((message) => {
      if (message.role !== "assistant") return

      message.parts.forEach((part, partIndex) => {
        if (!isToolUIPart(part)) return

        const toolName = getToolName(part)
        if (!isVisualToolName(toolName)) return

        const sourceId = `${message.id}-${partIndex}`
        if (appliedOutputIds.has(sourceId)) return

        if (part.state === "input-available") {
          const pendingIntent = normalizeVisualToolInput(toolName, part.input)
          if (!pendingIntent) return

          // Chat-only surface: skip workspace entirely
          if (pendingIntent.surface === "chat") {
            workspace.markToolOutputApplied(sourceId)
            return
          }

          const payload = toolName === "build_ui_block"
            ? safeParseWorkspaceArtifactPayload(part.input)
            : null
          const target = payload
            ? resolveTargetArtifact(
                payload,
                workspace.artifacts,
                workspace.activeArtifact,
              )
            : getLatestArtifactOfType(
                workspace.artifacts,
                pendingIntent.artifactType,
              )

          if (
            workspace.pendingIntent?.sourceId === sourceId &&
            workspace.pendingIntent.artifactType === pendingIntent.artifactType &&
            workspace.pendingIntent.operation === pendingIntent.operation
          ) {
            return
          }

          if (
            target &&
            (pendingIntent.operation === "replace" ||
              pendingIntent.operation === "update")
          ) {
            if (target.status !== "updating") {
              workspace.setArtifactStatus(target.id, "updating")
            }
            // Only auto-focus if reveal=true
            if (pendingIntent.reveal) {
              workspace.setActiveArtifact(target.id)
            }
          }

          workspace.setPendingIntent({
            ...pendingIntent,
            sourceId,
            targetArtifactId: target?.id,
          })
          return
        }

        if (part.state === "output-error") {
          if (
            workspace.pendingIntent?.sourceId === sourceId &&
            workspace.pendingIntent.targetArtifactId
          ) {
            workspace.setArtifactStatus(
              workspace.pendingIntent.targetArtifactId,
              "error",
            )
          }
          workspace.markToolOutputApplied(sourceId)
          workspace.clearPendingIntent(sourceId)
          return
        }

        if (part.state !== "output-available") return

        const payload = normalizeVisualToolOutput(toolName, part.output)
        if (!payload) {
          workspace.clearPendingIntent(sourceId)
          workspace.markToolOutputApplied(sourceId)
          return
        }

        // Check pending intent for surface/reveal settings
        const pending = workspace.pendingIntent
        const surface = pending?.surface ?? "artifact"
        const reveal = pending?.reveal ?? false

        // Chat-only: don't put in workspace, just mark as applied
        if (surface === "chat") {
          workspace.markToolOutputApplied(sourceId)
          workspace.clearPendingIntent(sourceId)
          return
        }

        const resolvedPayload: WorkspaceArtifactPayload = {
          ...payload,
          focus: reveal && (payload.focus ?? true),
        }

        const targetBeforeApply = resolveTargetArtifact(
          resolvedPayload,
          workspace.artifacts,
          workspace.activeArtifact,
        )

        applyResolvedPayload(
          {
            ...resolvedPayload,
            artifactId:
              resolvedPayload.operation === "update"
                ? targetBeforeApply?.id
                : resolvedPayload.artifactId,
          } as WorkspaceArtifactPayload,
          sourceId,
          workspace,
          reveal,
        )

        workspace.markToolOutputApplied(sourceId)
        workspace.clearPendingIntent(sourceId)
      })
    })
  }, [appliedOutputIds, messages, workspace])
}
