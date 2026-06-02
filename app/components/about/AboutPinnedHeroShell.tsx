"use client"

import { Container } from "@radix-ui/themes"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"

interface Props {
  children: ReactNode
  hero: ReactNode
  mirrorDesktopCurve?: boolean
}

const SCROLLABLE_HEIGHT_IN_VH = 100
const DESKTOP_CURVE_FLATTEN_SCROLL_RATIO = 0.92
const DESKTOP_HERO_LAYER_HIDE_SCROLL_RATIO = 0.995
const CURVE_ENTRANCE_DISTANCE_IN_PX = 180
const CURVE_ENTRANCE_TRANSLATE_Y_IN_PX = 16
const DESKTOP_SCROLL_SLOWER = 0.35

const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value))

const easeOutQuint = (value: number) => 1 - Math.pow(1 - value, 5)

const mix = (from: number, to: number, progress: number) =>
  from * (1 - progress) + to * progress

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

const getInterpolatedValue = (
  curvyValue: number,
  flatValue: number,
  scrollRatio: number,
) => curvyValue * (1 - scrollRatio) + flatValue * scrollRatio

const getPixelCurveInstructions = (
  startPoint: number,
  firstControlPoint: number,
  secondControlPoint: number,
  endPoint: number,
  stepCount = 120,
) => {
  const xGrain = 1.6
  const yGrain = 1.8
  const points = Array.from({ length: stepCount + 1 }, (_, index) => {
    const t = index / stepCount

    return {
      x: quantize(cubicPoint(t, 0, 30, 50, 100), xGrain),
      y: quantize(
        cubicPoint(t, startPoint, firstControlPoint, secondControlPoint, endPoint),
        yGrain,
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

export default function AboutPinnedHeroShell({
  hero,
  children,
  mirrorDesktopCurve = false,
}: Props) {
  const [scrollRatio, setScrollRatio] = useState(0)
  const [scrolledInVH, setScrolledInVh] = useState(0)
  const [hasReachedCurveStart, setHasReachedCurveStart] = useState(false)
  const [curveRevealProgress, setCurveRevealProgress] = useState(0)
  const rootAnchorRef = useRef<HTMLDivElement>(null)

  const getComponentTopInDocument = useCallback(() => {
    const anchorRect = rootAnchorRef.current?.getBoundingClientRect()

    if (!anchorRect) return 0

    return window.scrollY + anchorRect.top
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        setHasReachedCurveStart(false)
        setCurveRevealProgress(0)
        setScrollRatio(0)
        setScrolledInVh(SCROLLABLE_HEIGHT_IN_VH)
        return
      }

      const windowHeight = window.innerHeight
      const componentTopInDocument = getComponentTopInDocument()
      const pixelsScrolled = Math.max(window.scrollY - componentTopInDocument, 0)
      const hasEnteredCurve = window.scrollY >= componentTopInDocument
      const nextCurveRevealProgress = easeOutQuint(
        clamp(pixelsScrolled / CURVE_ENTRANCE_DISTANCE_IN_PX),
      )
      const baseRatio =
        pixelsScrolled / (windowHeight * DESKTOP_CURVE_FLATTEN_SCROLL_RATIO)
      const nextRatio = clamp(baseRatio)

      setHasReachedCurveStart((previousValue) =>
        previousValue !== hasEnteredCurve ? hasEnteredCurve : previousValue,
      )
      setCurveRevealProgress((previousValue) =>
        previousValue !== nextCurveRevealProgress
          ? nextCurveRevealProgress
          : previousValue,
      )
      setScrolledInVh(baseRatio * 100)
      setScrollRatio((previousValue) =>
        previousValue !== nextRatio ? nextRatio : previousValue,
      )
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [getComponentTopInDocument])

  useEffect(() => {
    const isCurveScrollable =
      hasReachedCurveStart && scrolledInVH < SCROLLABLE_HEIGHT_IN_VH

    if (!isCurveScrollable) return

    const handleWheel = (event: WheelEvent) => {
      if (window.innerWidth < 1024) return

      event.preventDefault()
      window.scrollBy({
        top: event.deltaY * DESKTOP_SCROLL_SLOWER,
        behavior: "auto",
      })
    }

    window.addEventListener("wheel", handleWheel, { passive: false })

    return () => window.removeEventListener("wheel", handleWheel)
  }, [hasReachedCurveStart, scrolledInVH])

  const targetStartPoint = getInterpolatedValue(90, 0, scrollRatio)
  const targetFirstControlPoint = getInterpolatedValue(60, 0, scrollRatio)
  const targetSecondControlPoint = getInterpolatedValue(100, 0, scrollRatio)
  const targetEndPoint = getInterpolatedValue(80, 0, scrollRatio)

  const pixelInstructions = getPixelCurveInstructions(
    mix(100, targetStartPoint, curveRevealProgress),
    mix(100, targetFirstControlPoint, curveRevealProgress),
    mix(100, targetSecondControlPoint, curveRevealProgress),
    mix(100, targetEndPoint, curveRevealProgress),
  )
  const shouldShowDesktopHero =
    !hasReachedCurveStart || scrollRatio < DESKTOP_HERO_LAYER_HIDE_SCROLL_RATIO
  const shouldShowCurveOverlay = curveRevealProgress > 0 && scrollRatio < 1
  const curveRevealTranslateY =
    (1 - curveRevealProgress) * CURVE_ENTRANCE_TRANSLATE_Y_IN_PX
  const mirroredCurveTransform = mirrorDesktopCurve ? " scaleX(-1)" : ""

  return (
    <>
      <div ref={rootAnchorRef} aria-hidden className="h-0" />
      <section
        className="relative overflow-hidden lg:hidden"
        style={{
          backgroundColor: "hsl(var(--home-about-bridge))",
        }}
      >
        <Container>{hero}</Container>
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
            backgroundColor: "hsl(var(--home-about-bridge))",
            overflow: "hidden",
            visibility: shouldShowDesktopHero ? "visible" : "hidden",
            pointerEvents: shouldShowDesktopHero ? "auto" : "none",
            zIndex: 0,
          }}
        >
          <Container>{hero}</Container>
        </div>
        <svg
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
            transformOrigin: mirrorDesktopCurve ? "center center" : undefined,
            willChange: "transform",
          }}
          shapeRendering="crispEdges"
          preserveAspectRatio="none"
        >
          <path
            d={pixelInstructions}
            fill="hsl(var(--background))"
            stroke="hsl(var(--border))"
            strokeWidth={0}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div aria-hidden className="h-[100vh]" />
      </div>
      {children}
    </>
  )
}
