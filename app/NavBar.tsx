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
  const pathname = usePathname()
  const isIndexPage = pathname === "/"

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
    if (!isIndexPage) {
      setScrolled(false)
      return
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isIndexPage])

  if (windowWidth === 0) {
    return null
  }

  return (
    <nav
      data-index-nav={isIndexPage || undefined}
      data-scrolled={scrolled || undefined}
      className={cn(
        "!fixed inset-x-0 top-0 z-[1200] border-b transition-all duration-300",
        isIndexPage
          ? scrolled
            ? "border-white/10 bg-white/10 backdrop-blur-md shadow-none"
            : "border-transparent bg-transparent shadow-none"
          : isInScrollable
            ? "pixel-panel border-border bg-card"
            : "pixel-panel border-border/70 bg-background"
      )}
    >
      {isDesktopViewport(windowWidth) ? (
        <DesktopNav indexMode={isIndexPage} />
      ) : (
        <MobileNav indexMode={isIndexPage} />
      )}
    </nav>
  )
}

export default NavBar
