import * as React from "react"

import { cn } from "@/lib/utils"

interface RetroPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
  eyebrow?: React.ReactNode
  action?: React.ReactNode
  contentClassName?: string
}

const RetroPanel = React.forwardRef<HTMLDivElement, RetroPanelProps>(
  (
    { className, title, eyebrow, action, children, contentClassName, ...props },
    ref
  ) => (
    <section
      ref={ref}
      className={cn(
        "pixel-panel panel-grid overflow-hidden border border-border/80 bg-card/88 text-card-foreground",
        className
      )}
      {...props}
    >
      {(title || eyebrow || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 px-3 py-3.5 sm:px-4 sm:py-4 md:px-5">
          <div className="min-w-0 flex-1 space-y-2">
            {eyebrow ? <div className="terminal-label">{eyebrow}</div> : null}
            {title ? (
              <div className="min-w-0 font-pixel text-sm uppercase tracking-[0.16em] text-foreground md:text-base">
                {title}
              </div>
            ) : null}
          </div>
          {action ? <div className="w-full md:w-auto md:shrink-0">{action}</div> : null}
        </header>
      )}
      <div className={cn("relative px-3 py-3.5 sm:px-4 sm:py-4 md:px-5 md:py-5", contentClassName)}>
        {children}
      </div>
    </section>
  )
)

RetroPanel.displayName = "RetroPanel"

export default RetroPanel
