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
        "pixel-panel panel-grid flex flex-col border border-border/80 bg-card/88 px-6 py-7 md:px-5 md:py-6 lg:p-4",
        className
      )}
      {...props}
    >
      <div className="terminal-label">{label}</div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 pt-5 md:gap-3 md:pt-4 lg:gap-2 lg:pt-3">
        <div className="font-pixel text-2xl uppercase tracking-[0.08em] text-foreground md:text-3xl">
          {value}
        </div>
        {hint ? (
          <div className="text-sm leading-6 text-muted-foreground">{hint}</div>
        ) : null}
      </div>
    </div>
  )
}
