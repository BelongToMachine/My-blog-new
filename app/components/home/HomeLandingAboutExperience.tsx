"use client"

import { ThemeContext } from "@/app/context/DarkModeContext"
import { Link } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"
import { isDesktopViewport } from "@/app/lib/responsive"
import { useScrollableStore } from "@/app/service/Store"
import { cn } from "@/lib/utils"
import landingStyles from "./HomeLandingAboutExperience.module.css"
import Image from "next/image"
import localFont from "next/font/local"
import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import bg from "@/public/images/background.png"
import bgHd from "@/public/images/minimal_sky_plane_2k_2560x1440.png"
import nightBg from "@/public/images/night_plane_superres_2k_2560x1440.png"

interface Props {
  children: ReactNode
}

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
const DESKTOP_CURVE_FLATTEN_SCROLL_RATIO = 0.92
const DESKTOP_OVERLAY_HIDE_SCROLL_RATIO = 0.995
const DESKTOP_NAV_LANDING_END_SCROLL_RATIO = 0.9
const NON_DESKTOP_OVERLAY_FADE_START_SCROLL_RATIO = 0.7
const NON_DESKTOP_OVERLAY_HIDE_SCROLL_RATIO = 0.84
const DESKTOP_CURVE_SCROLL_SLOWER = 0.35
const CURVE_ENTRANCE_DISTANCE_IN_PX = 180

const bebasNeue = localFont({
  src: "../../../public/fonts/bebas-neue/BebasNeue-Regular.woff2",
  display: "swap",
})

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)
const easeOutQuint = (value: number) => 1 - Math.pow(1 - value, 5)
const progressBetween = (value: number, start: number, end: number) =>
  clamp01((value - start) / (end - start))
const mix = (from: number, to: number, progress: number) =>
  from * (1 - progress) + to * progress

const getInterpolatedValue = (
  curvyValue: number,
  flatValue: number,
  scrollRatio: number
) => curvyValue * (1 - scrollRatio) + flatValue * scrollRatio

const getCurveInstructions = (
  startPoint: number,
  firstControlPoint: number,
  secondControlPoint: number,
  endPoint: number
) =>
  `M 0,${startPoint} C 30,${firstControlPoint} 50,${secondControlPoint} 100,${endPoint} L 100,100 L 0,100 Z`

const getCurveEdgeInstructions = (
  startPoint: number,
  firstControlPoint: number,
  secondControlPoint: number,
  endPoint: number
) => `M 0,${startPoint} C 30,${firstControlPoint} 50,${secondControlPoint} 100,${endPoint}`

const getNavOffsetInPixels = () => {
  const root = document.documentElement
  const rawValue = getComputedStyle(root).getPropertyValue("--app-nav-offset").trim()

  if (rawValue.endsWith("px")) {
    return Number.parseFloat(rawValue)
  }

  if (rawValue.endsWith("rem")) {
    const rootFontSize = Number.parseFloat(getComputedStyle(root).fontSize) || 16
    return Number.parseFloat(rawValue) * rootFontSize
  }

  const parsedValue = Number.parseFloat(rawValue)
  return Number.isFinite(parsedValue) ? parsedValue : 56
}

export default function HomeLandingAboutExperience({ children }: Props) {
  const t = useTranslations("hero")
  const { colorMode } = useContext(ThemeContext) ?? { colorMode: "light" }
  const isDark = colorMode === "dark"
  const setScrollableSource = useScrollableStore((state) => state.setScrollableSource)
  const clearScrollableSource = useScrollableStore((state) => state.clearScrollableSource)

  const [released, setReleased] = useState(false)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [artStartOffset, setArtStartOffset] = useState(0)
  const [curveProgress, setCurveProgress] = useState(0)
  const [pageScrollY, setPageScrollY] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [landingReserveHeight, setLandingReserveHeight] = useState<number | null>(null)

  const progressRef = useRef(0)
  const targetRef = useRef(0)
  const rafRef = useRef<number>()
  const startAnimationRef = useRef<() => void>(() => {})
  const heroFrameRef = useRef<HTMLDivElement>(null)
  const artTextRef = useRef<HTMLHeadingElement>(null)
  const curveTargetScrollRef = useRef<number | null>(null)

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
      setViewportWidth(window.innerWidth)

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
    const shouldLockScroll = !released && !prefersReducedMotion

    document.documentElement.style.overflow = shouldLockScroll ? "hidden" : previousHtmlOverflow
    document.body.style.overflow = shouldLockScroll ? "hidden" : previousBodyOverflow
    document.body.style.touchAction = shouldLockScroll ? "none" : previousBodyTouchAction

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
      document.body.style.touchAction = previousBodyTouchAction
    }
  }, [prefersReducedMotion, released])

  useEffect(() => {
    if (released || prefersReducedMotion) return

    let accumulated = 0
    let lastTouchY = 0

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      accumulated += event.deltaY
      const nextProgress = clamp01(accumulated / SCROLL_THRESHOLD)
      targetRef.current = nextProgress
      startAnimationRef.current()
      if (nextProgress >= 1) setReleased(true)
    }

    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0].clientY
    }

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault()
      const currentY = event.touches[0].clientY
      const delta = lastTouchY - currentY
      lastTouchY = currentY
      accumulated += delta * 1.3
      const nextProgress = clamp01(accumulated / SCROLL_THRESHOLD)
      targetRef.current = nextProgress
      startAnimationRef.current()
      if (nextProgress >= 1) setReleased(true)
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

  useEffect(() => {
    const captureCurveTarget = () => {
      if (isDesktopViewport(window.innerWidth)) {
        setLandingReserveHeight(
          window.innerHeight *
            DESKTOP_CURVE_FLATTEN_SCROLL_RATIO *
            DESKTOP_OVERLAY_HIDE_SCROLL_RATIO
        )
        return
      }

      const heroAnchor =
        document.querySelector<HTMLElement>("[data-home-landing-target-anchor]") ??
        document.querySelector<HTMLElement>("#about-me-section")

      if (heroAnchor) {
        const navOffset = getNavOffsetInPixels()
        const rect = heroAnchor.getBoundingClientRect()
        const anchorTopInDocument = window.scrollY + rect.top
        const nextTargetScroll = Math.max(
          Math.min(anchorTopInDocument - navOffset, window.innerHeight - navOffset),
          1
        )

        curveTargetScrollRef.current = nextTargetScroll
        setLandingReserveHeight(
          nextTargetScroll * NON_DESKTOP_OVERLAY_HIDE_SCROLL_RATIO
        )
        return
      }

      const targetAnchor =
        document.querySelector<HTMLElement>("[data-curve-target-anchor]") ??
        document.querySelector<HTMLElement>("[data-summary-heading-anchor]")

      if (!targetAnchor) {
        const fallbackTargetScroll = Math.max(
          window.innerHeight - getNavOffsetInPixels(),
          1
        )
        curveTargetScrollRef.current = fallbackTargetScroll
        setLandingReserveHeight(
          fallbackTargetScroll * NON_DESKTOP_OVERLAY_HIDE_SCROLL_RATIO
        )
        return
      }

      const rect = targetAnchor.getBoundingClientRect()
      const anchorTopInDocument = window.scrollY + rect.top

      const nextTargetScroll = Math.max(
        anchorTopInDocument - getNavOffsetInPixels(),
        1
      )
      curveTargetScrollRef.current = nextTargetScroll
      setLandingReserveHeight(nextTargetScroll * NON_DESKTOP_OVERLAY_HIDE_SCROLL_RATIO)
    }

    captureCurveTarget()
    window.addEventListener("resize", captureCurveTarget)

    return () => {
      window.removeEventListener("resize", captureCurveTarget)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!released) {
        setCurveProgress(0)
        setPageScrollY(0)
        return
      }

      const pixelsScrolled = Math.abs(window.scrollY)
      const windowHeight = window.innerHeight
      const isDesktop = isDesktopViewport(window.innerWidth)
      setPageScrollY(pixelsScrolled)

      if (!isDesktop) {
        const targetScroll =
          curveTargetScrollRef.current ??
          Math.max(windowHeight - getNavOffsetInPixels(), 1)
        setCurveProgress(clamp01(pixelsScrolled / targetScroll))
        return
      }

      setCurveProgress(
        clamp01(pixelsScrolled / (windowHeight * DESKTOP_CURVE_FLATTEN_SCROLL_RATIO))
      )
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [released])

  useEffect(() => {
    if (!released || !isDesktopViewport(viewportWidth) || curveProgress >= 1) {
      return
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      window.scrollBy({
        top: event.deltaY * DESKTOP_CURVE_SCROLL_SLOWER,
        behavior: "auto",
      })
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [curveProgress, released, viewportWidth])

  const isDesktop = isDesktopViewport(viewportWidth)
  const overlayHideThreshold = isDesktop
    ? DESKTOP_OVERLAY_HIDE_SCROLL_RATIO
    : NON_DESKTOP_OVERLAY_HIDE_SCROLL_RATIO
  const overlayFadeOpacity = isDesktop
    ? 1
    : 1 -
      progressBetween(
        curveProgress,
        NON_DESKTOP_OVERLAY_FADE_START_SCROLL_RATIO,
        NON_DESKTOP_OVERLAY_HIDE_SCROLL_RATIO
      )
  const landingOverlayActive = !released || curveProgress < overlayHideThreshold
  const landingNavMode =
    !released ||
    curveProgress <
      (isDesktop
        ? DESKTOP_NAV_LANDING_END_SCROLL_RATIO
        : NON_DESKTOP_OVERLAY_FADE_START_SCROLL_RATIO)
  const showCurveOverlay =
    released &&
    !prefersReducedMotion &&
    pageScrollY > 0 &&
    curveProgress < overlayHideThreshold

  useEffect(() => {
    setScrollableSource("home-landing", landingNavMode)

    return () => {
      clearScrollableSource("home-landing")
    }
  }, [clearScrollableSource, landingNavMode, setScrollableSource])

  const artProgress = prefersReducedMotion ? 1 : clamp01(displayProgress / ART_REVEAL_END)
  const firstButtonProgress = prefersReducedMotion
    ? 1
    : progressBetween(displayProgress, FIRST_BUTTON_START, FIRST_BUTTON_END)
  const secondButtonProgress = prefersReducedMotion
    ? 1
    : progressBetween(displayProgress, SECOND_BUTTON_START, SECOND_BUTTON_END)
  const easedFirstButtonProgress = easeOutQuint(firstButtonProgress)
  const easedSecondButtonProgress = easeOutQuint(secondButtonProgress)
  const artTextY = artStartOffset * (1 - artProgress)
  const artTextOpacity = INITIAL_ART_OPACITY + artProgress * (1 - INITIAL_ART_OPACITY)
  const artTextScale = 0.94 + artProgress * 0.06
  const scrollHintProgress = prefersReducedMotion
    ? 1
    : clamp01(displayProgress / SCROLL_HINT_FADE_END)
  const scrollHintOpacity = prefersReducedMotion ? 0 : 0.78 * (1 - scrollHintProgress)
  const scrollHintY = 14 * scrollHintProgress
  const introCopyProgress = prefersReducedMotion
    ? 1
    : easeOutQuint(progressBetween(displayProgress, 0.62, 0.76))
  const introCopyY = 80 * (1 - introCopyProgress)
  const firstButtonY = 28 * (1 - easedFirstButtonProgress)
  const secondButtonY = 28 * (1 - easedSecondButtonProgress)
  const curveEntranceProgress = prefersReducedMotion
    ? 1
    : easeOutQuint(clamp01(pageScrollY / CURVE_ENTRANCE_DISTANCE_IN_PX))

  const targetStartPoint = getInterpolatedValue(90, 0, curveProgress)
  const targetFirstControlPoint = getInterpolatedValue(60, 0, curveProgress)
  const targetSecondControlPoint = getInterpolatedValue(100, 0, curveProgress)
  const targetEndPoint = getInterpolatedValue(80, 0, curveProgress)

  const curveInstructions = getCurveInstructions(
    mix(100, targetStartPoint, curveEntranceProgress),
    mix(100, targetFirstControlPoint, curveEntranceProgress),
    mix(100, targetSecondControlPoint, curveEntranceProgress),
    mix(100, targetEndPoint, curveEntranceProgress)
  )
  const curveEdgeInstructions = getCurveEdgeInstructions(
    mix(100, targetStartPoint, curveEntranceProgress),
    mix(100, targetFirstControlPoint, curveEntranceProgress),
    mix(100, targetSecondControlPoint, curveEntranceProgress),
    mix(100, targetEndPoint, curveEntranceProgress)
  )

  const curveOverlayTranslateY = (1 - curveEntranceProgress) * 16
  const curveEdgeColor = "hsl(var(--home-about-bridge))"
  const curveFillColor = "hsl(var(--home-about-bridge))"

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[60] overflow-hidden transition-opacity duration-200 lg:z-10",
          released ? "pointer-events-none" : "pointer-events-auto"
        )}
        style={{
          opacity: landingOverlayActive ? overlayFadeOpacity : 0,
          visibility: landingOverlayActive ? "visible" : "hidden",
        }}
      >
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
                ? landingStyles.skyOverlayDark
                : landingStyles.skyOverlayLight
            )}
          />
        </div>

        <div
          ref={heroFrameRef}
          className="pointer-events-auto fixed inset-x-0 z-10 flex flex-col items-center"
          style={{ top: "calc(var(--app-nav-offset) + 1.5rem)" }}
        >
          <h1
            ref={artTextRef}
            className={cn(
              "text-center text-[2.65rem] font-extrabold leading-[0.88] tracking-[-0.06em] min-[375px]:text-[3.25rem] md:text-[4.4rem] lg:text-[5.6rem]",
              isDark
                ? "text-white/95 drop-shadow-[0_4px_40px_rgba(120,160,255,0.2)]"
                : "text-white drop-shadow-[0_6px_40px_rgba(7,60,120,0.4)]"
            )}
            style={{
              transform: `translateY(${artTextY}px) scale(${artTextScale})`,
              opacity: artTextOpacity,
              willChange: "transform, opacity",
            }}
          >
            <span
              className={cn(
                bebasNeue.className,
                "inline-flex items-baseline justify-center gap-[0.12em] whitespace-nowrap tracking-[0.01em] [font-kerning:normal]",
              )}
            >
              <span className="inline-block">How</span>
              <span className="inline-block">high</span>
              <span className="inline-block">does</span>
              <span className="inline-block">it?</span>
            </span>
          </h1>

          <div
            className="mt-7 flex flex-col items-center md:mt-12"
            style={{
              transform: `translateY(${introCopyY}px)`,
              opacity: introCopyProgress,
              willChange: "transform, opacity",
            }}
          >
            {/* Intro copy right-aligned */}
            <div className="flex flex-col items-end text-right px-6 md:px-16">
              <p className="max-w-[60rem] font-pixel text-base font-medium leading-relaxed text-white [text-shadow:0_8px_28px_rgba(7,60,120,0.35)] min-[375px]:text-lg md:text-[1.35rem] md:leading-9">
                {t("landingTitle1")}
              </p>
              <p className="mt-0 max-w-[58rem] font-pixel text-[12px] leading-6 text-white/75 [text-shadow:0_6px_22px_rgba(7,60,120,0.3)] min-[375px]:text-[13px] md:mt-1 md:text-[14px]">
                {t("landingTitle2")}
              </p>
              <p className="mt-2 max-w-[58rem] font-pixel text-[12px] leading-6 text-white/75 [text-shadow:0_6px_22px_rgba(7,60,120,0.3)] min-[375px]:text-[13px] md:mt-3 md:text-[14px]">
                {t("landingStatus")}
              </p>
            </div>

            {/* Buttons centered below intro */}
            <div className="mt-6 flex flex-col items-center gap-3 md:mt-8 md:gap-4">
              <Link
                href="/about"
                className={cn(
                  "group inline-flex min-w-[9.75rem] items-center justify-between gap-2 border-2 px-4 py-2.5 font-pixel text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-200 hover:text-black focus-visible:outline-none focus-visible:ring-2 min-[375px]:min-w-[10.75rem] min-[375px]:px-5 min-[375px]:text-[11px]",
                  isDark
                    ? "border-slate-300/40 bg-slate-900/50 shadow-[0_0_24px_rgba(148,163,184,0.08)] hover:border-slate-200/80 hover:bg-white/85 focus-visible:ring-white/60"
                    : "border-sky-200/35 bg-sky-950/15 hover:border-sky-100/80 hover:bg-white/85 focus-visible:ring-white/50"
                )}
                style={{
                  transform: `translateY(${firstButtonY}px)`,
                  opacity: firstButtonProgress,
                  willChange: "transform, opacity",
                }}
              >
                <span>{t("ctaAbout")}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <Link
                href="/ai"
                className={cn(
                  "group inline-flex min-w-[9.75rem] items-center justify-between gap-2 border-2 px-4 py-2.5 font-pixel text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-200 hover:text-black focus-visible:outline-none focus-visible:ring-2 min-[375px]:min-w-[10.75rem] min-[375px]:px-5 min-[375px]:text-[11px]",
                  isDark
                    ? "border-slate-300/40 bg-slate-900/50 shadow-[0_0_24px_rgba(148,163,184,0.08)] hover:border-slate-200/80 hover:bg-white/85 focus-visible:ring-white/60"
                    : "border-sky-200/35 bg-sky-950/15 hover:border-sky-100/80 hover:bg-white/85 focus-visible:ring-white/50"
                )}
                style={{
                  transform: `translateY(${secondButtonY}px)`,
                  opacity: secondButtonProgress,
                  willChange: "transform, opacity",
                }}
              >
                <span>{t("ctaAi")}</span>
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
            isDark ? "text-indigo-200/85" : "text-white/85"
          )}
          style={{
            transform: `translateX(-50%) translateY(${scrollHintY}px)`,
            opacity: scrollHintOpacity,
            willChange: "transform, opacity",
          }}
        >
          <span className="text-base leading-none">↓</span>
          <span>{t("scrollDown")}</span>
        </div>
      </div>

      {showCurveOverlay ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 z-[70] lg:z-30"
          style={{
            top: "var(--app-nav-offset)",
            height: "calc(100svh - var(--app-nav-offset))",
            transform: `translateY(${curveOverlayTranslateY}px)`,
            willChange: "transform",
          }}
        >
          <svg
            viewBox="0 0 100 100"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
            }}
            preserveAspectRatio="none"
          >
            <path
              d={curveEdgeInstructions}
              fill="none"
              stroke={curveEdgeColor}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={curveInstructions}
              fill={curveFillColor}
              stroke="hsl(var(--border))"
              strokeWidth={0}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      ) : null}

      <div
        aria-hidden
        style={{
          height:
            landingReserveHeight !== null
              ? `${landingReserveHeight}px`
              : "100svh",
        }}
      />
      <div className="relative z-40">{children}</div>
    </>
  )
}
