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
        "mb-8 flex flex-col gap-3 lg:mb-10",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full gap-4",
          align === "center"
            ? "flex-col items-center"
            : "flex-col items-start sm:flex-row sm:items-end sm:justify-between"
        )}
      >
        <div className="space-y-2">
          <h2 className="text-balance text-4xl font-extrabold leading-normal text-transparent bg-gradient-to-r from-primary-400 to-secondary-600 bg-clip-text lg:text-6xl lg:leading-relaxed">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
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
