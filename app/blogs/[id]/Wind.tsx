"use client"

import { Flex } from "@radix-ui/themes"
import React, { useEffect, useRef, useState } from "react"
import {
  useDefaultCursorStore,
  useVirtualCursorStore,
} from "@/app/service/Store"

const Wind = () => {
  const isMagicCursor = useDefaultCursorStore((state) => state.isMagicCursor)
  const setCursorPosition = useVirtualCursorStore(
    (state) => state.updateCursorPosition
  )
  const { getState } = useVirtualCursorStore
  const [windOffsetX, setWindOffsetX] = useState(0)
  const windRef = useRef<HTMLDivElement>(null)
  const [isOverlapping, setIsOverlapping] = useState(false)

  const checkOverlap = () => {
    const cursorRect = getState().cursorRect
    if (windRef.current && cursorRect) {
      const movingRect = windRef.current.getBoundingClientRect()
      const staticRect = cursorRect

      // Check if the bounding boxes overlap
      const isOverlapping =
        movingRect.left + 80 < staticRect.right &&
        movingRect.right > staticRect.left &&
        movingRect.top < staticRect.bottom &&
        movingRect.bottom > staticRect.top

      setIsOverlapping(isOverlapping)
    }
  }

  useEffect(() => {
    const interval = setInterval(checkOverlap, 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let animationFrameId: number
    let prevTime: number | undefined

    const animationFrameStep = (currTime: number) => {
      if (!prevTime) {
        prevTime = currTime
      }

      const TIME_DELTA_FOR_FRESH_60 = 16.67

      const timeDelta = Math.min(
        TIME_DELTA_FOR_FRESH_60,
        Math.max(10, currTime - prevTime)
      )

      prevTime = currTime

      setWindOffsetX((prev) => prev - 0.6 * timeDelta)

      if (isMagicCursor && isOverlapping) {
        setCursorPosition((prev) => ({
          x: Math.max(0, prev.x - 0.6 * timeDelta),
          y: prev.y,
        }))
      }

      animationFrameId = window.requestAnimationFrame(animationFrameStep)
    }

    animationFrameId = window.requestAnimationFrame(animationFrameStep)

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  })

  return (
    <Flex
      ref={windRef}
      className="space-x-4 wind w-full max-w-sm rounded-lg p-4 mt-6"
      align="center"
      style={{ backgroundPositionX: `${windOffsetX}px` }}
    ></Flex>
  )
}

export default Wind
