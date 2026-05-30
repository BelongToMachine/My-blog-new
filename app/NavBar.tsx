"use client"
import React, { useCallback, useEffect, useRef, useState } from "react"
import DesktopNav from "./components/navbar/DesktopNav"
import MobileNav from "./components/navbar/MobileNav"
import { cn } from "@/lib/utils"
import { isDesktopViewport } from "./lib/responsive"
import { usePathname } from "@/app/i18n/navigation"
import { useTheme } from "@/app/hooks/useTheme"
import { colorMode } from "@/app/context/DarkModeContext"

const NavBar = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  const { setColorMode } = useTheme()
  const prevHomepageRef = useRef(false)
  const savedModeRef = useRef<colorMode | null>(null)

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
    if (isHomepage) {
      if (!prevHomepageRef.current) {
        savedModeRef.current = (window.localStorage.getItem("color-mode") as colorMode) || "dark"
      }
      setColorMode("dark")
    } else if (prevHomepageRef.current && savedModeRef.current) {
      setColorMode(savedModeRef.current)
    }
    prevHomepageRef.current = isHomepage
  }, [isHomepage, setColorMode])

  if (windowWidth === 0) {
    return null
  }

  return (
    <nav
      className={cn(
        "!fixed inset-x-0 top-0 z-[1200] border-b transition-all duration-300",
        "pixel-panel border-border/70 bg-background"
      )}
    >
      {isDesktopViewport(windowWidth) ? (
        <DesktopNav indexMode={isHomepage} />
      ) : (
        <MobileNav indexMode={isHomepage} />
      )}
    </nav>
  )
}

export default NavBar
