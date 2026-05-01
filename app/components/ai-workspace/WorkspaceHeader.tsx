"use client"

import { useTranslations } from "next-intl"

interface WorkspaceHeaderProps {
  threadTitle: string
  artifactCount: number
  isBusy?: boolean
  onClear: () => void
}

export default function WorkspaceHeader({
  threadTitle,
  artifactCount,
  isBusy = false,
  onClear,
}: WorkspaceHeaderProps) {
  const t = useTranslations("ai")

  const handleClear = () => {
    if (typeof window === "undefined") {
      onClear()
      return
    }

    if (window.confirm(t("clearWorkspaceConfirm"))) {
      onClear()
    }
  }

  return (
    <div className="flex items-center justify-between border-b-2 border-border/60 px-4 py-3 md:px-5">
      <div className="min-w-0">
        <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          {t("workspaceEyebrow")}
        </p>
        <div className="flex items-center gap-2">
          <p className="truncate font-pixel text-xs uppercase tracking-[0.14em] text-foreground">
            {threadTitle}
          </p>
          {isBusy ? (
            <span className="font-pixel text-[8px] uppercase tracking-[0.18em] text-primary/70">
              {t("workspaceLive")}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-pixel text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50">
          {artifactCount}{" "}
          {artifactCount === 1 ? t("artifactSingular") : t("artifactPlural")}
        </span>
        {artifactCount > 0 ? (
          <button
            onClick={handleClear}
            className="font-pixel px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50 transition-colors hover:text-destructive"
            title={t("clearWorkspace")}
          >
            {t("clear")}
          </button>
        ) : null}
      </div>
    </div>
  )
}
