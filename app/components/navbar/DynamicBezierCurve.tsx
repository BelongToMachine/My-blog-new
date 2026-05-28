"use client"
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react"
import { Container } from "@radix-ui/themes"
import style from "@/app/service/ThemeService"
import useIsInScrollable from "@/app/hooks/useIsInScrollable"
import { BREAKPOINTS, isDesktopViewport } from "@/app/lib/responsive"
import { useScrollableStore } from "@/app/service/Store"

interface Props {
  children: ReactNode
  mirrorCurve?: boolean
}

// Utility function that clamps a given value to a
// specific range (inclusive, between min and max).
const clamp = (val: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, val))
const easeOutQuint = (value: number) => 1 - Math.pow(1 - value, 5)
const easeInOutQuint = (value: number) =>
  value < 0.5
    ? 16 * value ** 5
    : 1 - Math.pow(-2 * value + 2, 5) / 2
const mix = (from: number, to: number, progress: number) =>
  from * (1 - progress) + to * progress
const isMobileCurveViewport = (width: number) => width < BREAKPOINTS.tablet
const HOME_LANDING_FINAL_ANCHOR_SELECTOR =
  "[data-home-landing-final-anchor]"

const getProgressBetween = (value: number, start: number, end: number) => {
  if (end <= start) return value >= end ? 1 : 0

  return clamp((value - start) / (end - start))
}

// Helper function for interpolation (assuming it was defined elsewhere in the original code)
const getInterpolatedValue = (
  curvyValue: number,
  flatValue: number,
  scrollRatio: number
) => {
  return curvyValue * (1 - scrollRatio) + flatValue * scrollRatio
}

const cubicPoint = (t: number, p0: number, p1: number, p2: number, p3: number) => {
  const oneMinusT = 1 - t

  return (
    oneMinusT ** 3 * p0 +
    3 * oneMinusT ** 2 * t * p1 +
    3 * oneMinusT * t ** 2 * p2 +
    t ** 3 * p3
  )
}

const quantize = (value: number, grain: number) =>
  Math.round(value / grain) * grain

const getPixelCurveInstructions = (
  startPoint: number,
  firstControlPoint: number,
  secondControlPoint: number,
  endPoint: number,
  stepCount = 120
) => {
  const xGrain = 1.6
  const yGrain = 1.8
  const points = Array.from({ length: stepCount + 1 }, (_, index) => {
    const t = index / stepCount

    return {
      x: quantize(cubicPoint(t, 0, 30, 50, 100), xGrain),
      y: quantize(
        cubicPoint(t, startPoint, firstControlPoint, secondControlPoint, endPoint),
        yGrain
      ),
    }
  }).reduce<Array<{ x: number; y: number }>>((accumulator, point) => {
    const previousPoint = accumulator[accumulator.length - 1]

    if (!previousPoint) {
      accumulator.push(point)
      return accumulator
    }

    const normalizedPoint = {
      x: Math.max(point.x, previousPoint.x),
      y: point.y,
    }

    if (
      normalizedPoint.x !== previousPoint.x ||
      normalizedPoint.y !== previousPoint.y
    ) {
      accumulator.push(normalizedPoint)
    }

    return accumulator
  }, [])

  let path = `M 0,${points[0].y}`
  let currentX = 0
  let currentY = points[0].y

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index]

    if (point.x !== currentX) {
      path += ` H ${point.x}`
      currentX = point.x
    }

    if (point.y !== currentY) {
      path += ` V ${point.y}`
      currentY = point.y
    }
  }

  path += " L 100,100 L 0,100 Z"

  return path
}

const DynamicBezierCurve = ({ children, mirrorCurve = false }: Props) => {
  const [scrollRatio, setScrollRatio] = useState(0)
  const [scrolledInVH, setScrolledInVh] = useState(0)
  const [hasReachedCurveStart, setHasReachedCurveStart] = useState(false)
  const [curveRevealProgress, setCurveRevealProgress] = useState(0)
  const [curveRevealTravel, setCurveRevealTravel] = useState(0)
  const isHomeLandingHandoffActive = useScrollableStore((state) =>
    Boolean(state.scrollableSources["home-landing-handoff"])
  )
  const nodeRef = useRef(null)
  const rootAnchorRef = useRef<HTMLDivElement>(null)
  const nonDesktopCurveTargetScrollRef = useRef<number | null>(null)
  const nonDesktopHeroFinalAnchorOffsetRef = useRef<number | null>(null)
  const mobileAutoFrameRef = useRef<number>()
  const mobileAutoSettleFrameRef = useRef<number>()
  const mobileAutoDirectionRef = useRef<"forward" | "reverse" | null>(null)
  const mobileAutoSettleRef = useRef<{
    direction: "forward" | "reverse"
    targetScrollY: number
    until: number
  } | null>(null)
  const mobileCurvePhaseRef = useRef<"before" | "after">("before")
  const mobileLastScrollYRef = useRef(0)
  const mobileScrollIntentRef = useRef<"down" | "up" | null>(null)
  const mobileTouchYRef = useRef<number | null>(null)
  const BACKGROUND_COLOR = style.background
  const HERO_SURFACE_COLOR = "hsl(var(--home-about-bridge))"

  const SCROLLABLE_HEIGHT_IN_VH = 100
  const NON_DESKTOP_STICKY_TOP_IN_PX = 56
  const NON_DESKTOP_HERO_FINAL_GAP_IN_PX = 18
  const DESKTOP_CURVE_FLATTEN_SCROLL_RATIO = 0.92
  const DESKTOP_HERO_LAYER_HIDE_SCROLL_RATIO = 0.995
  const NON_DESKTOP_HERO_LAYER_FADE_START_SCROLL_RATIO = 0.7
  const NON_DESKTOP_HERO_LAYER_HIDE_SCROLL_RATIO = 0.84
  const CURVE_ENTRANCE_DISTANCE_IN_PX = 180
  const CURVE_ENTRANCE_TRANSLATE_Y_IN_PX = 16
  const MOBILE_AUTO_TRIGGER_DISTANCE_IN_PX = 28
  const MOBILE_AUTO_DURATION_IN_MS = 1450
  {
    /* 
  ADJUSTED_SCROLL_COEFFICIENT: assoicate with the curve flaten speed, affect this by
  affect the state "scrollRatio"
  */
  }
  const ADJUSTED_SCROLL_COEFFICIENT = 1
  {
    /* 
    SLOWER: affect user scroll speed  
  */
  }
  const SLOWER = 0.35

  useIsInScrollable(
    hasReachedCurveStart ? scrolledInVH : SCROLLABLE_HEIGHT_IN_VH,
    SCROLLABLE_HEIGHT_IN_VH,
    "dynamic-bezier"
  )
  const isCurveScrollable =
    hasReachedCurveStart && scrolledInVH < SCROLLABLE_HEIGHT_IN_VH

  const getComponentTopInDocument = useCallback(() => {
    const anchorRect = rootAnchorRef.current?.getBoundingClientRect()

    if (!anchorRect) return 0

    return window.scrollY + anchorRect.top
  }, [])

  const captureNonDesktopHeroFinalAnchorOffset = useCallback(
    (componentTopInDocument: number) => {
      const fallbackEntranceScroll =
        componentTopInDocument - NON_DESKTOP_STICKY_TOP_IN_PX

      if (
        nonDesktopHeroFinalAnchorOffsetRef.current !== null &&
        window.scrollY >= fallbackEntranceScroll
      ) {
        return nonDesktopHeroFinalAnchorOffsetRef.current
      }

      const finalAnchors = Array.from(
        document.querySelectorAll<HTMLElement>(
          HOME_LANDING_FINAL_ANCHOR_SELECTOR
        )
      )
      const finalAnchor = finalAnchors.find((anchor) => {
        const rect = anchor.getBoundingClientRect()

        return rect.width > 0 || rect.height > 0
      })

      if (!finalAnchor) return nonDesktopHeroFinalAnchorOffsetRef.current

      const rect = finalAnchor.getBoundingClientRect()
      const nextOffset = window.scrollY + rect.top - componentTopInDocument

      if (Number.isFinite(nextOffset) && nextOffset > 0) {
        nonDesktopHeroFinalAnchorOffsetRef.current = nextOffset
      }

      return nonDesktopHeroFinalAnchorOffsetRef.current
    },
    [NON_DESKTOP_STICKY_TOP_IN_PX]
  )

  const getNonDesktopHeroEntranceScroll = useCallback(
    (componentTopInDocument: number) => {
      const fallbackEntranceScroll =
        componentTopInDocument - NON_DESKTOP_STICKY_TOP_IN_PX
      const finalAnchorOffset = captureNonDesktopHeroFinalAnchorOffset(
        componentTopInDocument
      )

      if (finalAnchorOffset === null) return fallbackEntranceScroll

      return Math.max(
        componentTopInDocument +
          finalAnchorOffset -
          NON_DESKTOP_STICKY_TOP_IN_PX -
          NON_DESKTOP_HERO_FINAL_GAP_IN_PX,
        fallbackEntranceScroll
      )
    },
    [
      NON_DESKTOP_HERO_FINAL_GAP_IN_PX,
      NON_DESKTOP_STICKY_TOP_IN_PX,
      captureNonDesktopHeroFinalAnchorOffset,
    ]
  )

  const cancelMobileAutoScroll = useCallback(() => {
    if (mobileAutoFrameRef.current !== undefined) {
      cancelAnimationFrame(mobileAutoFrameRef.current)
      mobileAutoFrameRef.current = undefined
    }

    if (mobileAutoSettleFrameRef.current !== undefined) {
      cancelAnimationFrame(mobileAutoSettleFrameRef.current)
      mobileAutoSettleFrameRef.current = undefined
    }

    mobileAutoDirectionRef.current = null
    mobileAutoSettleRef.current = null
  }, [])

  const settleMobileAutoScroll = useCallback(
    (direction: "forward" | "reverse", targetScrollY: number) => {
      if (mobileAutoSettleFrameRef.current !== undefined) {
        cancelAnimationFrame(mobileAutoSettleFrameRef.current)
      }

      mobileAutoSettleRef.current = {
        direction,
        targetScrollY,
        until: performance.now() + 1000,
      }

      const step = () => {
        const settle = mobileAutoSettleRef.current

        if (!settle || !isMobileCurveViewport(window.innerWidth)) {
          mobileAutoSettleFrameRef.current = undefined
          mobileAutoSettleRef.current = null
          return
        }

        const shouldClampForward =
          settle.direction === "forward" &&
          window.scrollY > settle.targetScrollY
        const shouldClampReverse =
          settle.direction === "reverse" &&
          window.scrollY < settle.targetScrollY

        if (shouldClampForward || shouldClampReverse) {
          window.scrollTo(0, settle.targetScrollY)
          mobileLastScrollYRef.current = settle.targetScrollY
        }

        if (performance.now() < settle.until) {
          mobileAutoSettleFrameRef.current = requestAnimationFrame(step)
          return
        }

        mobileAutoSettleFrameRef.current = undefined
        mobileAutoSettleRef.current = null
      }

      mobileAutoSettleFrameRef.current = requestAnimationFrame(step)
    },
    []
  )

  const animateMobileCurveScroll = useCallback(
    (direction: "forward" | "reverse", targetScrollY: number) => {
      if (!isMobileCurveViewport(window.innerWidth)) return

      cancelMobileAutoScroll()

      const startScrollY = window.scrollY
      const distance = targetScrollY - startScrollY

      if (Math.abs(distance) < 1) {
        mobileCurvePhaseRef.current =
          direction === "forward" ? "after" : "before"
        mobileLastScrollYRef.current = targetScrollY
        window.scrollTo(0, targetScrollY)
        settleMobileAutoScroll(direction, targetScrollY)
        return
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        mobileCurvePhaseRef.current =
          direction === "forward" ? "after" : "before"
        mobileLastScrollYRef.current = targetScrollY
        window.scrollTo(0, targetScrollY)
        settleMobileAutoScroll(direction, targetScrollY)
        return
      }

      const startedAt = performance.now()
      mobileAutoDirectionRef.current = direction

      const step = (timestamp: number) => {
        if (!isMobileCurveViewport(window.innerWidth)) {
          cancelMobileAutoScroll()
          return
        }

        const progress = clamp(
          (timestamp - startedAt) / MOBILE_AUTO_DURATION_IN_MS
        )
        const easedProgress = easeInOutQuint(progress)
        const nextScrollY = startScrollY + distance * easedProgress

        window.scrollTo(0, nextScrollY)

        if (progress < 1) {
          mobileAutoFrameRef.current = requestAnimationFrame(step)
          return
        }

        window.scrollTo(0, targetScrollY)
        mobileCurvePhaseRef.current =
          direction === "forward" ? "after" : "before"
        mobileLastScrollYRef.current = targetScrollY
        mobileAutoFrameRef.current = undefined
        mobileAutoDirectionRef.current = null
        settleMobileAutoScroll(direction, targetScrollY)
      }

      mobileAutoFrameRef.current = requestAnimationFrame(step)
    },
    [MOBILE_AUTO_DURATION_IN_MS, cancelMobileAutoScroll, settleMobileAutoScroll]
  )

  const getMobileCurveBounds = useCallback(() => {
    if (!isMobileCurveViewport(window.innerWidth)) return null

    const componentTopInDocument = getComponentTopInDocument()
    const liveCurveTargetAnchor =
      document.querySelector<HTMLElement>("[data-curve-target-anchor]") ??
      document.querySelector<HTMLElement>("[data-summary-heading-anchor]")
    const liveEndScroll = liveCurveTargetAnchor
      ? Math.max(
          window.scrollY +
            liveCurveTargetAnchor.getBoundingClientRect().top -
            NON_DESKTOP_STICKY_TOP_IN_PX,
          1
        )
      : null
    const liveTargetScroll =
      liveEndScroll !== null
        ? Math.max(liveEndScroll - componentTopInDocument, 1)
        : null
    const targetScroll =
      liveTargetScroll ??
      nonDesktopCurveTargetScrollRef.current ??
      Math.max(window.innerHeight - NON_DESKTOP_STICKY_TOP_IN_PX, 1)

    nonDesktopCurveTargetScrollRef.current = targetScroll

    return {
      endScroll: liveEndScroll ?? componentTopInDocument + targetScroll,
      startScroll: getNonDesktopHeroEntranceScroll(componentTopInDocument),
    }
  }, [getComponentTopInDocument, getNonDesktopHeroEntranceScroll])

  const maybeStartMobileAutoCurve = useCallback(
    (
      direction: "down" | "up" | null,
      activationScrollY = window.scrollY,
      beforeStart?: () => void
    ) => {
      if (!direction || mobileAutoDirectionRef.current) return false

      const bounds = getMobileCurveBounds()
      if (!bounds) return false

      const currentScrollY = window.scrollY

      if (currentScrollY <= bounds.startScroll) {
        mobileCurvePhaseRef.current = "before"
      } else if (currentScrollY >= bounds.endScroll - 1) {
        mobileCurvePhaseRef.current = "after"
      }

      if (
        direction === "down" &&
        mobileCurvePhaseRef.current === "before" &&
        activationScrollY >=
          bounds.startScroll + MOBILE_AUTO_TRIGGER_DISTANCE_IN_PX &&
        currentScrollY < bounds.endScroll - 1
      ) {
        beforeStart?.()
        animateMobileCurveScroll("forward", bounds.endScroll)
        return true
      }

      if (
        direction === "up" &&
        mobileCurvePhaseRef.current === "after" &&
        activationScrollY <=
          bounds.endScroll - MOBILE_AUTO_TRIGGER_DISTANCE_IN_PX &&
        currentScrollY > bounds.startScroll
      ) {
        beforeStart?.()
        animateMobileCurveScroll("reverse", bounds.startScroll - 1)
        return true
      }

      return false
    },
    [
      MOBILE_AUTO_TRIGGER_DISTANCE_IN_PX,
      animateMobileCurveScroll,
      getMobileCurveBounds,
    ]
  )

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (
        mobileAutoDirectionRef.current &&
        isMobileCurveViewport(window.innerWidth)
      ) {
        event.preventDefault()
        return
      }

      if (isMobileCurveViewport(window.innerWidth) && event.deltaY !== 0) {
        const direction = event.deltaY > 0 ? "down" : "up"
        mobileScrollIntentRef.current = direction
        const projectedScrollY = window.scrollY + event.deltaY

        maybeStartMobileAutoCurve(direction, projectedScrollY, () =>
          event.preventDefault()
        )
      }
    }

    const handleTouchStart = (event: TouchEvent) => {
      mobileTouchYRef.current = event.touches[0]?.clientY ?? null
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (
        mobileAutoDirectionRef.current &&
        isMobileCurveViewport(window.innerWidth)
      ) {
        event.preventDefault()
        return
      }

      if (!isMobileCurveViewport(window.innerWidth)) return

      const currentTouchY = event.touches[0]?.clientY
      const previousTouchY = mobileTouchYRef.current

      if (currentTouchY === undefined || previousTouchY === null) return

      const touchDelta = previousTouchY - currentTouchY

      if (touchDelta !== 0) {
        const direction = touchDelta > 0 ? "down" : "up"
        mobileScrollIntentRef.current = direction
        const projectedScrollY = window.scrollY + touchDelta

        maybeStartMobileAutoCurve(direction, projectedScrollY, () =>
          event.preventDefault()
        )
      }

      mobileTouchYRef.current = currentTouchY
    }

    window.addEventListener("wheel", handleWheel, {
      capture: true,
      passive: false,
    })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, {
      capture: true,
      passive: false,
    })

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true })
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove, {
        capture: true,
      })
      cancelMobileAutoScroll()
    }
  }, [cancelMobileAutoScroll, maybeStartMobileAutoCurve])

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (!isDesktopViewport(window.innerWidth)) return
      // Only slow down scrolling in specific conditions
      event.preventDefault()
      window.scrollBy({
        top: event.deltaY * SLOWER,
        behavior: "auto", // Avoid smooth scrolling on every event
      })
    }

    if (isCurveScrollable) {
      window.addEventListener("wheel", handleScroll, { passive: false })
      return () => window.removeEventListener("wheel", handleScroll)
    }
  }, [isCurveScrollable])

  useEffect(() => {
    const captureNonDesktopCurveTarget = () => {
      if (isDesktopViewport(window.innerWidth)) {
        nonDesktopCurveTargetScrollRef.current = null
        return
      }

      const componentTopInDocument = getComponentTopInDocument()
      captureNonDesktopHeroFinalAnchorOffset(componentTopInDocument)

      // Follow the first section after the hero so adding new blocks above the
      // summary doesn't delay the curve handoff on tablet/mobile.
      const curveTargetAnchor =
        document.querySelector<HTMLElement>("[data-curve-target-anchor]") ??
        document.querySelector<HTMLElement>("[data-summary-heading-anchor]")

      if (curveTargetAnchor) {
        const rect = curveTargetAnchor.getBoundingClientRect()
        const curveTargetTopInDocument = window.scrollY + rect.top

        nonDesktopCurveTargetScrollRef.current = Math.max(
          curveTargetTopInDocument - componentTopInDocument - NON_DESKTOP_STICKY_TOP_IN_PX,
          1
        )
        return
      }

      const mobileAvatar = document.querySelector<HTMLElement>(
        "[data-mobile-hero-avatar]"
      )

      if (mobileAvatar) {
        const rect = mobileAvatar.getBoundingClientRect()
        const avatarBottomInDocument = window.scrollY + rect.bottom

        nonDesktopCurveTargetScrollRef.current = Math.max(
          avatarBottomInDocument - componentTopInDocument - NON_DESKTOP_STICKY_TOP_IN_PX,
          1
        )
        return
      }

      nonDesktopCurveTargetScrollRef.current = Math.max(
        window.innerHeight - NON_DESKTOP_STICKY_TOP_IN_PX,
        1
      )
    }

    captureNonDesktopCurveTarget()
    window.addEventListener("resize", captureNonDesktopCurveTarget)

    return () => {
      window.removeEventListener("resize", captureNonDesktopCurveTarget)
    }
  }, [captureNonDesktopHeroFinalAnchorOffset, getComponentTopInDocument])

  useEffect(() => {
    const handleScroll = () => {
      if (!nodeRef.current) return

      const windowHeight = window.innerHeight
      const componentTopInDocument = getComponentTopInDocument()
      const viewportWidth = window.innerWidth
      const isDesktop = isDesktopViewport(viewportWidth)
      const isMobileCurve = isMobileCurveViewport(viewportWidth)
      const heroEntranceScroll = isDesktop
        ? componentTopInDocument
        : getNonDesktopHeroEntranceScroll(componentTopInDocument)
      const curveRevealStartScroll = heroEntranceScroll
      const hasEnteredCurve = window.scrollY >= heroEntranceScroll
      const curveEnteredPixels = Math.max(
        window.scrollY - curveRevealStartScroll,
        0
      )
      const pixelsScrolled = hasEnteredCurve
        ? Math.max(window.scrollY - heroEntranceScroll, 0)
        : 0
      const revealViewportSpan = isDesktop
        ? windowHeight
        : Math.max(windowHeight - NON_DESKTOP_STICKY_TOP_IN_PX, 1)
      const revealDistance = isDesktop
        ? CURVE_ENTRANCE_DISTANCE_IN_PX
        : CURVE_ENTRANCE_DISTANCE_IN_PX * 0.78
      const revealTravel = isDesktop
        ? CURVE_ENTRANCE_TRANSLATE_Y_IN_PX
        : CURVE_ENTRANCE_TRANSLATE_Y_IN_PX * 0.75
      const nextCurveRevealProgress = easeOutQuint(
        clamp(curveEnteredPixels / revealDistance)
      )
      let ratio = 0

      setHasReachedCurveStart((previousValue) =>
        previousValue !== hasEnteredCurve ? hasEnteredCurve : previousValue
      )
      setCurveRevealTravel((previousValue) =>
        previousValue !== revealTravel ? revealTravel : previousValue
      )
      setCurveRevealProgress((previousValue) =>
        previousValue !== nextCurveRevealProgress
          ? nextCurveRevealProgress
          : previousValue
      )

      if (!isDesktop) {
        const mobileCurveBounds = isMobileCurve ? getMobileCurveBounds() : null
        const nonDesktopEndScroll =
          mobileCurveBounds !== null
            ? mobileCurveBounds.endScroll
            : componentTopInDocument +
              (nonDesktopCurveTargetScrollRef.current ??
                Math.max(windowHeight - NON_DESKTOP_STICKY_TOP_IN_PX, 1))
        const nonDesktopTargetScroll = Math.max(
          nonDesktopEndScroll - heroEntranceScroll,
          1
        )
        const nonDesktopProgress = pixelsScrolled / nonDesktopTargetScroll
        setScrolledInVh(clamp(nonDesktopProgress) * 100)
        ratio = clamp(ADJUSTED_SCROLL_COEFFICIENT * nonDesktopProgress)

        if (isMobileCurve) {
          const currentScrollY = window.scrollY
          const previousScrollY = mobileLastScrollYRef.current
          const scrollDelta = currentScrollY - previousScrollY
          const scrollDirection =
            mobileScrollIntentRef.current ??
            (scrollDelta > 0 ? "down" : scrollDelta < 0 ? "up" : null)
          maybeStartMobileAutoCurve(scrollDirection)

          mobileLastScrollYRef.current = currentScrollY
          mobileScrollIntentRef.current = null
        }
      } else {
        const baseRatio =
          pixelsScrolled / (windowHeight * DESKTOP_CURVE_FLATTEN_SCROLL_RATIO)
        setScrolledInVh(baseRatio * 100)
        ratio = ADJUSTED_SCROLL_COEFFICIENT * baseRatio
      }

      // We don't care about the negative values when it's
      // below the viewport, or the greater-than-1 values when
      // it's above the viewport.
      ratio = clamp(ratio)

      // Small optimization, avoid re-rendering when the
      // SVG isn't in the viewport.
      setScrollRatio((prevRatio) => (prevRatio !== ratio ? ratio : prevRatio))
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [
    getComponentTopInDocument,
    getMobileCurveBounds,
    getNonDesktopHeroEntranceScroll,
    maybeStartMobileAutoCurve,
  ])

  // Use our `getInterpolatedValue` function to figure out the values for
  // the start point and the control points.
  const targetStartPoint = getInterpolatedValue(
    90, // curvy value
    0, // flat value
    scrollRatio
  )

  const targetFirstControlPoint = getInterpolatedValue(
    60, // curvy value
    0, // flat value
    scrollRatio
  )

  const targetSecondControlPoint = getInterpolatedValue(
    100, // curvy value
    0, // flat value
    scrollRatio
  )

  // Unlike the other 3 points, the `endPoint` is
  // constant, and doesn't need interpolation.
  const targetEndPoint = getInterpolatedValue(80, 0, scrollRatio)

  const pixelInstructions = getPixelCurveInstructions(
    mix(100, targetStartPoint, curveRevealProgress),
    mix(100, targetFirstControlPoint, curveRevealProgress),
    mix(100, targetSecondControlPoint, curveRevealProgress),
    mix(100, targetEndPoint, curveRevealProgress)
  )
  const nonDesktopHeroOpacity =
    1 -
    getProgressBetween(
      scrollRatio,
      NON_DESKTOP_HERO_LAYER_FADE_START_SCROLL_RATIO,
      NON_DESKTOP_HERO_LAYER_HIDE_SCROLL_RATIO
    )
  const shouldShowFixedNonDesktopHero =
    hasReachedCurveStart &&
    curveRevealProgress > 0 &&
    scrollRatio < NON_DESKTOP_HERO_LAYER_HIDE_SCROLL_RATIO
  const shouldShowPreviewHero = !hasReachedCurveStart
  const shouldShowDesktopHero =
    !hasReachedCurveStart || scrollRatio < DESKTOP_HERO_LAYER_HIDE_SCROLL_RATIO
  const shouldShowCurveOverlay =
    !isHomeLandingHandoffActive && curveRevealProgress > 0 && scrollRatio < 1
  const curveRevealTranslateY = (1 - curveRevealProgress) * curveRevealTravel
  const mirroredCurveTransform = mirrorCurve ? " scaleX(-1)" : ""

  return (
    <>
      <div ref={rootAnchorRef} aria-hidden className="h-0" />
      <section
        className="relative lg:hidden"
        style={{
          backgroundColor: HERO_SURFACE_COLOR,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: HERO_SURFACE_COLOR,
            overflow: "hidden",
            isolation: "isolate",
            display: shouldShowPreviewHero ? "block" : "none",
            opacity: shouldShowPreviewHero ? 1 : 0,
            visibility: shouldShowPreviewHero ? "visible" : "hidden",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <Container>{children}</Container>
        </div>
        <div
          style={{
            position: "fixed",
            top: "3.5rem",
            left: 0,
            right: 0,
            height: "calc(100svh - 3.5rem)",
            width: "100%",
            backgroundColor: HERO_SURFACE_COLOR,
            display: shouldShowFixedNonDesktopHero ? "block" : "none",
            opacity: shouldShowFixedNonDesktopHero ? nonDesktopHeroOpacity : 0,
            overflow: "hidden",
            isolation: "isolate",
            visibility: shouldShowFixedNonDesktopHero ? "visible" : "hidden",
            zIndex: 0,
          }}
        >
          <Container>{children}</Container>
        </div>
        <div
          aria-hidden
          style={{
            position: "fixed",
            top: "3.5rem",
            left: 0,
            right: 0,
            height: "calc(100svh - 3.5rem)",
            pointerEvents: "none",
            zIndex: 30,
            visibility: shouldShowCurveOverlay ? "visible" : "hidden",
            transform: `translateY(${curveRevealTranslateY}px)`,
            willChange: "transform",
          }}
        >
          <div
            style={{
              position: "relative",
              height: "100%",
            }}
          >
            <svg
              ref={nodeRef}
              viewBox="0 0 100 100"
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                inset: 0,
                transform: mirrorCurve ? "scaleX(-1)" : undefined,
                transformOrigin: mirrorCurve ? "center center" : undefined,
              }}
              shapeRendering="crispEdges"
              preserveAspectRatio="none"
            >
              <path
                d={pixelInstructions}
                fill={BACKGROUND_COLOR as string}
                stroke="hsl(var(--border))"
                strokeWidth={0}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
        <div
          id="nonDesktopPlaceHolder"
          style={{
            height: `${SCROLLABLE_HEIGHT_IN_VH}svh`,
            zIndex: -1,
          }}
        ></div>
      </section>
      <div className="relative hidden lg:block">
        <div
          style={{
            position: hasReachedCurveStart ? "fixed" : "absolute",
            inset: 0,
            top: hasReachedCurveStart ? 0 : undefined,
            left: hasReachedCurveStart ? 0 : undefined,
            height: "100vh",
            width: "100%",
            backgroundColor: HERO_SURFACE_COLOR,
            overflow: "hidden",
            visibility: shouldShowDesktopHero ? "visible" : "hidden",
            pointerEvents: shouldShowDesktopHero ? "auto" : "none",
            zIndex: 0,
          }}
        >
          <Container>{children}</Container>
        </div>
        <svg
          ref={nodeRef}
          viewBox="0 0 100 100"
          style={{
            width: "100%",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            visibility: shouldShowCurveOverlay ? "visible" : "hidden",
            transform: `translateY(${curveRevealTranslateY}px)${mirroredCurveTransform}`,
            transformOrigin: mirrorCurve ? "center center" : undefined,
            willChange: "transform",
          }}
          shapeRendering="crispEdges"
          preserveAspectRatio="none"
        >
          <path
            d={pixelInstructions}
            fill={BACKGROUND_COLOR as string}
            stroke="hsl(var(--border))"
            strokeWidth={0}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div
          id="placeHolder"
          style={{
            height: `${SCROLLABLE_HEIGHT_IN_VH}vh`,
            zIndex: -1,
          }}
        ></div>
      </div>
    </>
  )
}

export default DynamicBezierCurve
