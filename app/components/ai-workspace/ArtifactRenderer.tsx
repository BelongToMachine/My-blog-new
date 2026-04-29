"use client"

import type { WorkspaceArtifact } from "@/app/types/ai-workspace"
import {
  ProfileCardBlock,
  ProjectGridBlock,
  ArticleSummaryBlock,
  TimelineBlock,
  ComparisonTableBlock,
} from "@/app/components/ai-blocks"
import RoleFitReportBlock from "./RoleFitReportBlock"

interface ArtifactRendererProps {
  artifact: WorkspaceArtifact
}

export default function ArtifactRenderer({ artifact }: ArtifactRendererProps) {
  const { type, data, title } = artifact

  switch (type) {
    case "profile-card":
      return <ProfileCardBlock title={title} data={data} />
    case "project-grid":
      return <ProjectGridBlock title={title} data={data} />
    case "article-summary":
      return <ArticleSummaryBlock title={title} data={data} />
    case "timeline":
      return <TimelineBlock title={title} data={data} />
    case "comparison-table":
      return <ComparisonTableBlock title={title} data={data} />
    case "role-fit-report":
      return <RoleFitReportBlock title={title} data={data} />
    default:
      return (
        <div className="font-pixel text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Unknown artifact type
        </div>
      )
  }
}
