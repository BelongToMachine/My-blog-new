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
        "pixel-panel panel-grid border border-border/80 bg-card/88 p-4",
        className
      )}
      {...props}
    >
      <div className="terminal-label">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground">
        {value}
      </div>
      {hint ? (
        <div className="mt-2 text-sm leading-6 text-muted-foreground">{hint}</div>
      ) : null}
    </div>
  )
}
