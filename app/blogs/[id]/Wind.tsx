"use client"

import { Flex } from "@radix-ui/themes"
import React, { useEffect, useRef, useState } from "react"
import {
  useDefaultCursorStore,
  useVirtualCursorStore,
} from "@/app/service/Store"

const WIND_SPEED = 5
const CURSOR_FLOW_SPEED = 10
const REFRERSH_RATO = 20

/* For state check time delay, the cursor will over the boundary of wind, to set a offset to prevent this from happening */
const WIND_BOUNDARY_X_OFFSET = 60

const Wind = () => {
  const isMagicCursor = useDefaultCursorStore((state) => state.isMagicCursor)
  const updateCursorPosition = useVirtualCursorStore(
    (state) => state.updateCursorPosition
  )
  const isOverlappingMinusOffset = useVirtualCursorStore(
    (state) => state.isOverlappingMinusOffset
  )
  const setIsOverlapping = useVirtualCursorStore(
    (state) => state.setIsOverlapping
  )
  const { getState } = useVirtualCursorStore
  const [windOffsetX, setWindOffsetX] = useState(0)
  const windRef = useRef<HTMLDivElement>(null)

  const checkOverlap = () => {
    const cursorRect = getState().cursorRect
    if (windRef.current && cursorRect) {
      const windRect = windRef.current.getBoundingClientRect()

      const baseOverlapping =
        windRect.right > cursorRect.left &&
        windRect.top < cursorRect.bottom &&
        windRect.bottom > cursorRect.top

      const minusOffsetOverlapping =
        windRect.left + WIND_BOUNDARY_X_OFFSET < cursorRect.right &&
        baseOverlapping

      const generalOverlapping =
        windRect.left < cursorRect.right && baseOverlapping

      setIsOverlapping(generalOverlapping, minusOffsetOverlapping)
    }
  }

  useEffect(() => {
    const interval = setInterval(checkOverlap, 10)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWindOffsetX((prev) => prev - 0.6 * WIND_SPEED)
      if (isMagicCursor && isOverlappingMinusOffset) {
        updateCursorPosition((prev) => ({
          x: Math.max(0, prev.x - 0.6 * CURSOR_FLOW_SPEED),
          y: prev.y,
        }))
      }
    }, REFRERSH_RATO)

    return () => clearInterval(intervalId)
  }, [isMagicCursor, isOverlappingMinusOffset, updateCursorPosition])

  return (
    <div
      ref={windRef}
      className="wind flex-grow-1 flex-1 w-full mt-6"
      style={{
        backgroundPositionX: `${windOffsetX}px`,
        position: "relative",
        height: "100%",
      }}
    ></div>
  )
}

export default Wind
