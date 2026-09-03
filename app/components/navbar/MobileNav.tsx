"use client"
import React, { useEffect, useMemo, useState } from "react"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"
import { ActionIconButton } from "../system/ActionIconButton"
import PixelMenuIcon from "../system/PixelMenuIcon"
import { Link, usePathname } from "@/app/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import { NavItem } from "../system/NavItem"
import { cn } from "@/lib/utils"
import JieBrand from "./JieBrand"

const MobileNav = () => {
  const t = useTranslations("nav")
  const currentPath = usePathname()
  const locale = useLocale()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const links = useMemo(
    () => [
      { label: t("aboutMe"), href: "/" },
      { label: t("blogs"), href: "/articles" },
      { label: t("ai"), href: "/ai" },
      { label: t("contact"), href: "/contact" },
    ],
    [t]
  )

  useEffect(() => {
    setIsMenuOpen(false)
  }, [currentPath])

  return (
    <div className="relative px-4 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <JieBrand />

        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <ActionIconButton
            aria-label={
              isMenuOpen
                ? locale === "zh"
                  ? "关闭导航菜单"
                  : "Close navigation menu"
                : locale === "zh"
                  ? "打开导航菜单"
                  : "Open navigation menu"
            }
            aria-controls="mobile-site-navigation"
            aria-expanded={isMenuOpen}
            className={cn(
              "shadow-none",
              isMenuOpen &&
                "!border-[#fcc31e] !bg-[#fcc31e]/10 !text-foreground",
            )}
            onClick={() => setIsMenuOpen((open) => !open)}
            size="sm"
            tone="nav"
            type="button"
          >
            <PixelMenuIcon isOpen={isMenuOpen} />
          </ActionIconButton>
        </div>
      </div>

      <aside
        id="mobile-site-navigation"
        className={cn(
          "fixed bottom-0 right-0 top-[var(--app-nav-offset)] z-30 w-[min(280px,85vw)] border-l-2 border-border/60 bg-background/95 px-4 py-4 backdrop-blur-sm transition-[transform,opacity] duration-200 ease-out",
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0",
        )}
      >
        <ul className="m-0 grid list-none gap-2 p-0">
          {links.map((link) => (
            <li key={link.href} className="mb-0">
              <NavItem
                asChild
                active={link.href === currentPath}
                variant="dropdown"
                className="w-full"
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={link.href === currentPath ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </NavItem>
            </li>
          ))}
        </ul>
      </aside>

      <div
        className={cn(
          "fixed inset-0 top-[var(--app-nav-offset)] z-20 bg-background/80 backdrop-blur-sm transition-opacity duration-200",
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />
    </div>
  )
}

export default MobileNav
