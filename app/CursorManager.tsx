"use client"

import { useEffect } from "react"
import { useCursorStore } from "@/app/service/Store"

const CursorManager = () => {
  const { isMagicCursor, magicCursorStyle } = useCursorStore()

  useEffect(() => {
    document.body.style.cursor = isMagicCursor ? "wait" : "auto"
  }, [isMagicCursor, magicCursorStyle])

  return null
}

export default CursorManager
