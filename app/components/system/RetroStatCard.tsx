import * as React from "react"

import { cn } from "@/lib/utils"

interface RetroStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  value: React.ReactNode
  hint?: React.ReactNode
}

export function RetroStatCard({
  className,
  label,
  value,
  hint,
  ...props
}: RetroStatCardProps) {
  return (
    <div
      className={cn(
        "pixel-panel panel-grid flex w-full min-w-0 max-w-full flex-col overflow-hidden border border-border/80 bg-card/88 px-2 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 lg:p-4",
        className
      )}
      {...props}
    >
      <div className="terminal-label min-w-0 break-words text-[8px] leading-4 tracking-[0.08em] sm:text-[9px] sm:tracking-[0.16em] md:text-[10px] md:tracking-[0.28em]">
        {label}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2 pt-4 sm:gap-3 md:pt-4 lg:gap-2 lg:pt-3">
        <div className="font-pixel min-w-0 text-xl uppercase tracking-[0.06em] text-foreground sm:text-2xl md:text-3xl md:tracking-[0.08em]">
          {value}
        </div>
        {hint ? (
          <div className="min-w-0 max-w-full text-sm leading-6 text-muted-foreground">
            {hint}
          </div>
        ) : null}
      </div>
    </div>
  )
}
