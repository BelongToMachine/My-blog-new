"use client"
import React, { useEffect, useRef, useState } from "react"
import DesktopNav from "./components/navbar/DesktopNav"
import MobileNav from "./components/navbar/MobileNav"
import { cn } from "@/lib/utils"
import { usePathname } from "@/app/i18n/navigation"
import { useTheme } from "@/app/hooks/useTheme"
import { useAdaptiveMotion } from "@/app/hooks/useAdaptiveMotion"
import { colorMode } from "@/app/context/DarkModeContext"

const NavBar = () => {
  const [isDesktopViewport, setIsDesktopViewport] = useState<boolean | null>(
    null,
  )
  const [shouldScrollAwayWithHero, setShouldScrollAwayWithHero] =
    useState(false)
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  const { setColorMode } = useTheme()
  const { shouldAnimateSpatialMotion } = useAdaptiveMotion()
  const prevHomepageRef = useRef(false)
  const savedModeRef = useRef<colorMode | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const previousHeroScrollStateRef = useRef(false)
  const heroScrollStateRef = useRef(false)
  const reentryAnimationRef = useRef<Animation | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const updateViewport = () => setIsDesktopViewport(mediaQuery.matches)

    updateViewport()
    mediaQuery.addEventListener("change", updateViewport)

    return () => {
      mediaQuery.removeEventListener("change", updateViewport)
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
      heroScrollStateRef.current = false
      setShouldScrollAwayWithHero(false)
      return
    }

    let frameId = 0

    const syncNavbarVisibility = () => {
      frameId = 0

      const heroSection = document.getElementById("about-me-section")

      if (!heroSection) {
        heroScrollStateRef.current = false
        setShouldScrollAwayWithHero(false)
        return
      }

      const heroBounds = heroSection.getBoundingClientRect()
      const hasStartedScrolling = window.scrollY > 0
      const isStillInsideHero = heroBounds.bottom > 0
      const nextShouldScrollAway = hasStartedScrolling && isStillInsideHero

      if (heroScrollStateRef.current !== nextShouldScrollAway) {
        heroScrollStateRef.current = nextShouldScrollAway
        setShouldScrollAwayWithHero(nextShouldScrollAway)
      }
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
      !shouldAnimateSpatialMotion ||
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
  }, [
    isHomepage,
    shouldAnimateSpatialMotion,
    shouldScrollAwayWithHero,
  ])

  if (isDesktopViewport === null) {
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
      {isDesktopViewport ? (
        <DesktopNav />
      ) : (
        <MobileNav />
      )}
    </nav>
  )
}

export default NavBar
