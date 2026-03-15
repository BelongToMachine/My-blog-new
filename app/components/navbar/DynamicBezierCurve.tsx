"use client"
import React, { ReactNode, useEffect, useRef, useState } from "react"
import { Container } from "@radix-ui/themes"
import style from "@/app/service/ThemeService"
import useIsInScrollable from "@/app/hooks/useIsInScrollable"

interface Props {
  children: ReactNode
}

const SCROLLABLE_HEIGHT_IN_VH = 100

const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value))

const interpolate = (curvyValue: number, flatValue: number, scrollRatio: number) =>
  curvyValue * (1 - scrollRatio) + flatValue * scrollRatio

const DynamicBezierCurve = ({ children }: Props) => {
  const [scrollRatio, setScrollRatio] = useState(0)
  const [scrolledInVH, setScrolledInVh] = useState(0)
  const animationFrameRef = useRef<number | null>(null)
  const latestRatioRef = useRef(0)
  const latestScrolledInVhRef = useRef(0)
  const backgroundColor = style.background
  const scrollableColor = style.scrollable

  useIsInScrollable(scrolledInVH, SCROLLABLE_HEIGHT_IN_VH)

  useEffect(() => {
    const updateScrollState = () => {
      animationFrameRef.current = null

      const viewportHeight = window.innerHeight || 1
      const currentScrollRatio = clamp(window.scrollY / viewportHeight)
      const currentScrolledInVh = (window.scrollY / viewportHeight) * 100

      if (latestRatioRef.current !== currentScrollRatio) {
        latestRatioRef.current = currentScrollRatio
        setScrollRatio(currentScrollRatio)
      }

      if (latestScrolledInVhRef.current !== currentScrolledInVh) {
        latestScrolledInVhRef.current = currentScrolledInVh
        setScrolledInVh(currentScrolledInVh)
      }
    }

    const handleScroll = () => {
      if (animationFrameRef.current !== null) {
        return
      }

      animationFrameRef.current = window.requestAnimationFrame(updateScrollState)
    }

    updateScrollState()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const startPoint = interpolate(90, 0, scrollRatio)
  const firstControlPoint = interpolate(60, 0, scrollRatio)
  const secondControlPoint = interpolate(100, 0, scrollRatio)
  const endPoint = interpolate(80, 0, scrollRatio)

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
          backgroundColor: scrollableColor,
          height: "100vh",
          width: "100%",
        }}
      >
        <Container>{children}</Container>
      </div>
      <svg
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
          fill={backgroundColor as string}
          stroke="transparent"
          strokeWidth="0"
        />
      </svg>
      <div
        id="placeHolder"
        style={{
          height: `${SCROLLABLE_HEIGHT_IN_VH}vh`,
          zIndex: -1,
        }}
      />
    </>
  )
}

export default DynamicBezierCurve
