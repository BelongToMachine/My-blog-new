"use client"

import { IconButton } from "@radix-ui/themes"
import { PiSunDim } from "react-icons/pi"
import { GoMoon } from "react-icons/go"
import { useTheme } from "@/app/hooks/useTheme"

interface ThemeToggleProps {
  size?: "1" | "2" | "3" | "4"
}

const ThemeToggle = ({ size = "2" }: ThemeToggleProps) => {
  const { colorMode, setColorMode } = useTheme()
  const nextMode = colorMode === "light" ? "dark" : "light"

  return (
    <IconButton
      variant="ghost"
      size={size}
      color="gray"
      radius="full"
      aria-label={`Switch to ${nextMode} mode`}
      onClick={() => setColorMode(nextMode)}
    >
      {colorMode === "light" ? <PiSunDim size={20} /> : <GoMoon size={18} />}
    </IconButton>
  )
}

export default ThemeToggle
