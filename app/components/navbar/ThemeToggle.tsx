"use client"

import { PiSunDim } from "react-icons/pi"
import { GoMoon } from "react-icons/go"
import { useTheme } from "@/app/hooks/useTheme"
import { ActionIconButton } from "../system/ActionIconButton"

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
      {colorMode === "light" ? <PiSunDim size={18} /> : <GoMoon size={18} />}
    </ActionIconButton>
  )
}

export default ThemeToggle
