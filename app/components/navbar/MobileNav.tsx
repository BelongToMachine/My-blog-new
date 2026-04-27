"use client"
import React, { useMemo } from "react"
import NextLink from "next/link"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"
import { ActionIconButton } from "../system/ActionIconButton"
import PixelGithubIcon from "./PixelGithubIcon"
import Boop from "../system/Boop"
import { Link, usePathname } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"
import { NavItem } from "../system/NavItem"
import { cn } from "@/lib/utils"

const MobileNav = () => {
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
      {/* Left: GitHub + nav links */}
      <div className="flex items-center gap-3">
        <Boop>
          <ActionIconButton
            asChild
            aria-label="Open GitHub profile"
            className="shrink-0 self-center"
            tone="borderless"
            size="sm"
          >
            <NextLink href="http://github.com/JieLuis">
              <PixelGithubIcon className="h-5 w-5" />
            </NextLink>
          </ActionIconButton>
        </Boop>
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
                    "whitespace-nowrap text-muted-foreground hover:text-foreground",
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
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  )
}

export default MobileNav
