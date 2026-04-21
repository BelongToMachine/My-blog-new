"use client"
import React, { useMemo } from "react"
import { PiGithubLogoFill } from "react-icons/pi"
import NextLink from "next/link"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"
import { ActionIconButton } from "../system/ActionIconButton"
import { useStyleModeStore } from "@/app/service/Store"
import PixelGithubIcon from "./PixelGithubIcon"
import StyleToggle from "./StyleToggle"
import { Link, usePathname } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"
import { NavItem } from "../system/NavItem"
import { cn } from "@/lib/utils"

const MobileNav = () => {
  const { styleMode } = useStyleModeStore()
  const isPixel = styleMode === "pixel"
  const t = useTranslations("nav")
  const currentPath = usePathname()
  const links = useMemo(
    () => [
      { label: t("ai"), href: "/ai" },
      { label: t("blogs"), href: "/articles" },
      { label: t("aboutMe"), href: "/" },
    ],
    [t]
  )

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-2.5">
      {/* Left: GitHub */}
      <ActionIconButton
        asChild
        aria-label="Open GitHub profile"
        tone={isPixel ? "borderless" : "quiet"}
        size="sm"
      >
        <NextLink href="http://github.com/JieLuis">
          {isPixel ? <PixelGithubIcon className="h-5 w-5" /> : <PiGithubLogoFill size={18} />}
        </NextLink>
      </ActionIconButton>

      {/* Center: Nav links */}
      <ul className="flex flex-1 items-center justify-center gap-1">
        {links.map((link) => (
          <li key={link.href}>
            <NavItem
              asChild
              active={link.href === currentPath}
              variant="desktop"
              className="px-1.5 py-1 text-[9px] tracking-[0.12em]"
            >
              <Link
                className={cn(
                  "block whitespace-nowrap text-center text-muted-foreground transition-colors hover:text-foreground",
                  link.href === currentPath && "text-foreground"
                )}
                href={link.href}
              >
                {link.label}
              </Link>
            </NavItem>
          </li>
        ))}
      </ul>

      {/* Right: Controls */}
      <div className="flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
        <StyleToggle />
      </div>
    </div>
  )
}

export default MobileNav
