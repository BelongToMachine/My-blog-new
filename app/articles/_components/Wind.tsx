"use client"

import { useDefaultCursorStore, useVirtualCursorStore } from "@/app/service/Store"
import { useEffect, useRef, useState } from "react"

const Wind = () => {
  const isMagicCursor = useDefaultCursorStore((state) => state.isMagicCursor)
  const setCursorPosition = useVirtualCursorStore(
    (state) => state.updateCursorPosition
  )
  const { getState } = useVirtualCursorStore
  const [windOffsetX, setWindOffsetX] = useState(0)
  const windRef = useRef<HTMLDivElement>(null)
  const [isOverlapping, setIsOverlapping] = useState(false)

  useEffect(() => {
    const checkOverlap = () => {
      const cursorRect = getState().cursorRect
      if (windRef.current && cursorRect) {
        const movingRect = windRef.current.getBoundingClientRect()
        const staticRect = cursorRect
        const overlaps =
          movingRect.left + 80 < staticRect.right &&
          movingRect.right > staticRect.left &&
          movingRect.top < staticRect.bottom &&
          movingRect.bottom > staticRect.top
        setIsOverlapping(overlaps)
      }
    }

    const interval = setInterval(checkOverlap, 100)
    return () => clearInterval(interval)
  }, [getState])

  useEffect(() => {
    let animationFrameId: number
    let prevTime: number | undefined

    const step = (currTime: number) => {
      if (!prevTime) prevTime = currTime
      const timeDelta = Math.min(20, Math.max(10, currTime - prevTime))
      prevTime = currTime

      setWindOffsetX((prev) => prev - 0.6 * timeDelta)

      if (isMagicCursor && isOverlapping) {
        setCursorPosition((prev) => ({
          x: Math.max(0, prev.x - 0.6 * timeDelta),
          y: prev.y,
        }))
      }

      animationFrameId = window.requestAnimationFrame(step)
    }

    animationFrameId = window.requestAnimationFrame(step)
    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId)
    }
  })

  return (
    <div
      ref={windRef}
      className="wind"
      style={{
        top: 0,
        width: 160,
        flexShrink: 0,
        backgroundPositionX: `${windOffsetX}px`,
      }}
    />
  )
}

export default Wind