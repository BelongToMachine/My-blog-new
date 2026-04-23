import * as React from "react"

import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  align?: "left" | "center"
  className?: string
}

const SectionHeading = ({
  title,
  description,
  action,
  align = "center",
  className,
}: SectionHeadingProps) => {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 md:mb-8 md:gap-4 lg:mb-10",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full gap-4",
          align === "center"
            ? "flex-col items-center"
            : "flex-col items-start md:flex-row md:items-end md:justify-between"
        )}
      >
        <div className="space-y-2 md:space-y-3">
          <div className="terminal-label">system heading</div>
          <h2 className="pixel-heading max-w-4xl text-balance">
            {title}
          </h2>
          {description ? (
            <p className="max-w-xl text-sm leading-6 text-muted-foreground md:max-w-2xl md:text-base md:leading-7">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  )
}

export default SectionHeading
