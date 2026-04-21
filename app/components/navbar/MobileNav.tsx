"use client"
import React from "react"
import { PiGithubLogoFill } from "react-icons/pi"
import NextLink from "next/link"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"
import { ActionIconButton } from "../system/ActionIconButton"
import { useStyleModeStore } from "@/app/service/Store"
import PixelGithubIcon from "./PixelGithubIcon"

const MobileNav = () => {
  const { styleMode } = useStyleModeStore()
  const isPixel = styleMode === "pixel"

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <ActionIconButton
        asChild
        aria-label="Open GitHub profile"
        tone={isPixel ? "borderless" : "quiet"}
      >
        <NextLink href="http://github.com/JieLuis">
          {isPixel ? <PixelGithubIcon /> : <PiGithubLogoFill size={20} />}
        </NextLink>
      </ActionIconButton>
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  )
}

export default MobileNav
