"use client"

import { useTheme } from "@/app/hooks/useTheme"
import { ActionIconButton } from "../system/ActionIconButton"

const PixelSun = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    shapeRendering="crispEdges"
    className="h-4 w-4"
    fill="currentColor"
  >
    <rect x="11" y="2" width="2" height="3" />
    <rect x="11" y="19" width="2" height="3" />
    <rect x="2" y="11" width="3" height="2" />
    <rect x="19" y="11" width="3" height="2" />
    <rect x="5" y="5" width="2" height="2" />
    <rect x="17" y="5" width="2" height="2" />
    <rect x="5" y="17" width="2" height="2" />
    <rect x="17" y="17" width="2" height="2" />
    <rect x="8" y="8" width="8" height="8" />
  </svg>
)

const PixelMoon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    shapeRendering="crispEdges"
    className="h-4 w-4"
    fill="currentColor"
  >
    <rect x="9" y="3" width="2" height="2" />
    <rect x="7" y="5" width="2" height="2" />
    <rect x="5" y="7" width="2" height="2" />
    <rect x="5" y="9" width="2" height="2" />
    <rect x="5" y="11" width="2" height="2" />
    <rect x="5" y="13" width="2" height="2" />
    <rect x="7" y="15" width="2" height="2" />
    <rect x="9" y="17" width="2" height="2" />
    <rect x="11" y="19" width="2" height="2" />
    <rect x="7" y="7" width="4" height="2" />
    <rect x="11" y="9" width="2" height="2" />
    <rect x="13" y="11" width="2" height="2" />
    <rect x="11" y="13" width="2" height="2" />
    <rect x="7" y="15" width="4" height="2" />
    <rect x="9" y="17" width="2" height="2" />
    <rect x="13" y="5" width="2" height="2" />
    <rect x="15" y="7" width="2" height="2" />
    <rect x="15" y="13" width="2" height="2" />
    <rect x="13" y="15" width="2" height="2" />
  </svg>
)

const ThemeToggle = () => {
  const { colorMode, setColorMode } = useTheme()
  const nextMode = colorMode === "light" ? "dark" : "light"

  return (
    <ActionIconButton
      aria-label={`Switch to ${nextMode} mode`}
      onClick={() => setColorMode(nextMode)}
      type="button"
      tone="borderless"
    >
      {colorMode === "light"
        ? <PixelSun />
        : <PixelMoon />}
    </ActionIconButton>
  )
}

export default ThemeToggle
