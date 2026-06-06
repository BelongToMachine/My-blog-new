"use client"

import type { ReactNode } from "react"
import { usePathname } from "@/app/i18n/navigation"
import { cn } from "@/lib/utils"

interface Props {
  children: ReactNode
}

export default function MainShell({ children }: Props) {
  const pathname = usePathname()
  const isHomepage = pathname === "/"

  return (
    <main className={cn(!isHomepage && "pt-[3.5rem] md:pt-[4.75rem]")}>
      {children}
    </main>
  )
}
