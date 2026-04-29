"use client"

import type { WorkspaceArtifact } from "@/app/types/ai-workspace"
import { cn } from "@/lib/utils"

interface ArtifactListProps {
  artifacts: WorkspaceArtifact[]
  activeArtifactId: string | null
  onSelect: (id: string) => void
}

const TYPE_LABELS: Record<WorkspaceArtifact["type"], string> = {
  "profile-card": "Profile",
  "project-grid": "Projects",
  "article-summary": "Articles",
  timeline: "Timeline",
  "comparison-table": "Comparison",
  "role-fit-report": "Role Fit",
}

export default function ArtifactList({
  artifacts,
  activeArtifactId,
  onSelect,
}: ArtifactListProps) {
  if (artifacts.length === 0) return null

  return (
    <div className="shrink-0 border-b border-border/40 px-4 py-2 md:px-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {artifacts.map((artifact) => (
          <button
            key={artifact.id}
            onClick={() => onSelect(artifact.id)}
            className={cn(
              "shrink-0 border-2 px-3 py-1.5 font-pixel text-[9px] uppercase tracking-[0.14em] transition-colors",
              activeArtifactId === artifact.id
                ? "border-primary/60 bg-primary/[0.08] text-primary"
                : "border-border/30 bg-background/30 text-muted-foreground hover:border-border/60 hover:bg-background/60",
            )}
          >
            <span className="block truncate max-w-[120px]">
              {artifact.title || TYPE_LABELS[artifact.type] || artifact.type}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
