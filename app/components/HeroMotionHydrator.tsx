"use client"

import { useEffect, useRef } from "react"
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion"
import { useAdaptiveMotion } from "@/app/hooks/useAdaptiveMotion"

const ENTRY_ANIMATIONS = [
  {
    selector: '[data-hero-enter="left"]',
    keyframes: [
      { opacity: 0, x: -18 },
      { opacity: 1, x: 0 },
    ],
    duration: 0.55,
    delay: 0,
  },
  {
    selector: '[data-hero-enter="image"]',
    keyframes: [
      { opacity: 0, y: 20, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1 },
    ],
    duration: 0.65,
    delay: 0.12,
  },
  {
    selector: '[data-hero-enter="code"]',
    keyframes: [
      { opacity: 0, x: 18 },
      { opacity: 1, x: 0 },
    ],
    duration: 0.55,
    delay: 0.18,
  },
]

function clearHeroScrollTransforms(root: HTMLElement | null) {
  const scrollElements = root?.querySelectorAll<HTMLElement>("[data-hero-scroll]")

  scrollElements?.forEach((element) => {
    element.style.transform = ""
    element.style.willChange = ""
  })
}

export default function HeroMotionHydrator() {
  const {
    isMotionReady,
    shouldAnimateSpatialMotion,
    shouldReduceMotion,
    shouldUseLimitedMotion,
  } = useAdaptiveMotion()
  const rootRef = useRef<HTMLElement | null>(null)
  const rawProgress = useMotionValue(0)
  const welcomeLift = useTransform(rawProgress, [0, 1], [0, -120])
  const contentLift = useTransform(rawProgress, [0, 1], [0, -80])
  const smoothWelcomeLift = useSpring(welcomeLift, {
    stiffness: 118,
    damping: 19,
    mass: 1.02,
  })
  const smoothContentLift = useSpring(contentLift, {
    stiffness: 132,
    damping: 22,
    mass: 0.96,
  })

  useEffect(() => {
    rootRef.current = document.querySelector<HTMLElement>("[data-hero-root]")
  }, [])

  useEffect(() => {
    if (!isMotionReady || shouldReduceMotion || !rootRef.current) {
      return
    }

    const animatedElements: HTMLElement[] = []
    const controls = ENTRY_ANIMATIONS.flatMap((config) => {
      const element = rootRef.current?.querySelector<HTMLElement>(
        config.selector,
      )

      if (!element) {
        return []
      }

      animatedElements.push(element)
      const keyframes = shouldUseLimitedMotion
        ? [{ opacity: 0 }, { opacity: 1 }]
        : config.keyframes

      return [
        animate(element, [...keyframes] as any, {
          duration: shouldUseLimitedMotion ? 0.28 : config.duration,
          delay: shouldUseLimitedMotion ? Math.min(config.delay, 0.08) : config.delay,
          ease: [0.22, 1, 0.36, 1],
        }),
      ]
    })

    return () => {
      controls.forEach((control) => control.stop())
      animatedElements.forEach((element) => {
        element.style.opacity = ""
        element.style.transform = ""
      })
    }
  }, [isMotionReady, shouldReduceMotion, shouldUseLimitedMotion])

  useEffect(() => {
    if (!shouldAnimateSpatialMotion || !rootRef.current) {
      rawProgress.set(0)
      clearHeroScrollTransforms(rootRef.current)
      return
    }

    let frameId = 0

    // The hero node is discovered after mount, so compute scroll progress manually
    // instead of relying on a target ref subscription created before it exists.
    const syncScrollProgress = () => {
      frameId = 0

      const root = rootRef.current

      if (!root) {
        rawProgress.set(0)
        return
      }

      const bounds = root.getBoundingClientRect()
      const height = bounds.height || 1
      const nextProgress = Math.min(Math.max(-bounds.top / height, 0), 1)

      rawProgress.set(nextProgress)
    }

    const requestSync = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(syncScrollProgress)
    }

    syncScrollProgress()
    window.addEventListener("scroll", requestSync, { passive: true })
    window.addEventListener("resize", requestSync)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }

      window.removeEventListener("scroll", requestSync)
      window.removeEventListener("resize", requestSync)
      rawProgress.set(0)
      clearHeroScrollTransforms(rootRef.current)
    }
  }, [rawProgress, shouldAnimateSpatialMotion])

  useMotionValueEvent(smoothWelcomeLift, "change", (latest) => {
    if (!shouldAnimateSpatialMotion) {
      return
    }

    const welcome = rootRef.current?.querySelector<HTMLElement>(
      '[data-hero-scroll="welcome"]',
    )

    if (!welcome) {
      return
    }

    welcome.style.transform = `translate3d(0, ${latest}px, 0)`
    welcome.style.willChange =
      latest < -0.1 && latest > -119.9 ? "transform" : ""
  })

  useMotionValueEvent(smoothContentLift, "change", (latest) => {
    if (!shouldAnimateSpatialMotion) {
      return
    }

    const contentBlocks = rootRef.current?.querySelectorAll<HTMLElement>(
      '[data-hero-scroll="content"]',
    )

    contentBlocks?.forEach((element) => {
      element.style.transform = `translate3d(0, ${latest}px, 0)`
      element.style.willChange =
        latest < -0.1 && latest > -79.9 ? "transform" : ""
    })
  })

  return null
}
