"use client"

import { Box, Flex } from "@radix-ui/themes"
import React, { useEffect, useRef, useState } from "react"
import {
  useDefaultCursorStore,
  useVirtualCursorStore,
} from "@/app/service/Store"

const LikeAndDislike = () => {
  const isMagicCursor = useDefaultCursorStore((state) => state.isMagicCursor)
  const setCursorPosition = useVirtualCursorStore(
    (state) => state.updateCursorPosition
  )
  const cursorRect = useVirtualCursorStore((state) => state.cursorRect)
  const [windOffsetX, setWindOffsetX] = useState(0)
  const windRef = useRef<HTMLDivElement>(null)
  const [isOverlapping, setIsOverlapping] = useState(false)

  const checkOverlap = () => {
    // console.log(windRef, cursorRect)
    if (windRef.current && cursorRect) {
      const movingRect = windRef.current.getBoundingClientRect()
      const staticRect = cursorRect

      console.log(movingRect, staticRect)

      // Check if the bounding boxes overlap
      const isOverlapping =
        movingRect.left < staticRect.right &&
        movingRect.right > staticRect.left &&
        movingRect.top < staticRect.bottom &&
        movingRect.bottom > staticRect.top

      setIsOverlapping(isOverlapping)
    }
  }

  useEffect(() => {
    const interval = setInterval(checkOverlap, 50) // Periodically check for overlap
    return () => clearInterval(interval) // Cleanup the interval on unmount
  }, [])

  useEffect(() => {
    let animationFrameId: number
    let prevTime: number | undefined

    const animationFrameStep = (currTime: number) => {
      if (!prevTime) {
        prevTime = currTime
      }
      const timeDelta = Math.min(20, Math.max(10, currTime - prevTime))
      prevTime = currTime

      setWindOffsetX((prev) => prev - 0.6 * timeDelta)

      if (isMagicCursor) {
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

  useEffect(() => {
    console.log(isOverlapping)
  }, [isOverlapping])

  return (
    <Flex
      ref={windRef}
      className="space-x-4 wind w-full max-w-sm rounded-lg p-4 mt-6"
      align="center"
      style={{ backgroundPositionX: `${windOffsetX}px` }}
    >
      {isOverlapping && "hiiiiiiiii"}
    </Flex>
  )
}

export default LikeAndDislike
