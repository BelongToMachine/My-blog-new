"use client"
import React, { useCallback, useEffect, useState } from "react"
import DesktopNav from "./components/navbar/DesktopNav"
import MobileNav from "./components/navbar/MobileNav"
import { useScrollableStore } from "./service/Store"
import { cn } from "@/lib/utils"
import { isDesktopViewport } from "./lib/responsive"

const NavBar = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const isInScrollable = useScrollableStore((state) => state.isInScrollable)

  const updateWindowValue = useCallback(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    window.addEventListener("resize", updateWindowValue)

    return () => {
      window.removeEventListener("resize", updateWindowValue)
    }
  }, [updateWindowValue])

  if (windowWidth === 0) {
    return null
  }

  return (
    <nav
      className={cn(
        "!fixed inset-x-0 top-0 z-[70] border-b transition-colors",
        isInScrollable
          ? "pixel-panel border-border bg-card/95"
          : "pixel-panel border-border/70 bg-background/92"
      )}
    >
      {isDesktopViewport(windowWidth) ? <DesktopNav /> : <MobileNav />}
    </nav>
  )
}

export default NavBar
