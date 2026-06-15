"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const HeroMotionHydrator = dynamic(() => import("./HeroMotionHydrator"), {
  ssr: false,
})

const FONT_READY_EVENT = "deferred-fonts-ready"

export default function HeroDeferredMotion() {
  const [shouldLoadAnimation, setShouldLoadAnimation] = useState(false)

  useEffect(() => {
    let timeoutId = 0
    let idleId = 0
    let cancelled = false

    const scheduleAnimation = () => {
      if (cancelled) {
        return
      }

      const activate = () => {
        if (!cancelled) {
          setShouldLoadAnimation(true)
        }
      }

      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(activate, { timeout: 1500 })
        return
      }

      timeoutId = window.setTimeout(activate, 180)
    }

    if (document.documentElement.dataset.fontStage === "ready") {
      scheduleAnimation()
    } else {
      window.addEventListener(FONT_READY_EVENT, scheduleAnimation, {
        once: true,
      })
    }

    return () => {
      cancelled = true
      window.removeEventListener(FONT_READY_EVENT, scheduleAnimation)
      window.clearTimeout(timeoutId)

      if ("cancelIdleCallback" in window && idleId) {
        window.cancelIdleCallback(idleId)
      }
    }
  }, [])

  return shouldLoadAnimation ? <HeroMotionHydrator /> : null
}
