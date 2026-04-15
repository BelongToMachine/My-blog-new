import * as React from "react"

import { cn } from "@/lib/utils"

type RetroBadgeTone = "neutral" | "primary" | "amber" | "rose" | "green"

const toneStyles: Record<RetroBadgeTone, string> = {
  neutral: "border-border/80 bg-muted/70 text-muted-foreground",
  primary: "border-primary/70 bg-primary/15 text-primary",
  amber:
    "border-[hsl(var(--signal-amber))]/60 bg-[hsl(var(--signal-amber))]/12 text-[hsl(var(--signal-amber))]",
  rose:
    "border-[hsl(var(--signal-rose))]/60 bg-[hsl(var(--signal-rose))]/12 text-[hsl(var(--signal-rose))]",
  green:
    "border-[hsl(var(--signal-green))]/60 bg-[hsl(var(--signal-green))]/12 text-[hsl(var(--signal-green))]",
}

interface RetroBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: RetroBadgeTone
}

export function RetroBadge({
  className,
  tone = "neutral",
  ...props
}: RetroBadgeProps) {
  return (
    <span
      className={cn(
        "font-pixel inline-flex items-center border px-2.5 py-1 text-[10px] uppercase tracking-[0.22em]",
        toneStyles[tone],
        className
      )}
      {...props}
    />
  )
}

