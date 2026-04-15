import * as React from "react"

import { cn } from "@/lib/utils"
import { RetroBadge } from "./RetroBadge"

type RetroNoticeTone = "info" | "warning" | "danger" | "success"

const toneToBadge: Record<RetroNoticeTone, React.ComponentProps<typeof RetroBadge>["tone"]> = {
  info: "primary",
  warning: "amber",
  danger: "rose",
  success: "green",
}

interface RetroNoticeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: RetroNoticeTone
  title: React.ReactNode
}

export function RetroNotice({
  className,
  tone = "info",
  title,
  children,
  ...props
}: RetroNoticeProps) {
  return (
    <div
      className={cn(
        "pixel-panel panel-grid border border-border/80 bg-card/92 p-4 text-sm leading-7 text-muted-foreground",
        className
      )}
      {...props}
    >
      <div className="mb-3 flex items-center gap-3">
        <RetroBadge tone={toneToBadge[tone]}>{tone}</RetroBadge>
        <strong className="font-pixel text-[10px] uppercase tracking-[0.2em] text-foreground">
          {title}
        </strong>
      </div>
      <div>{children}</div>
    </div>
  )
}
