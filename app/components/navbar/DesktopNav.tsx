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

const DesktopNav = ({ indexMode = false }: { indexMode?: boolean }) => {
  const indexClass = indexMode ? "text-white hover:text-white/80" : undefined

  return (
    <div className="flex h-16 items-center justify-between px-5">
      {/* Left: GitHub + nav links */}
      <div className="flex items-center gap-6">
        <ActionIconButton
          asChild
          aria-label="Open GitHub profile"
          tone="borderless"
          className={indexClass}
        >
          <NextLink href="https://github.com/BelongToMachine">
            <PixelGithubIcon />
          </NextLink>
        </ActionIconButton>
        <div className="hidden lg:block">
          <NavLinks indexMode={indexMode} />
        </div>
        <div className="hidden">
          <NavLinks compact indexMode={indexMode} />
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-3">
        <LanguageToggle className={indexClass} />
        <ThemeToggle className={indexClass} />
      </div>
    </div>
  )
}
export default DesktopNav

const NavLinks = ({ compact = false, indexMode = false }: { compact?: boolean; indexMode?: boolean }) => {
  const t = useTranslations("nav")
  const currentPath = usePathname()

  const links = useMemo(
    () => [
      { label: t("aboutMe"), href: "/about" },
      { label: t("blogs"), href: "/articles" },
      { label: t("ai"), href: "/ai" },
    ],
    [t]
  )

  const styledTag = useMemo(
    () => (link: NavLinkItem) =>
      cn(
        indexMode
          ? "text-sm font-medium text-white/80 hover:text-white"
          : "text-sm font-medium text-muted-foreground hover:text-foreground",
        link.href === currentPath && (indexMode ? "text-white" : "text-foreground")
      ),
    [currentPath, indexMode]
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
