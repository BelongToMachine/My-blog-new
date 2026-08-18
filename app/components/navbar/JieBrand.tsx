"use client"

import { Link } from "@/app/i18n/navigation"
import JieLogoMark from "./JieLogoMark"

export default function JieBrand() {
  return (
    <Link
      aria-label="Jie Craft — home"
      className="group inline-flex h-11 shrink-0 items-center font-juvenile-rounded text-[1.5rem] font-bold leading-none tracking-[-0.045em] text-black dark:text-white sm:text-[1.65rem]"
      href="/"
    >
      <span className="motion-reduce:animate-none group-hover:animate-[jie-logo-word-tilt-left_420ms_ease-out_forwards]">
        Jie
      </span>
      <JieLogoMark />
      <span className="motion-reduce:animate-none group-hover:animate-[jie-logo-word-tilt-right_420ms_ease-out_forwards]">
        Craft
      </span>
    </Link>
  )
}
