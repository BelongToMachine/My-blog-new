import * as React from "react"

import { cn } from "@/lib/utils"

interface CodeWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  language?: string
  code: string
}

export function CodeWindow({
  className,
  title,
  language = "tsx",
  code,
  ...props
}: CodeWindowProps) {
  return (
    <div
      className={cn(
        "pixel-panel panel-grid overflow-hidden border border-border/80 bg-[linear-gradient(180deg,rgba(22,8,44,0.98),rgba(10,8,25,0.98))] text-slate-100 shadow-[var(--shadow-elevated)]",
        className
      )}
      {...props}
    >
      <div className="font-pixel flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-slate-300">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-[hsl(var(--signal-rose))]" />
            <span className="h-2.5 w-2.5 bg-[hsl(var(--signal-amber))]" />
            <span className="h-2.5 w-2.5 bg-[hsl(var(--signal-green))]" />
          </span>
          <span>{title}</span>
        </div>
        <span className="text-primary">{language}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-6 text-slate-100 sm:px-5">
        <code>{code}</code>
      </pre>
    </div>
  )
}
