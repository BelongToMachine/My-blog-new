"use client"

import { useTranslations } from "next-intl"
import type { WorkspaceArtifact } from "@/app/types/ai-workspace"
import WorkspaceHeader from "./WorkspaceHeader"
import ArtifactList from "./ArtifactList"
import ArtifactRenderer from "./ArtifactRenderer"

interface WorkspacePanelProps {
  threadTitle: string
  artifacts: WorkspaceArtifact[]
  activeArtifactId: string | null
  activeArtifact: WorkspaceArtifact | undefined
  onSelectArtifact: (id: string) => void
  onClearWorkspace: () => void
  isBusy?: boolean
}

export default function WorkspacePanel({
  threadTitle,
  artifacts,
  activeArtifactId,
  activeArtifact,
  onSelectArtifact,
  onClearWorkspace,
  isBusy,
}: WorkspacePanelProps) {
  const t = useTranslations("ai")

  return (
    <div className="flex h-full flex-col overflow-hidden border-l-2 border-border/60 bg-background/40">
      <WorkspaceHeader
        threadTitle={threadTitle}
        artifactCount={artifacts.length}
        onClear={onClearWorkspace}
      />

      <ArtifactList
        artifacts={artifacts}
        activeArtifactId={activeArtifactId}
        onSelect={onSelectArtifact}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-5">
        {artifacts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="font-pixel text-4xl text-primary/20">◈</div>
            <div className="space-y-2">
              <p className="font-pixel text-sm uppercase tracking-[0.2em] text-muted-foreground/50">
                {t("workspaceEmpty") ?? "Workspace is empty"}
              </p>
              <p className="font-pixel max-w-xs text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground/30">
                {t("workspaceEmptyHint") ??
                  "Ask the AI to generate a project grid, timeline, or comparison table."}
              </p>
            </div>
          </div>
        ) : activeArtifact ? (
          <div className="space-y-4">
            {activeArtifact.status === "updating" ? (
              <div className="flex items-center gap-2 pb-2">
                <span className="inline-block h-2 w-2 animate-pulse bg-primary" />
                <span className="font-pixel text-[10px] uppercase tracking-[0.2em] text-primary/70">
                  {t("artifactUpdating") ?? "Updating..."}
                </span>
              </div>
            ) : null}
            <ArtifactRenderer artifact={activeArtifact} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="font-pixel text-4xl text-primary/20">◈</div>
            <p className="font-pixel text-sm uppercase tracking-[0.2em] text-muted-foreground/50">
              {t("workspaceEmpty") ?? "Workspace is empty"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
