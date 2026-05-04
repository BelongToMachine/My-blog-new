"use client"

import { useCallback, useEffect, useRef } from "react"
import {
  useDefaultCursorStore,
  useVirtualCursorStore,
} from "@/app/service/Store"

const CURSOR_CONFIG = {
  arrow: {
    offsetX: 0,
    offsetY: 0,
  },
  pointer: {
    offsetX: -9,
    offsetY: -1,
  },
} as const

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    width="32"
    height="32"
    fill="none"
    className={className}
    shapeRendering="crispEdges"
  >
    {/* ── Drop shadow offset ── */}
    <path
      d="M3 1 L3 25 L9 19 L14 29 L18 27 L13 17 L25 17 Z"
      fill="rgba(0,0,0,0.22)"
      transform="translate(2,2)"
    />
    {/* ── Arrow body ── */}
    <path
      d="M3 1 L3 25 L9 19 L14 29 L18 27 L13 17 L25 17 Z"
      fill="currentColor"
    />
    {/* ── Left-edge highlight band (gives a 3-D bevel feel) ── */}
    <path
      d="M4 3 L4 23 L8 19 L8 20 L4 24 L4 25 L3 25 L3 1 Z"
      fill="rgba(255,255,255,0.32)"
    />
    {/* ── Top-edge highlight on the horizontal arm ── */}
    <rect x="13" y="17" width="12" height="1" fill="rgba(255,255,255,0.22)" />
  </svg>
)

const PointerIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    width="32"
    height="32"
    fill="none"
    className={className}
    shapeRendering="crispEdges"
  >
    {/* ── Drop shadow ── */}
    <g fill="rgba(0,0,0,0.22)" transform="translate(2,2)">
      {/* Index finger — tall, pointing up */}
      <path d="M7 2 L7 20 L12 20 L12 2 Q12 0 9.5 0 Q7 0 7 2 Z" />
      {/* Middle finger */}
      <path d="M12 6 L12 20 L16 20 L16 6 Q16 4 14 4 Q12 4 12 6 Z" />
      {/* Ring finger */}
      <path d="M16 8 L16 20 L20 20 L20 8 Q20 6 18 6 Q16 6 16 8 Z" />
      {/* Palm */}
      <path d="M5 16 L5 24 Q5 26 7 26 L22 26 Q24 26 24 24 L24 16 Z" />
      {/* Thumb */}
      <path d="M5 16 L5 20 Q5 22 3 22 L3 18 Q3 16 5 16 Z" />
    </g>

    {/* ── Main hand ── */}
    {/* Index finger — tallest, pointing up */}
    <path d="M7 2 L7 20 L12 20 L12 2 Q12 0 9.5 0 Q7 0 7 2 Z" fill="currentColor" />
    {/* Middle finger */}
    <path d="M12 6 L12 20 L16 20 L16 6 Q16 4 14 4 Q12 4 12 6 Z" fill="currentColor" />
    {/* Ring finger */}
    <path d="M16 8 L16 20 L20 8 Q20 6 18 6 Q16 6 16 8 Z" fill="currentColor" />
    {/* Palm */}
    <path d="M5 16 L5 24 Q5 26 7 26 L22 26 Q24 26 24 24 L24 16 Z" fill="currentColor" />
    {/* Thumb — to the left of the index finger */}
    <path d="M5 16 L5 20 Q5 22 3 22 L3 18 Q3 16 5 16 Z" fill="currentColor" />

    {/* ── Detail: knuckle lines ── */}
    <rect x="8"  y="9"  width="3" height="1" fill="rgba(0,0,0,0.18)" />
    <rect x="8"  y="14" width="3" height="1" fill="rgba(0,0,0,0.18)" />
    <rect x="13" y="12" width="2" height="1" fill="rgba(0,0,0,0.14)" />
    <rect x="17" y="13" width="2" height="1" fill="rgba(0,0,0,0.12)" />

    {/* ── Detail: fingertip highlight on index ── */}
    <rect x="8" y="1" width="3" height="3" rx="1" fill="rgba(255,255,255,0.28)" />

    {/* ── Detail: left-edge bevel on index finger ── */}
    <rect x="7" y="3" width="1" height="15" fill="rgba(255,255,255,0.18)" />
  </svg>
)

const CURSOR_ICONS = {
  arrow: ArrowIcon,
  pointer: PointerIcon,
} as const

const CursorManager = () => {
  const isMagicCursor = useDefaultCursorStore((state) => state.isMagicCursor)
  const position = useVirtualCursorStore((state) => state.position)
  const cursorVariant = useVirtualCursorStore((state) => state.cursorVariant)
  const setCursorRect = useVirtualCursorStore((state) => state.setCursorRect)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorConfig = CURSOR_CONFIG[cursorVariant]
  const CursorIcon = CURSOR_ICONS[cursorVariant]

  const virtualCursorStyles: React.CSSProperties = {
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 9999,
    width: "32px",
    height: "32px",
    pointerEvents: "none",
    willChange: "transform",
    transform: position
      ? `translate3d(${position.x + cursorConfig.offsetX}px, ${position.y + cursorConfig.offsetY}px, 0)`
      : `translate3d(-999px, -999px, 0)`,
    display: isMagicCursor ? "block" : "none",
    color: "hsl(var(--foreground))",
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
    >
      <CursorIcon className="virtual-cursor__icon" />
    </div>
  )
}

export default CursorManager
