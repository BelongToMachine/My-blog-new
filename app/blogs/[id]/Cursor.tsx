import { Box } from "@radix-ui/themes"
import React, { forwardRef } from "react"

interface CursorProps {
  position: { x: number; y: number }
  isVisible: boolean
}

const Cursor = forwardRef(({ position, isVisible }: CursorProps, ref) => {
  const typedRef = ref as React.Ref<HTMLDivElement>
  const cursorStyles: React.CSSProperties = {
    position: "absolute",
    zIndex: 100,
    width: "23px",
    height: "23px",
    backgroundColor: "red",
    borderRadius: "50%",
    backgroundSize: "contain",
    willChange: "transform",
    transform: `translateX(${position.x}px) translateY(${position.y}px)`,
    transition: `transform 0.1s linear`,
    display: isVisible ? `block` : `none`,
  }
  return (
    <Box ref={typedRef} style={cursorStyles}>
      {" "}
    </Box>
  )
})

Cursor.displayName = "Cursor"

export default Cursor
