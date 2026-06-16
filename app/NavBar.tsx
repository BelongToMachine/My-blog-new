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
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const [shouldScrollAwayWithHero, setShouldScrollAwayWithHero] =
    useState(false)
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  const { setColorMode } = useTheme()
  const prevHomepageRef = useRef(false)
  const savedModeRef = useRef<colorMode | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const previousHeroScrollStateRef = useRef(false)
  const reentryAnimationRef = useRef<Animation | null>(null)

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
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updateReducedMotion = () => {
      setShouldReduceMotion(mediaQuery.matches)
    }

    updateReducedMotion()
    mediaQuery.addEventListener("change", updateReducedMotion)

    return () => {
      mediaQuery.removeEventListener("change", updateReducedMotion)
    }
  }, [])

  useEffect(() => {
    if (isHomepage) {
      if (!prevHomepageRef.current) {
        savedModeRef.current =
          (window.localStorage.getItem("color-mode") as colorMode) || "dark"
      }
      setColorMode("dark")
    } else if (prevHomepageRef.current && savedModeRef.current) {
      setColorMode(savedModeRef.current)
    }
    prevHomepageRef.current = isHomepage
  }, [isHomepage, setColorMode])

  useEffect(() => {
    if (!isHomepage) {
      setShouldScrollAwayWithHero(false)
      return
    }

    let frameId = 0

    const syncNavbarVisibility = () => {
      frameId = 0

      const heroSection = document.getElementById("about-me-section")

      if (!heroSection) {
        setShouldScrollAwayWithHero(false)
        return
      }

      const heroBounds = heroSection.getBoundingClientRect()
      const hasStartedScrolling = window.scrollY > 0
      const isStillInsideHero = heroBounds.bottom > 0

      setShouldScrollAwayWithHero(hasStartedScrolling && isStillInsideHero)
    }

    const requestVisibilitySync = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(syncNavbarVisibility)
    }

    syncNavbarVisibility()
    window.addEventListener("scroll", requestVisibilitySync, { passive: true })
    window.addEventListener("resize", requestVisibilitySync)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener("scroll", requestVisibilitySync)
      window.removeEventListener("resize", requestVisibilitySync)
    }
  }, [isHomepage])

  useEffect(() => {
    const wasScrollingAwayWithHero = previousHeroScrollStateRef.current
    previousHeroScrollStateRef.current = shouldScrollAwayWithHero

    if (
      !isHomepage ||
      shouldReduceMotion ||
      shouldScrollAwayWithHero ||
      !wasScrollingAwayWithHero ||
      window.scrollY <= 0
    ) {
      return
    }

    reentryAnimationRef.current?.cancel()

    const navElement = navRef.current

    if (!navElement) {
      return
    }

    const animation = navElement.animate(
      [
        { opacity: 0, transform: "translateY(-10px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 260,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both",
      },
    )

    reentryAnimationRef.current = animation

    return () => {
      animation.cancel()
    }
  }, [isHomepage, shouldReduceMotion, shouldScrollAwayWithHero])

  if (windowWidth === 0) {
    return null
  }

  return (
    <nav
      ref={navRef}
      data-homepage={isHomepage || undefined}
      className={cn(
        "inset-x-0 top-0 z-[1200] bg-[hsl(var(--home-about-bridge))] shadow-[var(--shadow-elevated)]",
        shouldScrollAwayWithHero ? "!absolute" : "!fixed",
      )}
    >
      {isDesktopViewport(windowWidth) ? (
        <DesktopNav />
      ) : (
        <MobileNav />
      )}
    </nav>
  )
}

export default NavBar
