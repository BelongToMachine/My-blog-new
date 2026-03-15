"use client"

import { PiSunDim } from "react-icons/pi"
import { GoMoon } from "react-icons/go"
import { useTheme } from "@/app/hooks/useTheme"
import classNames from "classnames"

const ThemeToggle = () => {
  const { colorMode, setColorMode } = useTheme()
  const nextMode = colorMode === "light" ? "dark" : "light"

  return (
    <button
      className={classNames("nav-control", "nav-control-icon")}
      aria-label={`Switch to ${nextMode} mode`}
      onClick={() => setColorMode(nextMode)}
      type="button"
    >
      {colorMode === "light" ? <PiSunDim size={18} /> : <GoMoon size={18} />}
    </button>
  )
}

export default ThemeToggle
