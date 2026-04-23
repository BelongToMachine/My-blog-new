"use client"
import { useScrollableStore } from "@/app/service/Store"
import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react"
import { Container } from "@radix-ui/themes"
import style from "@/app/service/ThemeService"
import useIsInScrollable from "@/app/hooks/useIsInScrollable"
import { isDesktopViewport } from "@/app/lib/responsive"

interface Props {
  children: ReactNode
}

// Utility function that clamps a given value to a
// specific range (inclusive, between min and max).
const clamp = (val: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, val))

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

const DynamicBezierCurve = ({ children }: Props) => {
  const [scrollRatio, setScrollRatio] = useState(0)
  const [scrolledInVH, setScrolledInVh] = useState(0)
  const nodeRef = useRef(null)
  const mobileAvatarExitScrollRef = useRef<number | null>(null)
  const isInScrollable = useScrollableStore((state) => state.isInScrollable)
  const BACKGROUND_COLOR = style.background
  const SCROLLABLE_COLOR = style.scrollable

  const SCROLLABLE_HEIGHT_IN_VH = 100
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

  useIsInScrollable(scrolledInVH, SCROLLABLE_HEIGHT_IN_VH)

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

    if (isInScrollable) {
      window.addEventListener("wheel", handleScroll, { passive: false })
      return () => window.removeEventListener("wheel", handleScroll)
    }
  }, [isInScrollable])

  useEffect(() => {
    const captureMobileAvatarExitPoint = () => {
      if (isDesktopViewport(window.innerWidth)) {
        mobileAvatarExitScrollRef.current = null
        return
      }

      const mobileAvatar = document.querySelector<HTMLElement>(
        "[data-mobile-hero-avatar]"
      )

      if (!mobileAvatar) {
        mobileAvatarExitScrollRef.current = window.innerHeight * 0.6
        return
      }

      const rect = mobileAvatar.getBoundingClientRect()
      const navOffset = 56
      const avatarBottomInDocument = window.scrollY + rect.bottom

      mobileAvatarExitScrollRef.current = Math.max(
        avatarBottomInDocument - navOffset,
        1
      )
    }

    captureMobileAvatarExitPoint()
    window.addEventListener("resize", captureMobileAvatarExitPoint)

    return () => {
      window.removeEventListener("resize", captureMobileAvatarExitPoint)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!nodeRef.current) return

      const windowHeight = window.innerHeight
      const pixelsScrolled = Math.abs(window.scrollY)
      const isDesktop = isDesktopViewport(window.innerWidth)
      let ratio = 0

      if (!isDesktop) {
        const mobileExitScroll =
          mobileAvatarExitScrollRef.current ?? windowHeight * 0.6
        const mobileProgress = pixelsScrolled / mobileExitScroll
        setScrolledInVh(clamp(mobileProgress) * 100)
        ratio = clamp(ADJUSTED_SCROLL_COEFFICIENT * mobileProgress)
      } else {
        const baseRatio = pixelsScrolled / windowHeight
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
  }, [])

  // Use our `getInterpolatedValue` function to figure out the values for
  // the start point and the control points.
  const startPoint = getInterpolatedValue(
    90, // curvy value
    0, // flat value
    scrollRatio
  )

  const firstControlPoint = getInterpolatedValue(
    60, // curvy value
    0, // flat value
    scrollRatio
  )

  const secondControlPoint = getInterpolatedValue(
    100, // curvy value
    0, // flat value
    scrollRatio
  )

  // Unlike the other 3 points, the `endPoint` is
  // constant, and doesn't need interpolation.
  const endPoint = getInterpolatedValue(80, 0, scrollRatio)

  const pixelInstructions = getPixelCurveInstructions(
    startPoint,
    firstControlPoint,
    secondControlPoint,
    endPoint
  )

  return (
    <>
      <section
        className="relative lg:hidden"
        style={{
          backgroundColor: SCROLLABLE_COLOR,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 30,
          }}
        >
          <div
            style={{
              position: "sticky",
              top: "3.5rem",
              height: "calc(100svh - 3.5rem)",
            }}
          >
            <svg
              ref={nodeRef}
              viewBox="0 0 100 100"
              style={{
                width: "100%",
                height: "calc(100svh - 3.5rem)",
                position: "absolute",
                inset: 0,
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
        <Container>
          <div
            style={{
              position: "relative",
              minHeight: "100svh",
              paddingBottom: "2.5rem",
            }}
          >
            {children}
          </div>
        </Container>
      </section>
      <div className="hidden lg:block">
        <div
          style={{
            position: "fixed",
            backgroundColor: SCROLLABLE_COLOR,
            height: "100vh",
            width: "100%",
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
            pointerEvents: "none",
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
