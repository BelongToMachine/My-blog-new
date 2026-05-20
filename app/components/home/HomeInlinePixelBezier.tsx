"use client"

import React, { ReactNode, useEffect, useRef, useState } from "react"
import style from "@/app/service/ThemeService"
import { isDesktopViewport } from "@/app/lib/responsive"

interface Props {
  children: ReactNode
}

const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value))

const getInterpolatedValue = (
  curvyValue: number,
  flatValue: number,
  scrollRatio: number
) => curvyValue * (1 - scrollRatio) + flatValue * scrollRatio

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

const getPixelCurveEdgeInstructions = (
  startPoint: number,
  firstControlPoint: number,
  secondControlPoint: number,
  endPoint: number
) => {
  const fillInstructions = getPixelCurveInstructions(
    startPoint,
    firstControlPoint,
    secondControlPoint,
    endPoint
  )

  return fillInstructions.replace(/ L 100,100 L 0,100 Z$/, "")
}

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

export default function HomeInlinePixelBezier({ children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [scrollRatio, setScrollRatio] = useState(0)
  const [revealProgress, setRevealProgress] = useState(0)
  const [curveBandHeight, setCurveBandHeight] = useState(220)
  const [curveTravelDistance, setCurveTravelDistance] = useState(280)
  const [curveEntranceDistance, setCurveEntranceDistance] = useState(280)
  const BACKGROUND_COLOR = style.background
  const HERO_SURFACE_COLOR = "hsl(var(--home-about-bridge))"

  useEffect(() => {
    const updateMeasurements = () => {
      const navOffset = getNavOffsetInPixels()
      const nextHeight = isDesktopViewport(window.innerWidth)
        ? Math.round(window.innerHeight * 0.34)
        : Math.round(window.innerHeight * 0.24)
      const resolvedHeight = Math.max(nextHeight, 140)
      const baseTravelDistance = Math.max(
        window.innerHeight - navOffset - resolvedHeight,
        120
      )
      const curveOverscan = Math.max(Math.round(resolvedHeight * 0.28), 32)
      const nextTravelDistance = baseTravelDistance + curveOverscan
      const nextEntranceDistance =
        nextTravelDistance + Math.max(Math.round(resolvedHeight * 0.45), 56)

      setCurveBandHeight(resolvedHeight)
      setCurveTravelDistance(nextTravelDistance)
      setCurveEntranceDistance(nextEntranceDistance)
    }

    updateMeasurements()
    window.addEventListener("resize", updateMeasurements)

    return () => {
      window.removeEventListener("resize", updateMeasurements)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!rootRef.current) return

      const navOffset = getNavOffsetInPixels()
      const componentTopInDocument =
        window.scrollY + rootRef.current.getBoundingClientRect().top
      const startScroll = componentTopInDocument - navOffset
      const pixelsScrolled = window.scrollY - startScroll
      const nextRevealProgress = clamp(
        (pixelsScrolled + curveEntranceDistance) / curveEntranceDistance
      )
      const nextRatio = clamp(Math.max(pixelsScrolled, 0) / curveBandHeight)

      setRevealProgress((previousValue) =>
        previousValue !== nextRevealProgress ? nextRevealProgress : previousValue
      )
      setScrollRatio((previousValue) =>
        previousValue !== nextRatio ? nextRatio : previousValue
      )
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [curveBandHeight, curveEntranceDistance])

  const startPoint = getInterpolatedValue(90, 0, scrollRatio)
  const firstControlPoint = getInterpolatedValue(60, 0, scrollRatio)
  const secondControlPoint = getInterpolatedValue(100, 0, scrollRatio)
  const endPoint = getInterpolatedValue(80, 0, scrollRatio)
  const pixelInstructions = getPixelCurveInstructions(
    startPoint,
    firstControlPoint,
    secondControlPoint,
    endPoint
  )
  const pixelEdgeInstructions = getPixelCurveEdgeInstructions(
    startPoint,
    firstControlPoint,
    secondControlPoint,
    endPoint
  )
  const showOverlay = revealProgress > 0 && scrollRatio < 1
  const overlayTranslateY = (1 - revealProgress) * curveTravelDistance

  return (
    <div ref={rootRef} className="relative">
      {showOverlay ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 z-[60]"
          style={{
            top: "var(--app-nav-offset)",
            height: `${curveBandHeight}px`,
            backgroundColor: HERO_SURFACE_COLOR,
            transform: `translateY(${overlayTranslateY}px)`,
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
            shapeRendering="crispEdges"
            preserveAspectRatio="none"
          >
            <path
              d={pixelInstructions}
              fill={BACKGROUND_COLOR as string}
              stroke="none"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={pixelEdgeInstructions}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeOpacity={0.55}
              strokeWidth={3}
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      ) : null}
      {children}
    </div>
  )
}
