"use client"

import { useEffect, useRef } from "react"
import {
  useDefaultCursorStore,
  useVirtualCursorStore,
} from "@/app/service/Store"
import { Box } from "@radix-ui/themes"

const CursorManager = () => {
  const isMagicCursor = useDefaultCursorStore((state) => state.isMagicCursor)
  const position = useVirtualCursorStore((state) => state.position)
  const setCursorRect = useVirtualCursorStore((state) => state.setCursorRect)
  const cursorRef = useRef<HTMLDivElement>(null)

  const virtualCursorStyles: React.CSSProperties = {
    position: "fixed",
    zIndex: 100,
    width: "23px",
    height: "23px",
    backgroundColor: "red",
    borderRadius: "50%",
    backgroundSize: "contain",
    willChange: "transform",
    transform: position
      ? `translateX(${position.x}px) translateY(${position.y}px)`
      : `none`,
    transition: `transform 0.1s linear`,
    display: isMagicCursor ? `block` : `none`,
  }

  const updateCursorRect = () => {
    if (cursorRef.current) {
      const rect = cursorRef.current.getBoundingClientRect()
      setCursorRect(rect)
    }
  }

  useEffect(() => {
    const interval = setInterval(updateCursorRect, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    document.body.style.cursor = isMagicCursor ? "none" : "auto"
  }, [isMagicCursor])

  return (
    <Box ref={cursorRef} style={virtualCursorStyles}>
      {" "}
    </Box>
  )
}

export default CursorManager
