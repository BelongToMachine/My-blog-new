"use client"

import { useTranslations } from "next-intl"
import type { WorkspaceArtifact } from "@/app/types/ai-workspace"

interface WorkspaceHeaderProps {
  threadTitle: string
  artifactCount: number
  onClear: () => void
}

export default function WorkspaceHeader({
  threadTitle,
  artifactCount,
  onClear,
}: WorkspaceHeaderProps) {
  const t = useTranslations("ai")

  return (
    <div className="flex items-center justify-between border-b-2 border-border/60 px-4 py-3 md:px-5">
      <div className="min-w-0">
        <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          {t("workspaceEyebrow") ?? "Workspace"}
        </p>
        <p className="truncate font-pixel text-xs uppercase tracking-[0.14em] text-foreground">
          {threadTitle}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-pixel text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50">
          {artifactCount}{" "}
          {artifactCount === 1
            ? t("artifactSingular") ?? "artifact"
            : t("artifactPlural") ?? "artifacts"}
        </span>
        {artifactCount > 0 ? (
          <button
            onClick={onClear}
            className="font-pixel px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50 transition-colors hover:text-destructive"
            title={t("clearWorkspace") ?? "Clear workspace"}
          >
            {t("clear") ?? "Clear"}
          </button>
        ) : null}
      </div>
    </div>
  )
}
