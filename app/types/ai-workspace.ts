import { z } from "zod"

export const WORKSPACE_ARTIFACT_TYPES = [
  "project-grid",
  "comparison-table",
  "timeline",
  "role-fit-report",
  "profile-card",
  "article-summary",
] as const

export type WorkspaceArtifactType =
  (typeof WORKSPACE_ARTIFACT_TYPES)[number]

export const WORKSPACE_ARTIFACT_OPERATIONS = [
  "append",
  "replace",
  "update",
] as const

export type WorkspaceArtifactOperation =
  (typeof WORKSPACE_ARTIFACT_OPERATIONS)[number]

export const WORKSPACE_VISUAL_TOOL_NAMES = [
  "build_ui_block",
  "get_profile_summary",
  "list_projects",
  "search_articles",
] as const

export type WorkspaceVisualToolName =
  (typeof WORKSPACE_VISUAL_TOOL_NAMES)[number]

export type WorkspaceArtifactStatus = "ready" | "updating" | "error"

export interface ProfileCardArtifactData {
  name?: string
  role?: string
  location?: string
  experience?: string
  focus?: string[]
  productAreas?: string[]
  contact?: {
    email?: string
    github?: string
    linkedin?: string
  }
}

export interface ProjectGridItem {
  title: string
  description: string
  tech: string[]
  highlights: string[]
}

export interface ProjectGridArtifactData {
  projects?: ProjectGridItem[]
}

export interface ArticleSummaryItem {
  slug: string
  title: string
  description: string
  publishedOn: string
  locale: string
}

export interface ArticleSummaryArtifactData {
  articles?: ArticleSummaryItem[]
}

export interface TimelineItem {
  period: string
  title: string
  description: string
}

export interface TimelineArtifactData {
  items?: TimelineItem[]
}

export interface ComparisonRow {
  label: string
  values: string[]
}

export interface ComparisonTableArtifactData {
  headers?: string[]
  rows?: ComparisonRow[]
}

export interface RoleFitReferenceItem {
  title: string
  reason: string
  slug?: string
  href?: string
}

export interface RoleFitReportArtifactData {
  fitScore?: number
  strengths?: string[]
  matchedProjects?: RoleFitReferenceItem[]
  matchedArticles?: RoleFitReferenceItem[]
  possibleRisks?: string[]
  recommendedTalkingPoints?: string[]
}

export interface WorkspaceArtifactDataMap {
  "profile-card": ProfileCardArtifactData
  "project-grid": ProjectGridArtifactData
  "article-summary": ArticleSummaryArtifactData
  timeline: TimelineArtifactData
  "comparison-table": ComparisonTableArtifactData
  "role-fit-report": RoleFitReportArtifactData
}

export type WorkspaceArtifactData =
  WorkspaceArtifactDataMap[WorkspaceArtifactType]

export interface WorkspaceArtifact<
  T extends WorkspaceArtifactType = WorkspaceArtifactType,
> {
  id: string
  threadId: string
  type: T
  title?: string
  data: WorkspaceArtifactDataMap[T]
  status: WorkspaceArtifactStatus
  sourceMessageId?: string
  summary?: string
  createdAt: number
  updatedAt: number
}

export interface WorkspacePendingIntent {
  sourceId: string
  toolName: WorkspaceVisualToolName
  artifactType: WorkspaceArtifactType
  operation: WorkspaceArtifactOperation
  targetArtifactId?: string
  title?: string
  summary?: string
  focus: boolean
  surface: "chat" | "artifact"
  reveal: boolean
  priority: "low" | "high"
}

export interface ThreadWorkspaceState {
  threadId: string
  artifacts: WorkspaceArtifact[]
  activeArtifactId: string | null
  lastUpdatedAt: number
  appliedToolOutputIds: string[]
  pendingIntent: WorkspacePendingIntent | null
}

type WorkspacePayloadBase<
  TType extends WorkspaceArtifactType,
  TData extends WorkspaceArtifactDataMap[TType],
> = {
  artifactType: TType
  operation: WorkspaceArtifactOperation
  title?: string
  summary?: string
  focus?: boolean
  artifactId?: string
  surface?: "chat" | "artifact"
  reveal?: boolean
  priority?: "low" | "high"
  data: TData
}

export type WorkspaceArtifactPayload =
  | WorkspacePayloadBase<"profile-card", ProfileCardArtifactData>
  | WorkspacePayloadBase<"project-grid", ProjectGridArtifactData>
  | WorkspacePayloadBase<"article-summary", ArticleSummaryArtifactData>
  | WorkspacePayloadBase<"timeline", TimelineArtifactData>
  | WorkspacePayloadBase<"comparison-table", ComparisonTableArtifactData>
  | WorkspacePayloadBase<"role-fit-report", RoleFitReportArtifactData>

const optionalTextSchema = z.string().trim().min(1).optional()
const stringListSchema = z.array(z.string().trim().min(1)).default([])

export const profileCardArtifactDataSchema = z.object({
  name: optionalTextSchema,
  role: optionalTextSchema,
  location: optionalTextSchema,
  experience: optionalTextSchema,
  focus: stringListSchema.optional(),
  productAreas: stringListSchema.optional(),
  contact: z
    .object({
      email: optionalTextSchema,
      github: optionalTextSchema,
      linkedin: optionalTextSchema,
    })
    .optional(),
})

export const projectGridArtifactDataSchema = z.object({
  projects: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
        tech: stringListSchema,
        highlights: stringListSchema,
      }),
    )
    .default([]),
})

export const articleSummaryArtifactDataSchema = z.object({
  articles: z
    .array(
      z.object({
        slug: z.string().trim().min(1),
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
        publishedOn: z.string().trim().min(1),
        locale: z.string().trim().min(1),
      }),
    )
    .default([]),
})

export const timelineArtifactDataSchema = z.object({
  items: z
    .array(
      z.object({
        period: z.string().trim().min(1),
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
      }),
    )
    .default([]),
})

export const comparisonTableArtifactDataSchema = z.object({
  headers: z.array(z.string().trim().min(1)).default([]),
  rows: z
    .array(
      z.object({
        label: z.string().trim().min(1),
        values: z.array(z.string().trim()).default([]),
      }),
    )
    .default([]),
})

export const roleFitReferenceItemSchema = z.object({
  title: z.string().trim().min(1),
  reason: z.string().trim().min(1),
  slug: optionalTextSchema,
  href: optionalTextSchema,
})

export const roleFitReportArtifactDataSchema = z.object({
  fitScore: z.number().min(0).max(100).optional(),
  strengths: stringListSchema.optional(),
  matchedProjects: z.array(roleFitReferenceItemSchema).default([]),
  matchedArticles: z.array(roleFitReferenceItemSchema).default([]),
  possibleRisks: stringListSchema.optional(),
  recommendedTalkingPoints: stringListSchema.optional(),
})

const workspacePayloadMetaSchema = z.object({
  operation: z.enum(WORKSPACE_ARTIFACT_OPERATIONS).default("append"),
  title: optionalTextSchema,
  summary: optionalTextSchema,
  focus: z.boolean().default(true),
  artifactId: optionalTextSchema,
  surface: z.enum(["chat", "artifact"]).default("artifact"),
  reveal: z.boolean().default(false),
  priority: z.enum(["low", "high"]).default("low"),
})

export const workspaceArtifactPayloadSchema = z.discriminatedUnion(
  "artifactType",
  [
    workspacePayloadMetaSchema.extend({
      artifactType: z.literal("profile-card"),
      data: profileCardArtifactDataSchema,
    }),
    workspacePayloadMetaSchema.extend({
      artifactType: z.literal("project-grid"),
      data: projectGridArtifactDataSchema,
    }),
    workspacePayloadMetaSchema.extend({
      artifactType: z.literal("article-summary"),
      data: articleSummaryArtifactDataSchema,
    }),
    workspacePayloadMetaSchema.extend({
      artifactType: z.literal("timeline"),
      data: timelineArtifactDataSchema,
    }),
    workspacePayloadMetaSchema.extend({
      artifactType: z.literal("comparison-table"),
      data: comparisonTableArtifactDataSchema,
    }),
    workspacePayloadMetaSchema.extend({
      artifactType: z.literal("role-fit-report"),
      data: roleFitReportArtifactDataSchema,
    }),
  ],
)

export function isWorkspaceVisualToolName(
  toolName: string,
): toolName is WorkspaceVisualToolName {
  return WORKSPACE_VISUAL_TOOL_NAMES.includes(
    toolName as WorkspaceVisualToolName,
  )
}

export function getWorkspaceArtifactLabelKey(type: WorkspaceArtifactType) {
  switch (type) {
    case "profile-card":
      return "artifactTypeProfileCard"
    case "project-grid":
      return "artifactTypeProjectGrid"
    case "article-summary":
      return "artifactTypeArticleSummary"
    case "timeline":
      return "artifactTypeTimeline"
    case "comparison-table":
      return "artifactTypeComparisonTable"
    case "role-fit-report":
      return "artifactTypeRoleFitReport"
  }
}

export function getEmptyWorkspaceState(threadId: string): ThreadWorkspaceState {
  return {
    threadId,
    artifacts: [],
    activeArtifactId: null,
    lastUpdatedAt: Date.now(),
    appliedToolOutputIds: [],
    pendingIntent: null,
  }
}

export function safeParseWorkspaceArtifactPayload(
  input: unknown,
): WorkspaceArtifactPayload | null {
  if (!input || typeof input !== "object") {
    return null
  }

  const raw = input as Record<string, unknown>
  const candidate =
    typeof raw.blockType === "string" && typeof raw.artifactType !== "string"
      ? { ...raw, artifactType: raw.blockType }
      : raw

  const parsed = workspaceArtifactPayloadSchema.safeParse(candidate)
  return parsed.success ? parsed.data : null
}
