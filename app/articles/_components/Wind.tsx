"use client"

import { useDefaultCursorStore, useVirtualCursorStore } from "@/app/service/Store"
import { cn } from "@/lib/utils"
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react"

const WIND_TILE_WIDTH = 64
const WIND_TARGET_FOLLOW_MS = 220
const FREE_TARGET_FOLLOW_MS = 45

function parseCssSize(value: string, fallback: number) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseAnimationDurationMs(value: string) {
  const firstDuration = value.split(",")[0]?.trim() ?? ""

  if (firstDuration.endsWith("ms")) {
    return Number.parseFloat(firstDuration)
  }

  if (firstDuration.endsWith("s")) {
    return Number.parseFloat(firstDuration) * 1000
  }

  return Number.NaN
}

function getWindSpeedPxPerMs(windElement: HTMLDivElement) {
  const fastLane = windElement.querySelector(".wind__lane--near")

  if (!fastLane) return WIND_TILE_WIDTH / 620

  const duration = parseAnimationDurationMs(
    window.getComputedStyle(fastLane).animationDuration
  )

  return Number.isFinite(duration) && duration > 0
    ? WIND_TILE_WIDTH / duration
    : WIND_TILE_WIDTH / 620
}

function getWindFieldBounds(windElement: HTMLDivElement) {
  const windRect = windElement.getBoundingClientRect()
  const styles = window.getComputedStyle(windElement)
  const fieldHeight = parseCssSize(
    styles.getPropertyValue("--wind-face-height"),
    windRect.height
  )

  return {
    left: windRect.left,
    right: windRect.right,
    top: windRect.top,
    bottom: windRect.top + Math.min(fieldHeight, windRect.height),
  }
}

function isPointInsideRect(
  point: { x: number; y: number },
  rect: Pick<DOMRect, "left" | "right" | "top" | "bottom">
) {
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  )
}

function getFollowFactor(timeDelta: number, followMs: number) {
  return 1 - Math.exp(-timeDelta / followMs)
}

const Wind = ({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) => {
  const isMagicCursor = useDefaultCursorStore((state) => state.isMagicCursor)
  const switchMagicCursor = useDefaultCursorStore(
    (state) => state.switchMagicCursor
  )
  const setCursorPosition = useVirtualCursorStore(
    (state) => state.setCursorPosition
  )
  const setCursorTargetPosition = useVirtualCursorStore(
    (state) => state.setCursorTargetPosition
  )
  const setCursorVariant = useVirtualCursorStore((state) => state.setCursorVariant)
  const windRef = useRef<HTMLDivElement>(null)
  const controlRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    const position = { x: event.clientX, y: event.clientY }
    setCursorPosition(position)
    setCursorVariant("arrow")
    switchMagicCursor(true)
  }

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    setCursorTargetPosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseLeave = () => {
    setCursorVariant("arrow")
    switchMagicCursor(false)
  }

  useEffect(() => {
    if (!isMagicCursor) return

    let animationFrameId: number
    let prevTime: number | undefined

    const step = (currTime: number) => {
      if (!prevTime) prevTime = currTime
      const timeDelta = Math.min(24, Math.max(8, currTime - prevTime))
      prevTime = currTime

      const windElement = windRef.current
      const cursorState = useVirtualCursorStore.getState()
      const targetPosition = cursorState.targetPosition

      if (!windElement || !targetPosition) {
        animationFrameId = window.requestAnimationFrame(step)
        return
      }

      const windBounds = getWindFieldBounds(windElement)
      const buttonRect =
        controlRef.current?.querySelector("button")?.getBoundingClientRect() ??
        null
      const currentPosition = cursorState.position ?? targetPosition
      const isInWindField = isPointInsideRect(currentPosition, windBounds)
      const followFactor = getFollowFactor(
        timeDelta,
        isInWindField ? WIND_TARGET_FOLLOW_MS : FREE_TARGET_FOLLOW_MS
      )
      const windSpeed = isInWindField ? getWindSpeedPxPerMs(windElement) : 0
      const nextPosition = {
        x: Math.max(
          0,
          currentPosition.x +
            (targetPosition.x - currentPosition.x) * followFactor -
            windSpeed * timeDelta
        ),
        y:
          currentPosition.y +
          (targetPosition.y - currentPosition.y) * followFactor,
      }

      useVirtualCursorStore.setState({
        position: nextPosition,
        cursorVariant:
          buttonRect &&
          (isPointInsideRect(targetPosition, buttonRect) ||
            isPointInsideRect(nextPosition, buttonRect))
            ? "pointer"
            : "arrow",
      })

      animationFrameId = window.requestAnimationFrame(step)
    }

    animationFrameId = window.requestAnimationFrame(step)
    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId)
    }
  }, [isMagicCursor])

  return (
    <div
      ref={windRef}
      className={cn("wind", className)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children ? (
        <div ref={controlRef} className="wind__control">
          {children}
        </div>
      ) : null}
      <span aria-hidden="true" className="wind__lane wind__lane--top" />
      <span aria-hidden="true" className="wind__lane wind__lane--far" />
      <span aria-hidden="true" className="wind__lane wind__lane--mid" />
      <span aria-hidden="true" className="wind__lane wind__lane--near" />
      <span aria-hidden="true" className="wind__lane wind__lane--low" />
    </div>
  )
}

export default Wind
