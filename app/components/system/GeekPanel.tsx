import * as React from "react"

import { cn } from "@/lib/utils"

interface GeekPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
  eyebrow?: React.ReactNode
  aside?: React.ReactNode
}

const GeekPanel = React.forwardRef<HTMLDivElement, GeekPanelProps>(
  ({ className, title, eyebrow, aside, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "pixel-panel panel-grid relative overflow-hidden border border-border/80 bg-card/90 text-card-foreground shadow-[var(--shadow-elevated)]",
          className
        )}
        {...props}
      >
        {(title || eyebrow || aside) ? (
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 px-5 py-4 sm:px-6">
            <div className="space-y-2">
              {eyebrow ? <p className="terminal-label">{eyebrow}</p> : null}
              {title ? <div className="text-lg font-semibold tracking-[-0.03em]">{title}</div> : null}
            </div>
            {aside ? <div className="shrink-0">{aside}</div> : null}
          </header>
        ) : null}
        <div className="relative px-5 py-5 sm:px-6 sm:py-6">{children}</div>
      </section>
    )
  }
)

GeekPanel.displayName = "GeekPanel"

export default GeekPanel
