"use client"

import { useContext, useEffect, useRef, useState } from "react"
import Image from "next/image"
import bg from "@/public/images/background.png"
import bgHd from "@/public/images/minimal_sky_plane_2k_2560x1440.png"
import nightBg from "@/public/images/night_plane_superres_2k_2560x1440.png"
import { cn } from "@/lib/utils"
import { Link } from "@/app/i18n/navigation"
import { ThemeContext } from "@/app/context/DarkModeContext"

const SCROLL_THRESHOLD = 1200
const LERP = 0.08
const ART_REVEAL_END = 0.62
const FIRST_BUTTON_START = 0.68
const FIRST_BUTTON_END = 0.8
const SECOND_BUTTON_START = 0.8
const SECOND_BUTTON_END = 0.91
const HERO_BOTTOM_OFFSET = 200
const INITIAL_ART_OPACITY = 0.16
const SCROLL_HINT_FADE_END = 0.18

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)
const easeOutQuint = (value: number) => 1 - Math.pow(1 - value, 5)
const progressBetween = (value: number, start: number, end: number) =>
  clamp01((value - start) / (end - start))

export default function IndexPage() {
  const { colorMode } = useContext(ThemeContext) ?? { colorMode: "light" }
  const isDark = colorMode === "dark"

  const [released, setReleased] = useState(false)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [artStartOffset, setArtStartOffset] = useState(0)

  const progressRef = useRef(0)
  const targetRef = useRef(0)
  const rafRef = useRef<number>()
  const startAnimationRef = useRef<() => void>(() => {})
  const heroFrameRef = useRef<HTMLDivElement>(null)
  const artTextRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const syncMotionPreference = () => {
      const shouldReduceMotion = mediaQuery.matches
      setPrefersReducedMotion(shouldReduceMotion)

      if (shouldReduceMotion) {
        progressRef.current = 1
        targetRef.current = 1
        setDisplayProgress(1)
        setReleased(true)
      }
    }

    syncMotionPreference()

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncMotionPreference)
      return () => mediaQuery.removeEventListener("change", syncMotionPreference)
    }

    mediaQuery.addListener(syncMotionPreference)
    return () => mediaQuery.removeListener(syncMotionPreference)
  }, [])

  useEffect(() => {
    const updateMeasurements = () => {
      const heroTop = heroFrameRef.current?.getBoundingClientRect().top ?? 0
      const artHeight = artTextRef.current?.getBoundingClientRect().height ?? 0
      const nextOffset = Math.max(
        window.innerHeight - HERO_BOTTOM_OFFSET - heroTop - artHeight,
        0
      )

      setArtStartOffset(nextOffset)
    }

    updateMeasurements()

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateMeasurements())
        : null

    if (heroFrameRef.current) resizeObserver?.observe(heroFrameRef.current)
    if (artTextRef.current) resizeObserver?.observe(artTextRef.current)

    window.addEventListener("resize", updateMeasurements)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener("resize", updateMeasurements)
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const animate = () => {
      const diff = targetRef.current - progressRef.current
      if (Math.abs(diff) > 0.0001) {
        progressRef.current += diff * LERP
        setDisplayProgress(progressRef.current)
        rafRef.current = requestAnimationFrame(animate)
      } else {
        progressRef.current = targetRef.current
        setDisplayProgress(targetRef.current)
        rafRef.current = undefined
      }
    }

    startAnimationRef.current = () => {
      if (rafRef.current === undefined) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    startAnimationRef.current()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = undefined
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyTouchAction = document.body.style.touchAction

    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    document.body.style.touchAction = prefersReducedMotion ? "" : "none"

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
      document.body.style.touchAction = previousBodyTouchAction
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (released || prefersReducedMotion) return

    let accumulated = 0
    let lastTouchY = 0

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      accumulated += e.deltaY
      const p = Math.min(Math.max(accumulated / SCROLL_THRESHOLD, 0), 1)
      targetRef.current = p
      startAnimationRef.current()
      if (p >= 1) setReleased(true)
    }

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const y = e.touches[0].clientY
      const delta = lastTouchY - y
      lastTouchY = y
      accumulated += delta * 1.3
      const p = Math.min(Math.max(accumulated / SCROLL_THRESHOLD, 0), 1)
      targetRef.current = p
      startAnimationRef.current()
      if (p >= 1) setReleased(true)
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [prefersReducedMotion, released])

  const p = displayProgress
  const artProgress = prefersReducedMotion ? 1 : clamp01(p / ART_REVEAL_END)
  const firstButtonProgress = prefersReducedMotion
    ? 1
    : progressBetween(p, FIRST_BUTTON_START, FIRST_BUTTON_END)
  const secondButtonProgress = prefersReducedMotion
    ? 1
    : progressBetween(p, SECOND_BUTTON_START, SECOND_BUTTON_END)
  const easedFirstButtonProgress = easeOutQuint(firstButtonProgress)
  const easedSecondButtonProgress = easeOutQuint(secondButtonProgress)
  // 艺术字：跟着滚动线性上移并同步淡入，避免前段位移过猛导致"跳出来"
  const artTextY = artStartOffset * (1 - artProgress)
  const artTextOpacity = INITIAL_ART_OPACITY + artProgress * (1 - INITIAL_ART_OPACITY)
  const artTextScale = 0.94 + artProgress * 0.06
  const scrollHintProgress = prefersReducedMotion ? 1 : clamp01(p / SCROLL_HINT_FADE_END)
  const scrollHintOpacity = prefersReducedMotion ? 0 : 0.78 * (1 - scrollHintProgress)
  const scrollHintY = 14 * scrollHintProgress

  // 按钮：在艺术字完成后，按滚动顺序依次出现
  const firstButtonY = 28 * (1 - easedFirstButtonProgress)
  const secondButtonY = 28 * (1 - easedSecondButtonProgress)

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Image
          src={isDark ? nightBg : bg}
          alt="Sky background"
          fill
          priority
          className="object-cover md:hidden"
          sizes="100vw"
        />
        <Image
          src={isDark ? nightBg : bgHd}
          alt="Sky background"
          fill
          priority
          className="hidden object-cover md:block"
          sizes="100vw"
        />
        <div
          className={cn(
            "absolute inset-0",
            isDark
              ? "bg-gradient-to-b from-black/50 via-transparent to-black/60"
              : "bg-gradient-to-b from-black/10 via-transparent to-black/40"
          )}
        />
      </div>

      <div
        ref={heroFrameRef}
        className="fixed inset-x-0 z-10 flex flex-col items-center"
        style={{ top: "calc(var(--app-nav-offset) + 1.5rem)" }}
      >
        <h1
          ref={artTextRef}
          className={cn(
            "flicker text-center text-6xl min-[375px]:text-7xl md:text-8xl lg:text-9xl",
            isDark
              ? "text-white/95 drop-shadow-[0_4px_40px_rgba(255,255,255,0.12)]"
              : "text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
          )}
          style={{
            transform: `translateY(${artTextY}px) scale(${artTextScale})`,
            opacity: artTextOpacity,
            willChange: "transform, opacity",
          }}
        >
          How high does it?
        </h1>

        <div className="flex items-end justify-center gap-4 pt-8 min-[375px]:gap-5 md:gap-8 md:pt-12">
          <div className="flex flex-col items-start gap-3 md:gap-4">
            <Link
              href="/about"
              className={cn(
                "group inline-flex min-w-[9.75rem] items-center justify-between gap-2 border-2 px-4 py-2.5 font-pixel text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-200 hover:text-black focus-visible:outline-none focus-visible:ring-2 min-[375px]:min-w-[10.75rem] min-[375px]:px-5 min-[375px]:text-[11px]",
                isDark
                  ? "border-white/50 bg-black/40 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:border-white/90 hover:bg-white/85 focus-visible:ring-white/60"
                  : "border-white/40 bg-black/20 hover:border-white/80 hover:bg-white/90 focus-visible:ring-white/50"
              )}
              style={{
                transform: `translateY(${firstButtonY}px)`,
                opacity: firstButtonProgress,
                willChange: "transform, opacity",
              }}
            >
              <span>Get to know me</span>
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="/ai"
              className={cn(
                "group inline-flex min-w-[9.75rem] items-center justify-between gap-2 border-2 px-4 py-2.5 font-pixel text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-200 hover:text-black focus-visible:outline-none focus-visible:ring-2 min-[375px]:min-w-[10.75rem] min-[375px]:px-5 min-[375px]:text-[11px]",
                isDark
                  ? "border-white/50 bg-black/40 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:border-white/90 hover:bg-white/85 focus-visible:ring-white/60"
                  : "border-white/40 bg-black/20 hover:border-white/80 hover:bg-white/90 focus-visible:ring-white/50"
              )}
              style={{
                transform: `translateY(${secondButtonY}px)`,
                opacity: secondButtonProgress,
                willChange: "transform, opacity",
              }}
            >
              <span>Get AI solution</span>
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none fixed bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 font-pixel text-[11px] uppercase tracking-[0.26em] md:bottom-12",
          isDark ? "text-white/90" : "text-white/80"
        )}
        style={{
          transform: `translateX(-50%) translateY(${scrollHintY}px)`,
          opacity: scrollHintOpacity,
          willChange: "transform, opacity",
        }}
      >
        <span className="text-base leading-none">↓</span>
        <span>Scroll down</span>
      </div>
    </div>
  )
}
