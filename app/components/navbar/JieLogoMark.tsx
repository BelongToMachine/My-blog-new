import * as React from "react"

import { cn } from "@/lib/utils"

interface JieLogoMarkProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

const JieLogoMark = React.forwardRef<SVGSVGElement, JieLogoMarkProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      aria-hidden="true"
      className={cn(
        "h-8 w-7 shrink-0 overflow-visible text-black dark:text-white -translate-y-1",
        className,
      )}
      fill="none"
      viewBox="0 0 28 40"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="origin-center motion-reduce:animate-none group-hover:animate-[jie-logo-line-tilt-top_420ms_ease-out_forwards]"
        d="M3.5 9.5L8.5 16L13.5 9.5L18.5 16L24.5 9.5"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="3.2"
      />
      <path
        className="origin-center motion-reduce:animate-none group-hover:[animation-delay:35ms] group-hover:animate-[jie-logo-line-tilt-bottom_420ms_ease-out_forwards]"
        d="M7.5 34.5L14 24.5L20.5 34.5"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="3.2"
      />
    </svg>
  ),
)

JieLogoMark.displayName = "JieLogoMark"

export default JieLogoMark
