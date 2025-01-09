"use client"

import { Box, Button, Flex } from "@radix-ui/themes"
import React, { useCallback, useEffect, useRef, useState } from "react"
import Cursor from "./Cursor"
import { useDefaultCursorStore } from "@/app/service/Store"

const LikeAndDislike = () => {
  const isMagicCursor = useDefaultCursorStore((state) => state.isMagicCursor)
  const [isCursorLocked, setIsCursorLocked] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const modalRef = useRef<HTMLDivElement>(null)
  const [windOffsetX, setWindOffsetX] = useState(0)
  const cursorRef = useRef<HTMLElement>(null)

  const handlePointerLockChange = useCallback(() => {
    // If the element is locked, which means the cursor is hidden
    // If an element has been locked (via element.requestPointerLock()), document.pointerLockElement will return that element.
    const isCursorRelesed = document.pointerLockElement !== null
    setIsCursorLocked(isCursorRelesed)
  }, [])

  const updateCursorPosition = useCallback((e: MouseEvent) => {
    setCursorPosition((prev) => {
      let newX = prev.x + e.movementX
      let newY = prev.y + e.movementY

      if (newX < 0) newX = 0
      if (newY < 0) newY = 0
      if (newX > modalRef.current.clientWidth) newX = document.body.clientWidth
      if (newY > document.body.clientHeight) newY = document.body.clientHeight

      return { x: newX, y: newY }
    })
  }, [])

  useEffect(() => {
    document.addEventListener("pointerlockchange", handlePointerLockChange)
    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange)
    }
  }, [handlePointerLockChange])

  useEffect(() => {
    if (isMagicCursor) {
      document.addEventListener("mousemove", updateCursorPosition)
    } else {
      document.removeEventListener("mousemove", updateCursorPosition)
    }
    return () => {
      document.removeEventListener("mousemove", updateCursorPosition)
    }
  }, [isMagicCursor, updateCursorPosition])

  useEffect(() => {
    let animationFrameId: number
    let prevTime: number | undefined

    const animationFrameStep = (currTime: number) => {
      if (!prevTime) {
        prevTime = currTime
      }
      const timeDelta = Math.min(20, Math.max(10, currTime - prevTime))
      prevTime = currTime

      if (isMagicCursor) {
        setWindOffsetX((prev) => prev - 0.6 * timeDelta)
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
      <Flex className="space-x-4 wind" align="center"></Flex>
    </Box>
  )
}

export default LikeAndDislike
