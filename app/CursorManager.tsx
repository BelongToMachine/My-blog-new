"use client"

import { useEffect } from "react"
import {
  useDefaultCursorStore,
  useVirtualCursorStore,
} from "@/app/service/Store"
import { Box } from "@radix-ui/themes"

const CursorManager = () => {
  const isMagicCursor = useDefaultCursorStore((state) => state.isMagicCursor)
  const position = useVirtualCursorStore((state) => state.position)

  const virtualCursorStyles: React.CSSProperties = {
    position: "absolute",
    zIndex: 100,
    width: "23px",
    height: "23px",
    backgroundColor: "red",
    borderRadius: "50%",
    backgroundSize: "contain",
    willChange: "transform",
    transform: position
      ? `translateX(${position.x}px) translateY(${position.y - 50}px)`
      : `none`,
    transition: `transform 0.1s linear`,
    display: isMagicCursor ? `block` : `none`,
  }

  useEffect(() => {
    document.body.style.cursor = isMagicCursor ? "none" : "auto"
  }, [isMagicCursor])

  return <Box style={virtualCursorStyles}> </Box>
}

export default CursorManager
