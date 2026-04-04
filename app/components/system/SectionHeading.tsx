import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  align?: "left" | "center"
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

const SectionHeading = ({
  title,
  description,
  action,
  align = "center",
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeadingProps) => {
  const isCentered = align === "center"

  return (
    <div
      className={cn(
        "relative mb-6 flex flex-col gap-3",
        isCentered ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <div className="w-full">
        <div className={cn("space-y-2", isCentered && "mx-auto")}>
          <h2
            className={cn(
              "text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl",
              "bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent",
              titleClassName
            )}
          >
            {title}
          </h2>
          {description ? (
            <p
              className={cn(
                "max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base",
                descriptionClassName
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? (
        <div
          className={cn(
            "shrink-0",
            isCentered
              ? "sm:absolute sm:right-0 sm:top-0"
              : "self-start"
          )}
        >
          {action}
        </div>
      ) : null}
    </div>
  )
}

export default SectionHeading
