import * as React from "react"

import { cn } from "@/lib/utils"

interface TerminalPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "cyan" | "amber" | "rose" | "neutral"
}

const toneClasses: Record<NonNullable<TerminalPillProps["tone"]>, string> = {
  cyan: "border-primary/60 bg-primary/10 text-primary",
  amber: "border-[hsl(var(--signal-amber))]/50 bg-[hsl(var(--signal-amber))]/10 text-[hsl(var(--signal-amber))]",
  rose: "border-[hsl(var(--signal-rose))]/50 bg-[hsl(var(--signal-rose))]/10 text-[hsl(var(--signal-rose))]",
  neutral: "border-border/70 bg-muted/60 text-muted-foreground",
}

export function TerminalPill({
  className,
  tone = "neutral",
  ...props
}: TerminalPillProps) {
  return (
    <span
      className={cn(
        "font-pixel inline-flex items-center border px-2.5 py-1 text-[10px] uppercase tracking-[0.24em]",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  )
}
