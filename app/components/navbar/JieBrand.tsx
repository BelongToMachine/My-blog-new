"use client"

import { Link } from "@/app/i18n/navigation"
import JieLogoMark from "./JieLogoMark"

export default function JieBrand() {
  return (
    <Link
      aria-label="Jie Craft — home"
      className="group inline-flex h-11 shrink-0 items-center font-juvenile-rounded text-[1.5rem] font-bold leading-none tracking-[-0.045em] text-[#fcc31e] sm:text-[1.65rem]"
      href="/"
    >
      <span>Jie</span>
      <JieLogoMark />
      <span>Craft</span>
    </Link>
  )
}
