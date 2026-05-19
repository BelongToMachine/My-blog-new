"use client"
import React, { useCallback, useEffect, useState } from "react"
import DesktopNav from "./components/navbar/DesktopNav"
import MobileNav from "./components/navbar/MobileNav"
import { useScrollableStore } from "./service/Store"
import { cn } from "@/lib/utils"
import { isDesktopViewport } from "./lib/responsive"
import { usePathname } from "@/app/i18n/navigation"

const NavBar = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const [scrolled, setScrolled] = useState(false)
  const isInScrollable = useScrollableStore((state) => state.isInScrollable)
  const scrollableSources = useScrollableStore((state) => state.scrollableSources)
  const pathname = usePathname()
  const isIndexPage = pathname === "/"
  const isIndexMode = isIndexPage && Boolean(scrollableSources["home-landing"])
  const isIndexContentMode = isIndexPage && !isIndexMode

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

  useEffect(() => {
    if (!isIndexMode) {
      setScrolled(false)
      return
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isIndexMode])

  if (windowWidth === 0) {
    return null
  }

  return (
    <nav
      data-index-nav={isIndexMode || undefined}
      data-scrolled={scrolled || undefined}
      className={cn(
        "!fixed inset-x-0 top-0 z-[1200] border-b transition-all duration-300",
        isIndexMode
          ? scrolled
            ? "border-sky-100/25 bg-sky-900/78 backdrop-blur-xl shadow-none"
            : "border-transparent bg-transparent shadow-none"
          : isIndexContentMode
            ? "pixel-panel border-border/70 bg-background"
          : isInScrollable
            ? "pixel-panel border-border bg-card"
            : "pixel-panel border-border/70 bg-background"
      )}
    >
      {isDesktopViewport(windowWidth) ? (
        <DesktopNav indexMode={isIndexMode} />
      ) : (
        <MobileNav indexMode={isIndexMode} />
      )}
    </nav>
  )
}

export default NavBar
