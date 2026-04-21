"use client"

import { useEffect } from "react"
import { PiSquaresFour } from "react-icons/pi"
import { PiLayout } from "react-icons/pi"
import { useStyleModeStore } from "@/app/service/Store"
import { ActionIconButton } from "../system/ActionIconButton"

const PixelSquaresFour = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    shapeRendering="crispEdges"
    className="h-4 w-4"
    fill="currentColor"
  >
    <rect x="2" y="2" width="8" height="8" />
    <rect x="14" y="2" width="8" height="8" />
    <rect x="2" y="14" width="8" height="8" />
    <rect x="14" y="14" width="8" height="8" />
  </svg>
)

const PixelLayout = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    shapeRendering="crispEdges"
    className="h-4 w-4"
    fill="currentColor"
  >
    <rect x="2" y="2" width="20" height="4" />
    <rect x="2" y="8" width="8" height="14" />
    <rect x="12" y="8" width="10" height="6" />
    <rect x="12" y="16" width="10" height="6" />
  </svg>
)

const StyleToggle = () => {
  const { styleMode, toggleStyleMode } = useStyleModeStore()

  useEffect(() => {
    document.documentElement.setAttribute("data-style-mode", styleMode)
  }, [styleMode])

  const nextMode = styleMode === "pixel" ? "normal" : "pixel"

  return (
    <ActionIconButton
      aria-label={`Switch to ${nextMode} style`}
      onClick={toggleStyleMode}
      type="button"
      tone="borderless"
    >
      {styleMode === "pixel"
        ? <PixelSquaresFour />
        : <PixelLayout />}
    </ActionIconButton>
  )
}

export default StyleToggle
