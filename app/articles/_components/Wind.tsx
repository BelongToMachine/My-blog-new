"use client"

import { useDefaultCursorStore, useVirtualCursorStore } from "@/app/service/Store"
import { cn } from "@/lib/utils"
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react"

const WIND_TILE_WIDTH = 64
const WIND_TARGET_FOLLOW_MS = 240
const FREE_TARGET_FOLLOW_MS = 42
const WIND_STRUGGLE_RESPONSE = 0.14
const WIND_STRUGGLE_DECAY_MS = 110
const WIND_STRUGGLE_MAX = 3.2

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

  return {
    left: windRect.left,
    right: windRect.right,
    top: windRect.top,
    bottom: windRect.bottom,
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
  const lastInputPositionRef = useRef<{ x: number; y: number } | null>(null)
  const struggleImpulseRef = useRef(0)

  const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    const position = { x: event.clientX, y: event.clientY }
    lastInputPositionRef.current = position
    struggleImpulseRef.current = 0
    setCursorPosition(position)
    setCursorVariant("arrow")
    switchMagicCursor(true)
  }

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const nextPosition = { x: event.clientX, y: event.clientY }
    const lastInputPosition = lastInputPositionRef.current

    if (lastInputPosition) {
      const movementX = nextPosition.x - lastInputPosition.x

      if (movementX > 0) {
        struggleImpulseRef.current = Math.min(
          WIND_STRUGGLE_MAX,
          struggleImpulseRef.current + movementX * WIND_STRUGGLE_RESPONSE
        )
      } else if (movementX < 0) {
        struggleImpulseRef.current = Math.max(
          0,
          struggleImpulseRef.current + movementX * 0.18
        )
      }
    }

    lastInputPositionRef.current = nextPosition
    setCursorTargetPosition(nextPosition)
  }

  const handleMouseLeave = () => {
    lastInputPositionRef.current = null
    struggleImpulseRef.current = 0
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
      const isTargetInWindField = isPointInsideRect(targetPosition, windBounds)
      const isCursorInWindField = isPointInsideRect(currentPosition, windBounds)
      const isWindActive = isTargetInWindField || isCursorInWindField
      const followFactor = getFollowFactor(
        timeDelta,
        isWindActive ? WIND_TARGET_FOLLOW_MS : FREE_TARGET_FOLLOW_MS
      )
      const windSpeed = isWindActive ? getWindSpeedPxPerMs(windElement) : 0
      const strugglePushX = struggleImpulseRef.current * (timeDelta / 16)
      const struggleDecay = Math.exp(-timeDelta / WIND_STRUGGLE_DECAY_MS)
      const freeFollowX =
        currentPosition.x + (targetPosition.x - currentPosition.x) * followFactor
      const blownFollowX =
        currentPosition.x - windSpeed * timeDelta + strugglePushX
      const nextPosition = {
        x: isWindActive
          ? Math.max(windBounds.left, blownFollowX)
          : Math.max(0, freeFollowX),
        y:
          currentPosition.y +
          (targetPosition.y - currentPosition.y) * followFactor,
      }

      struggleImpulseRef.current = isWindActive
        ? struggleImpulseRef.current * struggleDecay
        : 0

      useVirtualCursorStore.setState({
        position: nextPosition,
        cursorVariant:
          buttonRect &&
          (isPointInsideRect(currentPosition, buttonRect) ||
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
