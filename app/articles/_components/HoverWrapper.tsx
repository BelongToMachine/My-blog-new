"use client"

import { useDefaultCursorStore, useVirtualCursorStore } from "@/app/service/Store"
import React from "react"

const HoverWrapper = ({ children }: { children: React.ReactNode }) => {
  const switchMagicCursor = useDefaultCursorStore(
    (state) => state.switchMagicCursor
  )
  const setCursorPosition = useVirtualCursorStore(
    (state) => state.setCursorPosition
  )

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setCursorPosition({ x: event.clientX, y: event.clientY })
    switchMagicCursor(true)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setCursorPosition({ x: event.clientX, y: event.clientY })
  }

  return (
    <div
      className="flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => switchMagicCursor(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  )
}

export default HoverWrapper