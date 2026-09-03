/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useMemo } from "react"
import { Link, usePathname } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"
import { cn } from "@/lib/utils"
import { NavItem } from "../system/NavItem"
import JieBrand from "./JieBrand"

interface NavLinkItem {
  label: string
  href: string
}

const DesktopNav = () => {
  return (
    <div className="mx-auto flex h-16 w-full max-w-[1300px] items-center justify-between px-5 2xl:px-8">
      {/* Left: brand + nav links */}
      <div className="flex items-center gap-5">
        <JieBrand />
        <div className="hidden md:block">
          <NavLinks />
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

const NavLinks = () => {
  const t = useTranslations("nav")
  const currentPath = usePathname()

  const links = useMemo(
    () => [
      { label: t("aboutMe"), href: "/" },
      { label: t("blogs"), href: "/articles" },
      { label: t("ai"), href: "/ai" },
      { label: t("contact"), href: "/contact" },
    ],
    [t],
  )

  const styledTag = useMemo(
    () => (link: NavLinkItem) =>
      cn(
        "text-muted-foreground hover:text-foreground",
        link.href === currentPath && "text-foreground",
      ),
    [currentPath],
  )

  return (
    <ul className={cn("flex flex-wrap items-center gap-4", "relative top-1")}>
      {links.map((link) => (
        <li key={link.href}>
          <NavItem asChild active={link.href === currentPath} variant="desktop">
            <Link
              className={styledTag(link)}
              href={link.href}
              aria-current={link.href === currentPath ? "page" : undefined}
            >
              {link.label}
            </Link>
          </NavItem>
        </li>
      ))}
    </ul>
  )
}
