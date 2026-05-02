"use client"

import { useDefaultCursorStore, useVirtualCursorStore } from "@/app/service/Store"
import { useEffect, useRef } from "react"

const WIND_PUSH_PX_PER_MS = 0.34
const WIND_FACE_HEIGHT = 108

function hasWindContact(windRect: DOMRect, cursorRect: DOMRect) {
  const windStartOffset = windRect.width * 0.28
  const windFaceBottom = windRect.top + WIND_FACE_HEIGHT

  return (
    windRect.left + windStartOffset < cursorRect.right &&
    windRect.right > cursorRect.left &&
    windRect.top < cursorRect.bottom &&
    windFaceBottom > cursorRect.top
  )
}

const Wind = () => {
  const isMagicCursor = useDefaultCursorStore((state) => state.isMagicCursor)
  const setCursorPosition = useVirtualCursorStore(
    (state) => state.updateCursorPosition
  )
  const windRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isMagicCursor) return

    let animationFrameId: number
    let prevTime: number | undefined

    const step = (currTime: number) => {
      if (!prevTime) prevTime = currTime
      const timeDelta = Math.min(24, Math.max(8, currTime - prevTime))
      prevTime = currTime

      const cursorRect = useVirtualCursorStore.getState().cursorRect
      const windRect = windRef.current?.getBoundingClientRect()

      if (windRect && cursorRect && hasWindContact(windRect, cursorRect)) {
        setCursorPosition((prev) => ({
          x: Math.max(0, prev.x - WIND_PUSH_PX_PER_MS * timeDelta),
          y: prev.y,
        }))
      }

      animationFrameId = window.requestAnimationFrame(step)
    }

    animationFrameId = window.requestAnimationFrame(step)
    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId)
    }
  }, [isMagicCursor, setCursorPosition])

  return (
    <div ref={windRef} className="wind" aria-hidden="true">
      <span className="wind__lane wind__lane--top" />
      <span className="wind__lane wind__lane--far" />
      <span className="wind__lane wind__lane--mid" />
      <span className="wind__lane wind__lane--near" />
      <span className="wind__lane wind__lane--low" />
    </div>
  )
}

export default Wind
