"use client"

import { useTranslations } from "next-intl"
import type {
  WorkspaceArtifact,
  WorkspacePendingIntent,
} from "@/app/types/ai-workspace"
import { getWorkspaceArtifactLabelKey } from "@/app/types/ai-workspace"
import { cn } from "@/lib/utils"

interface ArtifactListProps {
  artifacts: WorkspaceArtifact[]
  activeArtifactId: string | null
  pendingIntent: WorkspacePendingIntent | null
  onSelect: (id: string) => void
}

export default function ArtifactList({
  artifacts,
  activeArtifactId,
  pendingIntent,
  onSelect,
}: ArtifactListProps) {
  const t = useTranslations("ai")

  if (artifacts.length === 0) return null

  return (
    <div className="shrink-0 border-b border-border/40 px-4 py-2 md:px-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {artifacts.map((artifact) => {
          const isPendingTarget = pendingIntent?.targetArtifactId === artifact.id
          const isActive = activeArtifactId === artifact.id
          const hasError = artifact.status === "error"

          return (
            <button
              key={artifact.id}
              onClick={() => onSelect(artifact.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 border-2 px-3 py-1.5 font-pixel text-[9px] uppercase tracking-[0.14em] transition-colors",
                isActive
                  ? "border-primary/60 bg-primary/[0.08] text-primary"
                  : "border-border/32 bg-background/68 text-muted-foreground hover:border-border/60 hover:bg-background/82",
              )}
            >
              <span
                className={cn(
                  "block h-2 w-2 shrink-0",
                  hasError
                    ? "bg-destructive"
                    : isPendingTarget || artifact.status === "updating"
                      ? "animate-pulse bg-primary"
                      : "bg-border/60",
                )}
              />
              <span className="block max-w-[148px] truncate">
                {artifact.title || t(getWorkspaceArtifactLabelKey(artifact.type))}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
