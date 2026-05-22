"use client"
import React, { useMemo } from "react"
import NextLink from "next/link"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"
import { ActionIconButton } from "../system/ActionIconButton"
import PixelGithubIcon from "./PixelGithubIcon"
import { Link, usePathname } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"
import { NavItem } from "../system/NavItem"
import { cn } from "@/lib/utils"

const MobileNav = ({ indexMode = false }: { indexMode?: boolean }) => {
  const t = useTranslations("nav")
  const currentPath = usePathname()
  const links = useMemo(
    () => [
      { label: t("aboutMe"), href: "/about" },
      { label: t("blogs"), href: "/articles" },
      { label: t("ai"), href: "/ai" },
      { label: t("contact"), href: "/contact" },
    ],
    [t]
  )

  const indexClass = indexMode ? "text-white hover:text-white/80" : undefined

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-2.5">
      {/* Left: GitHub + nav links */}
      <div className="flex items-center gap-3">
        <ActionIconButton
          asChild
          aria-label="Open GitHub profile"
          className={cn("shrink-0 self-center", indexClass)}
          tone="borderless"
          size="sm"
        >
          <NextLink href="https://github.com/BelongToMachine">
            <PixelGithubIcon className="h-5 w-5" />
          </NextLink>
        </ActionIconButton>
        <ul className="m-0 flex h-8 list-none items-center gap-1 p-0">
          {links.map((link) => (
            <li key={link.href} className="mb-0 flex items-center">
              <NavItem
                asChild
                active={link.href === currentPath}
                variant="desktop"
                className="flex h-8 items-center px-1.5 py-0 text-[9px] leading-none tracking-[0.12em]"
              >
                <Link
                  className={cn(
                    "whitespace-nowrap",
                    indexMode
                      ? "text-white/80 hover:text-white"
                      : "text-muted-foreground hover:text-foreground",
                    link.href === currentPath && (indexMode ? "text-white" : "text-foreground")
                  )}
                  href={link.href}
                >
                  {link.label}
                </Link>
              </NavItem>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1">
        <LanguageToggle className={indexClass} />
        <ThemeToggle className={indexClass} />
      </div>
    </div>
  )
}

export default MobileNav
