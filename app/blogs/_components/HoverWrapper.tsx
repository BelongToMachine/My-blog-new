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

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setCursorPosition({
      x: event.clientX,
      y: event.clientY,
    })

    switchMagicCursor(true)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setCursorPosition({
      x: event.clientX,
      y: event.clientY,
    })
  }

  return (
    <Flex
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => switchMagicCursor(false)}
      onMouseMove={handleMouseMove}
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexGrow: "1",
      }}
    >
      {children}
    </Flex>
  )
}

export default HoverWrapper
