"use client"
import { useScrollableStore } from "@/app/service/Store"
import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  useContext,
} from "react"
import Hero from "../Hero"
import { Container } from "@radix-ui/themes"
import { ThemeContext } from "@/app/context/DarkModeContext"

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
  const nodeRef = useRef(null)
  const setIsInScrollable = useScrollableStore(
    (state) => state.setIsInScrollable
  )

  const theme = useContext(ThemeContext)

  if (!theme) {
    throw new Error("ThemeContext must be used within a ThemeProvider")
  }

  const { colorMode } = theme

  const SCROLLABLE_HEIGHT_IN_VH = 280
  const ADJUSTED_SCROLL_COEFFICIENT = 0.4
  const CONTENT_BACKGROUND = colorMode === "light" ? "lightblue" : "green"

  const handleScroll = () => {
    if (!nodeRef.current) return

    const windowHeight = window.innerHeight
    const pixelsScrolled = Math.abs(window.scrollY)
    const baseRatio = pixelsScrolled / windowHeight
    const scrolledInVH = baseRatio * 100

    if (scrolledInVH < SCROLLABLE_HEIGHT_IN_VH) {
      setIsInScrollable(true)
    } else {
      setIsInScrollable(false)
    }

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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrollRatio]) // Include scrollRatio in dependencies to ensure handleScroll has the latest value

  // Use our `getInterpolatedValue` function to figure out the values for
  // the start point and the control points.
  const startPoint = getInterpolatedValue(
    95, // curvy value
    0, // flat value
    scrollRatio
  )

  const firstControlPoint = getInterpolatedValue(
    50, // curvy value
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
  const endPoint = getInterpolatedValue(70, 0, scrollRatio)

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
          backgroundColor: `${CONTENT_BACKGROUND}`,
          height: "100vh",
          width: "100%",
          zIndex: "-2",
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
          zIndex: "-1",
        }}
        preserveAspectRatio="none"
      >
        <path d={instructions} fill="white" stroke="hotpink" strokeWidth="0" />
      </svg>
      <div
        style={{
          height: `${SCROLLABLE_HEIGHT_IN_VH}vh`,
        }}
      ></div>
    </>
  )
}

export default DynamicBezierCurve
