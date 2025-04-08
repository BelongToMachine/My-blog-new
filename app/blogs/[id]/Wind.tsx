"use client"

import { Flex } from "@radix-ui/themes"
import React, { useEffect, useRef, useState } from "react"
import {
  useDefaultCursorStore,
  useVirtualCursorStore,
} from "@/app/service/Store"

const WIND_SPEED = 7
const CURSOR_FLOW_SPEED = 10

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
    const intervalId = setInterval(() => {
      setWindOffsetX((prev) => prev - 0.6 * WIND_SPEED)

      if (isMagicCursor && isOverlapping) {
        setCursorPosition((prev) => ({
          x: Math.max(0, prev.x - 0.6 * CURSOR_FLOW_SPEED),
          y: prev.y,
        }))
      }
    }, 16.67)

    // Cleanup interval on unmount
    return () => clearInterval(intervalId)
  }, [isMagicCursor, isOverlapping, setCursorPosition])

  return (
    <Flex
      ref={windRef}
      className="wind w-[90%] max-w-sm mt-6"
      align="center"
      style={{ backgroundPositionX: `${windOffsetX}px` }}
    ></Flex>
  )
}

export default Wind
