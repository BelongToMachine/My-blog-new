import { Box, Button, Flex } from "@radix-ui/themes"
import React, { useCallback, useEffect, useState } from "react"

const LikeAndDislike = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [windOffsetX, setWindOffsetX] = useState(0)
  const updateCursorPosition = useCallback((e: MouseEvent) => {
    setCursorPosition((prev) => {
      let newX = prev.x + e.movementX
      let newY = prev.y + e.movementY

      if (newX < 0) newX = 0
      if (newY < 0) newY = 0
      if (newX > document.body.clientWidth) newX = document.body.clientWidth
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
    if (isCursorLocked) {
      document.addEventListener("mousemove", updateCursorPosition)
    } else {
      document.removeEventListener("mousemove", updateCursorPosition)
    }
    return () => {
      document.removeEventListener("mousemove", updateCursorPosition)
    }
  }, [isCursorLocked, updateCursorPosition])

  useEffect(() => {
    let animationFrameId: number;
    let prevTime: number | undefined;

    const animationFrameStep = (currTime: number) => {
      if (!prevTime) {
        prevTime = currTime;
      }
      const timeDelta = Math.min(20, Math.max(10, currTime - prevTime));
      prevTime = currTime;

      if (isCursorLocked) {
        setWindOffsetX(prev => prev - 0.6 * timeDelta);
        setCursorPosition(prev => ({
          x: Math.max(0, prev.x - 0.6 * timeDelta),
          y: prev.y
        }));
      }

      animationFrameId = window.requestAnimationFrame(animationFrameStep);
    })

  return (
    <Box className="w-full max-w-sm rounded-lg p-4 mt-6">
      <Flex className="space-x-4" align="center">
        <Cursor position={cursorPosition} isVisible={isCursorLocked} />
        <Fan windOffsetX={windOffsetX} />
      </Flex>
    </Box>
  )
}

export default LikeAndDislike
