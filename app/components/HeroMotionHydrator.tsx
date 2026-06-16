"use client"

import { useEffect, useRef, useState } from "react"
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

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
] as const

export default function HeroMotionHydrator() {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLElement | null>(null)
  const [hasResolvedViewport, setHasResolvedViewport] = useState(false)
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

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"],
  })

  useEffect(() => {
    rootRef.current = document.querySelector<HTMLElement>("[data-hero-root]")

    const updateViewportWidth = () => {
      setHasResolvedViewport(true)
    }

    updateViewportWidth()
    window.addEventListener("resize", updateViewportWidth)

    return () => {
      window.removeEventListener("resize", updateViewportWidth)
    }
  }, [])

  useEffect(() => {
    if (reduceMotion || !rootRef.current) {
      return
    }

    const controls = ENTRY_ANIMATIONS.flatMap((config) => {
      const element = rootRef.current?.querySelector<HTMLElement>(
        config.selector,
      )

      if (!element) {
        return []
      }

      return [
        animate(element, config.keyframes, {
          duration: config.duration,
          delay: config.delay,
          ease: [0.22, 1, 0.36, 1],
          fill: "both",
        }),
      ]
    })

    return () => {
      controls.forEach((control) => control.stop())
    }
  }, [reduceMotion])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reduceMotion || !hasResolvedViewport) {
      rawProgress.set(0)
      return
    }

    rawProgress.set(latest)
  })

  useMotionValueEvent(smoothWelcomeLift, "change", (latest) => {
    const welcome = rootRef.current?.querySelector<HTMLElement>(
      '[data-hero-scroll="welcome"]',
    )

    if (!welcome) {
      return
    }

    welcome.style.transform = `translate3d(0, ${latest}px, 0)`
    welcome.style.willChange = "transform"
  })

  useMotionValueEvent(smoothContentLift, "change", (latest) => {
    const contentBlocks = rootRef.current?.querySelectorAll<HTMLElement>(
      '[data-hero-scroll="content"]',
    )

    contentBlocks?.forEach((element) => {
      element.style.transform = `translate3d(0, ${latest}px, 0)`
      element.style.willChange = "transform"
    })
  })

  return null
}
