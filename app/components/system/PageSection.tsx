import * as React from "react"

import { cn } from "@/lib/utils"

interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div"
}

const PageSection = ({
  as = "section",
  className,
  ...props
}: PageSectionProps) => {
  const Comp = as

  return (
    <Comp className={cn("py-10 sm:py-12 lg:py-16", className)} {...props} />
  )
}

export default PageSection
