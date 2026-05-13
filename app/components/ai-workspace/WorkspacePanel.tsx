"use client"

import { useLocale, useTranslations } from "next-intl"
import type {
  WorkspaceArtifact,
  WorkspacePendingIntent,
} from "@/app/types/ai-workspace"
import { getWorkspaceArtifactLabelKey } from "@/app/types/ai-workspace"
import WorkspaceHeader from "./WorkspaceHeader"
import ArtifactList from "./ArtifactList"
import ArtifactRenderer from "./ArtifactRenderer"

interface WorkspacePanelProps {
  threadTitle: string
  artifacts: WorkspaceArtifact[]
  activeArtifactId: string | null
  activeArtifact: WorkspaceArtifact | undefined
  pendingIntent: WorkspacePendingIntent | null
  onSelectArtifact: (id: string) => void
  onClearWorkspace: () => void
  isBusy?: boolean
}

function formatRelativeTime(ts: number, locale: string): string {
  const diffMs = ts - Date.now()
  const absDiffMs = Math.abs(diffMs)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  if (absDiffMs < 60000) {
    return rtf.format(0, "minute")
  }

  if (absDiffMs < 3600000) {
    return rtf.format(Math.round(diffMs / 60000), "minute")
  }

  if (absDiffMs < 86400000) {
    return rtf.format(Math.round(diffMs / 3600000), "hour")
  }

  if (absDiffMs < 604800000) {
    return rtf.format(Math.round(diffMs / 86400000), "day")
  }

  return new Date(ts).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  })
}

function PendingArtifactState({
  label,
  description,
}: {
  label: string
  description: string
}) {
  return (
    <div className="space-y-5 border-2 border-dashed border-primary/28 bg-background/78 p-5 shadow-[inset_0_0_0_1px_hsl(var(--background)/0.18)]">
      <div className="space-y-2">
        <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-primary/80">
          {label}
        </p>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-1/3 animate-pulse bg-primary/12" />
        <div className="h-16 animate-pulse bg-background/90" />
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="h-24 animate-pulse bg-background/82" />
          <div className="h-24 animate-pulse bg-background/82" />
        </div>
      </div>
    </div>
  )
}

export default function WorkspacePanel({
  threadTitle,
  artifacts,
  activeArtifactId,
  activeArtifact,
  pendingIntent,
  onSelectArtifact,
  onClearWorkspace,
  isBusy,
}: WorkspacePanelProps) {
  const t = useTranslations("ai")
  const locale = useLocale()

  const pendingLabel = pendingIntent
    ? pendingIntent.title?.trim() ||
      t(getWorkspaceArtifactLabelKey(pendingIntent.artifactType))
    : null
  const showPendingPreview = Boolean(
    pendingIntent && pendingIntent.focus !== false && !pendingIntent.targetArtifactId,
  )
  const showUpdatingBadge = Boolean(
    pendingIntent &&
      activeArtifact &&
      pendingIntent.targetArtifactId === activeArtifact.id,
  )

  const activeSummary = activeArtifact?.summary?.trim()
  const activeTypeLabel = activeArtifact
    ? t(getWorkspaceArtifactLabelKey(activeArtifact.type))
    : null

  return (
    <div className="flex h-full flex-col overflow-hidden bg-transparent">
      <WorkspaceHeader
        threadTitle={threadTitle}
        artifactCount={artifacts.length}
        isBusy={isBusy}
        onClear={onClearWorkspace}
      />

      <ArtifactList
        artifacts={artifacts}
        activeArtifactId={activeArtifactId}
        pendingIntent={pendingIntent}
        onSelect={onSelectArtifact}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-5">
        {artifacts.length === 0 && !showPendingPreview ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="font-pixel text-4xl text-primary/20">◈</div>
            <div className="space-y-2">
              <p className="font-pixel text-sm uppercase tracking-[0.2em] text-muted-foreground/50">
                {t("workspaceEmpty")}
              </p>
              <p className="font-pixel max-w-xs text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground/30">
                {t("workspaceEmptyHint")}
              </p>
            </div>
          </div>
        ) : showPendingPreview && pendingLabel ? (
          <PendingArtifactState
            label={pendingLabel}
            description={
              pendingIntent?.operation === "update"
                ? t("artifactPendingUpdate", { artifact: pendingLabel })
                : t("artifactPendingAppend", { artifact: pendingLabel })
            }
          />
        ) : activeArtifact ? (
          <div className="space-y-4">
            <div className="space-y-2 border-b border-border/30 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-primary/80">
                  {activeArtifact.title || activeTypeLabel}
                </p>
                {showUpdatingBadge || activeArtifact.status === "updating" ? (
                  <span className="font-pixel text-[8px] uppercase tracking-[0.18em] text-primary/70">
                    {t("artifactUpdating")}
                  </span>
                ) : null}
                {activeArtifact.status === "error" ? (
                  <span className="font-pixel text-[8px] uppercase tracking-[0.18em] text-destructive">
                    {t("artifactError")}
                  </span>
                ) : null}
              </div>

              {activeSummary ? (
                <p className="text-sm leading-7 text-muted-foreground">{activeSummary}</p>
              ) : null}

              <div className="flex flex-wrap gap-x-4 gap-y-1 font-pixel text-[9px] uppercase tracking-[0.16em] text-muted-foreground/55">
                {activeTypeLabel ? (
                  <span>
                    {t("artifactTypeMetaLabel")}: {activeTypeLabel}
                  </span>
                ) : null}
                <span>
                  {t("artifactUpdatedLabel")}:{" "}
                  {formatRelativeTime(activeArtifact.updatedAt, locale)}
                </span>
              </div>
            </div>

            <ArtifactRenderer artifact={activeArtifact} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="font-pixel text-4xl text-primary/20">◈</div>
            <p className="font-pixel text-sm uppercase tracking-[0.2em] text-muted-foreground/50">
              {t("workspaceEmpty")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
