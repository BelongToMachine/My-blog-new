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
  const [windOffsetX, setWindOffsetX] = useState(0)

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

  return (
    <Flex
      className="space-x-4 wind w-full max-w-sm rounded-lg p-4 mt-6"
      align="center"
      style={{ backgroundPositionX: `${windOffsetX}px` }}
    ></Flex>
  )
}

export default LikeAndDislike
