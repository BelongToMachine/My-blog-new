export type WorkspaceArtifactType =
  | "project-grid"
  | "comparison-table"
  | "timeline"
  | "role-fit-report"
  | "profile-card"
  | "article-summary"

export type WorkspaceArtifactStatus = "ready" | "updating" | "error"

export interface WorkspaceArtifact {
  id: string
  threadId: string
  type: WorkspaceArtifactType
  title?: string
  data: Record<string, unknown>
  status: WorkspaceArtifactStatus
  sourceMessageId?: string
  summary?: string
  createdAt: number
  updatedAt: number
}

export interface ThreadWorkspaceState {
  threadId: string
  artifacts: WorkspaceArtifact[]
  activeArtifactId: string | null
  lastUpdatedAt: number
}

export interface WorkspaceArtifactPayload {
  artifactType: WorkspaceArtifactType
  operation: "append" | "replace" | "update"
  title?: string
  summary?: string
  focus?: boolean
  artifactId?: string
  data: Record<string, unknown>
}
