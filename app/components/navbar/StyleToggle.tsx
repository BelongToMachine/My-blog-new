"use client"

import { useEffect } from "react"
import { PiSquaresFour } from "react-icons/pi"
import { PiLayout } from "react-icons/pi"
import { useStyleModeStore } from "@/app/service/Store"
import { ActionIconButton } from "../system/ActionIconButton"

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
      {styleMode === "pixel" ? <PiSquaresFour size={18} /> : <PiLayout size={18} />}
    </ActionIconButton>
  )
}

export default StyleToggle
