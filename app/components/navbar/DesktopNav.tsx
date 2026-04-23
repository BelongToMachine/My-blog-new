/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import NextLink from "next/link"
import React, { useMemo } from "react"
import { Link, usePathname } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"
import { ActionIconButton } from "../system/ActionIconButton"
import { cn } from "@/lib/utils"
import { NavItem } from "../system/NavItem"
import PixelGithubIcon from "./PixelGithubIcon"

interface NavLinkItem {
  label: string
  href: string
}

const DesktopNav = () => {
  return (
    <div className="flex h-16 items-center justify-between px-5">
      {/* Left: GitHub + nav links */}
      <div className="flex items-center gap-6">
        <ActionIconButton
          asChild
          aria-label="Open GitHub profile"
          tone="borderless"
        >
          <NextLink href="http://github.com/JieLuis">
            <PixelGithubIcon />
          </NextLink>
        </ActionIconButton>
        <div className="hidden lg:block">
          <NavLinks />
        </div>
        <div className="hidden">
          <NavLinks compact />
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  )
}
export default DesktopNav

const NavLinks = ({ compact = false }: { compact?: boolean }) => {
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
        "text-sm font-medium text-muted-foreground hover:text-foreground",
        link.href === currentPath && "text-foreground"
      ),
    [currentPath]
  )

  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-4",
        compact ? "gap-1" : "relative top-1"
      )}
    >
      {links.map((link) => (
        <li key={link.href}>
          <NavItem
            asChild
            active={link.href === currentPath}
            variant="desktop"
            className={cn(
              compact &&
                "px-1.5 py-1 text-[9px] tracking-[0.12em]"
            )}
          >
            <Link className={styledTag(link)} href={link.href}>
              {link.label}
            </Link>
          </NavItem>
        </li>
      ))}
    </ul>
  )
}
