"use client"

import { Box, Button, Flex } from "@radix-ui/themes"
import React, { useCallback, useEffect, useRef, useState } from "react"
import Cursor from "./Cursor"
import {
  useDefaultCursorStore,
  useVirtualCursorStore,
} from "@/app/service/Store"

const LikeAndDislike = () => {
  const isMagicCursor = useDefaultCursorStore((state) => state.isMagicCursor)
  const [isCursorLocked, setIsCursorLocked] = useState(false)
  const position = useVirtualCursorStore((state) => state.position)
  const setCursorPosition = useVirtualCursorStore(
    (state) => state.updateCursorPosition
  )
  const modalRef = useRef<HTMLDivElement>(null)
  const [windOffsetX, setWindOffsetX] = useState(0)
  const cursorRef = useRef<HTMLElement>(null)

  const handlePointerLockChange = useCallback(() => {
    // If the element is locked, which means the cursord is hidden
    // If an element has been locked (via element.requestPointerLock()), document.pointerLockElement will return that element.
    const isCursorRelesed = document.pointerLockElement !== null
    setIsCursorLocked(isCursorRelesed)
  }, [])

  useEffect(() => {
    document.addEventListener("pointerlockchange", handlePointerLockChange)
    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange)
    }
  }, [handlePointerLockChange])

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
    <Box ref={modalRef} className="w-full max-w-sm rounded-lg p-4 mt-6">
      <Flex
        className="space-x-4 wind"
        align="center"
        style={{ backgroundPositionX: `${windOffsetX}px` }}
      ></Flex>
    </Box>
  )
}

export default LikeAndDislike
