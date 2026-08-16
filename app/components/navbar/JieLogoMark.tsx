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
        "h-10 w-8 shrink-0 overflow-visible text-[#fcc31e] dark:text-[#fcc31e]",
        className,
      )}
      fill="none"
      viewBox="0 0 28 40"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="origin-center motion-reduce:animate-none group-hover:animate-[jie-logo-line-jitter_480ms_ease-in-out]"
        d="M3.5 9.5c1.5 2.4 2.8 5.3 4.6 6.2 1.8.9 3.5-4.3 4.8-6.6 1.2-2.2 2.3 3.5 3.8 5.5 1.1 1.5 2.2 1.7 3.2.6 1.4-1.5 2.1-3.6 3.1-5.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.2"
      />
      <path
        className="origin-center motion-reduce:animate-none group-hover:[animation-delay:40ms] group-hover:animate-[jie-logo-line-jitter_480ms_ease-in-out]"
        d="M7.5 34.6c1.8-2.9 4.1-6.9 6.3-9.7 2.1 2.7 4.5 6.7 6.7 9.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.2"
      />
    </svg>
  ),
)

JieLogoMark.displayName = "JieLogoMark"

export default JieLogoMark
