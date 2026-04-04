"use client"
import React, { useCallback, useEffect, useState } from "react"
import DesktopNav from "./components/navbar/DesktopNav"
import MobileNav from "./components/navbar/MobileNav"
import { useScrollableStore } from "./service/Store"
import { cn } from "@/lib/utils"

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
        "fixed inset-x-0 top-0 z-10 border-b backdrop-blur-md transition-colors",
        isInScrollable
          ? "border-border bg-muted/95"
          : "border-border/60 bg-background/85"
      )}
    >
      {windowWidth > 768 ? <DesktopNav /> : <MobileNav />}
    </nav>
  )
}

export default NavBar
