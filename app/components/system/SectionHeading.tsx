import * as React from "react"

import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  align?: "left" | "center"
  className?: string
  titleClassName?: string
  variant?: "retro" | "plain"
}

const SectionHeading = ({
  title,
  description,
  action,
  align = "center",
  className,
  titleClassName,
  variant = "retro",
}: SectionHeadingProps) => {
  const isPlain = variant === "plain"

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
          {!isPlain ? <div className="terminal-label">system heading</div> : null}
          <h2
            className={cn(
              isPlain
                ? "max-w-4xl text-balance text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground"
                : "pixel-heading max-w-4xl text-balance",
              titleClassName
            )}
          >
            {title}
          </h2>
          {description ? (
            <p
              className={cn(
                isPlain
                  ? "max-w-xl text-pretty text-sm leading-7 text-muted-foreground md:max-w-2xl md:text-base md:leading-8"
                  : "max-w-xl font-pixel text-[11px] leading-6 tracking-[0.08em] text-muted-foreground md:max-w-2xl md:text-[12px] md:leading-7"
              )}
            >
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
