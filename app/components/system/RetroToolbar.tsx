import * as React from "react"

import { cn } from "@/lib/utils"

export function RetroToolbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "pixel-panel panel-grid flex flex-wrap items-center gap-3 border border-border/80 bg-card/88 px-4 py-4",
        className
      )}
      {...props}
    />
  )
}

