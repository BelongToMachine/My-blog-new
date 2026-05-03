"use client"

import { useCallback, useEffect, useRef } from "react"
import {
  useDefaultCursorStore,
  useVirtualCursorStore,
} from "@/app/service/Store"

const CURSOR_ASSETS = {
  arrow: {
    image: "/images/cursor-macos-arrow-pixel.png",
    offsetX: 0,
    offsetY: 0,
  },
  pointer: {
    image: "/images/cursor-macos-pointer-pixel.png",
    offsetX: -8,
    offsetY: -4,
  },
} as const

const CursorManager = () => {
  const isMagicCursor = useDefaultCursorStore((state) => state.isMagicCursor)
  const position = useVirtualCursorStore((state) => state.position)
  const cursorVariant = useVirtualCursorStore((state) => state.cursorVariant)
  const setCursorRect = useVirtualCursorStore((state) => state.setCursorRect)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorAsset = CURSOR_ASSETS[cursorVariant]

  const virtualCursorStyles: React.CSSProperties = {
    backgroundImage: `url('${cursorAsset.image}')`,
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 9999,
    width: "32px",
    height: "32px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "32px 32px",
    imageRendering: "pixelated",
    pointerEvents: "none",
    willChange: "transform",
    transform: position
      ? `translate3d(${position.x + cursorAsset.offsetX}px, ${position.y + cursorAsset.offsetY}px, 0)`
      : `translate3d(-999px, -999px, 0)`,
    display: isMagicCursor ? `block` : `none`,
  }

  const updateCursorRect = useCallback(() => {
    if (cursorRef.current) {
      const rect = cursorRef.current.getBoundingClientRect()
      setCursorRect(rect)
    }
  }, [setCursorRect])

  useEffect(() => {
    window.requestAnimationFrame(updateCursorRect)
  }, [cursorVariant, position, updateCursorRect])

  useEffect(() => {
    document.body.classList.toggle("magic-cursor-active", isMagicCursor)

    return () => {
      document.body.classList.remove("magic-cursor-active")
    }
  }, [isMagicCursor])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="virtual-cursor"
      style={virtualCursorStyles}
    />
  )
}

export default CursorManager
