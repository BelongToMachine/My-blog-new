import {
  useDefaultCursorStore,
  useVirtualCursorStore,
} from "@/app/service/Store"
import { Flex } from "@radix-ui/themes"
import React from "react"

const HoverWrapper = ({ children }: { children: React.ReactNode }) => {
  const switchMagicCursor = useDefaultCursorStore(
    (state) => state.switchMagicCursor
  )

  const setCursorPosition = useVirtualCursorStore(
    (state) => state.setCursorPosition
  )

  const updateCursorPosition = useVirtualCursorStore(
    (state) => state.updateCursorPosition
  )

  const isOverlapping = useVirtualCursorStore((state) => state.isOverlapping)

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setCursorPosition({
      x: event.clientX,
      y: event.clientY,
    })

    switchMagicCursor(true)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isOverlapping) {
      updateCursorPosition((prev) => {
        const resistanceFactor = 0.1
        const dx = event.clientX - prev.x
        const dy = event.clientY - prev.y

        const nextX = prev.x + dx * resistanceFactor
        const nextY = prev.y + dy * resistanceFactor

        return { x: nextX, y: nextY }
      })
    } else {
      setCursorPosition({
        x: event.clientX,
        y: event.clientY,
      })
    }
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => switchMagicCursor(false)}
      onMouseMove={handleMouseMove}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingTop: "1rem",
      }}
    >
      {children}
    </div>
  )
}

export default HoverWrapper
