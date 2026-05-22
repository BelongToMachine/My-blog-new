"use client"

import { useTranslations } from "next-intl"
import type {
  ArticleSummaryArtifactData,
  ComparisonTableArtifactData,
  ProfileCardArtifactData,
  ProjectGridArtifactData,
  RoleFitReportArtifactData,
  TimelineArtifactData,
  WorkspaceArtifact,
} from "@/app/types/ai-workspace"
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
  const t = useTranslations("ai")
  const { type, data, title } = artifact

  switch (type) {
    case "profile-card":
      return <ProfileCardBlock title={title} data={data as ProfileCardArtifactData} />
    case "project-grid":
      return <ProjectGridBlock title={title} data={data as ProjectGridArtifactData} />
    case "article-summary":
      return (
        <ArticleSummaryBlock title={title} data={data as ArticleSummaryArtifactData} />
      )
    case "timeline":
      return <TimelineBlock title={title} data={data as TimelineArtifactData} />
    case "comparison-table":
      return (
        <ComparisonTableBlock
          title={title}
          data={data as ComparisonTableArtifactData}
        />
      )
    case "role-fit-report":
      return (
        <RoleFitReportBlock title={title} data={data as RoleFitReportArtifactData} />
      )
    default:
      return (
        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {t("unknownArtifactType")}
        </div>
      )
  }
}
