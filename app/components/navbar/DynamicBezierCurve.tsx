"use client"
import { useScrollableStore } from "@/app/service/Store"
import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  useContext,
} from "react"
import { Container } from "@radix-ui/themes"
import { ThemeContext } from "@/app/context/DarkModeContext"
import style from "@/app/service/ThemeService"
import useIsInScrollable from "@/app/hooks/useIsInScrollable"
import { useTheme } from "@/app/hooks/useTheme"

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

const DynamicBezierCurve = ({ children }: Props) => {
  const [scrollRatio, setScrollRatio] = useState(0)
  const [scrolledInVH, setScrolledInVh] = useState(0)
  const nodeRef = useRef(null)
  const isInScrollable = useScrollableStore((state) => state.isInScrollable)
  const BACKGROUND_COLOR = style.background
  const SCROLLABLE_COLOR = style.scrollable

  const theme = useTheme()

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
    const handleScroll = () => {
      if (!nodeRef.current) return

      const windowHeight = window.innerHeight
      const pixelsScrolled = Math.abs(window.scrollY)
      const baseRatio = pixelsScrolled / windowHeight

      setScrolledInVh(baseRatio * 100)

      let ratio = ADJUSTED_SCROLL_COEFFICIENT * baseRatio

      // We don't care about the negative values when it's
      // below the viewport, or the greater-than-1 values when
      // it's above the viewport.
      ratio = clamp(ratio)

      // Small optimization, avoid re-rendering when the
      // SVG isn't in the viewport.
      if (scrollRatio !== ratio) {
        setScrollRatio(ratio)
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrollRatio]) // Include scrollRatio in dependencies to ensure handleScroll has the latest value

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

  // Create the SVG path instructions, using our
  // interpolated values.
  const instructions = `
    M 0,${startPoint}
    C 30,${firstControlPoint}
      50,${secondControlPoint}
      100,${endPoint}
    L 100,100
    L 0,100
  `

  return (
    <>
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
        preserveAspectRatio="none"
      >
        <path
          d={instructions}
          fill={BACKGROUND_COLOR as string}
          stroke="hotpink"
          strokeWidth="0"
        />
      </svg>
      <div
        id="placeHolder"
        style={{
          height: `${SCROLLABLE_HEIGHT_IN_VH}vh`,
          zIndex: -1,
        }}
      ></div>
    </>
  )
}

export default DynamicBezierCurve
