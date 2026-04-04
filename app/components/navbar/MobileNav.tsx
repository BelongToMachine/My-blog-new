"use client"
import React from "react"
import { PiGithubLogoFill } from "react-icons/pi"
import NextLink from "next/link"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"
import { ActionIconButton } from "../system/ActionIconButton"

const MobileNav = () => {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <ActionIconButton asChild aria-label="Open GitHub profile" tone="quiet">
        <NextLink href="http://github.com/JieLuis">
          <PiGithubLogoFill size={20} />
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
