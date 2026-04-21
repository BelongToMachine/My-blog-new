/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import NextLink from "next/link"
import React, { useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import DisappearingText from "../DisappearText"
import { Link, usePathname } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"
import StyleToggle from "./StyleToggle"
import { PiGithubLogoFill } from "react-icons/pi"
import { useStyleModeStore } from "@/app/service/Store"
import { ActionIconButton } from "../system/ActionIconButton"
import { cn } from "@/lib/utils"
import { NavItem } from "../system/NavItem"
import PixelGithubIcon from "./PixelGithubIcon"

interface NavLinkItem {
  label: string
  href: string
}

const DesktopNav = () => {
  const { styleMode } = useStyleModeStore()
  const isPixel = styleMode === "pixel"

  return (
    <div className="flex h-16 items-center justify-between px-5">
      <div className="flex items-center gap-6">
        <ActionIconButton
          asChild
          aria-label="Open GitHub profile"
          tone={isPixel ? "borderless" : "quiet"}
        >
          <NextLink href="http://github.com/JieLuis">
            {isPixel ? <PixelGithubIcon /> : <PiGithubLogoFill size={20} />}
          </NextLink>
        </ActionIconButton>
        <NavLinks />
      </div>
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
        <StyleToggle />
      </div>
    </div>
  )
}
export default DesktopNav

const NavLinks = () => {
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

  const styledTag = useMemo(
    () => (link: NavLinkItem) =>
      cn(
        "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        link.href === currentPath && "text-foreground"
      ),
    [currentPath]
  )

  const variants = {
    initial: { opacity: 0 },
    animate: (custom: { index: number }) => ({
      opacity: 1,
      transition: { duration: 0.5, delay: custom.index * 0.05 },
    }),
    exit: (custom: { index: number; textLength: number }) => ({
      opacity: 0,
      transition: {
        duration: 0.15,
        delay: (custom.textLength - custom.index - 1) * 0.05,
      },
    }),
  }

  return (
    <ul className="relative top-1 flex flex-wrap gap-4">
      <AnimatePresence>
        {links.map((link, index) => (
          <li key={link.href}>
            <NavItem asChild active={link.href === currentPath} variant="desktop">
              <Link className={styledTag(link)} href={link.href}>
                <DisappearingText text={link.label} variant={variants} />
              </Link>
            </NavItem>
          </li>
        ))}
      </AnimatePresence>
    </ul>
  )
}
