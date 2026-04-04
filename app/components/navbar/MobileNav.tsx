"use client"
import { LuMoveVertical } from "react-icons/lu"
import React from "react"
import { PiGithubLogoFill } from "react-icons/pi"
import NextLink from "next/link"
import { DropdownMenu } from "@radix-ui/themes"
import { FaBook } from "react-icons/fa6"
import { FaLinkedin } from "react-icons/fa"
import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/app/i18n/navigation"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"
import { ActionIconButton } from "../system/ActionIconButton"
import { NavItem } from "../system/NavItem"

const MobileNav = () => {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <ActionIconButton asChild aria-label="Open GitHub profile" tone="quiet">
        <NextLink href="http://github.com/JieLuis">
          <PiGithubLogoFill size={20} />
        </NextLink>
      </ActionIconButton>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Menu />
      </div>
    </div>
  )
}

export default MobileNav

const Menu = () => {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const mobileLinks = [
    { label: t("ai"), href: "/ai", type: "ai" as const },
    { label: t("myBlog"), href: "/blogs", type: "blogs" as const },
    {
      label: t("linkedin"),
      href: "https://www.linkedin.com/in/jie-liao-070162296/",
      type: "linkedin" as const,
    },
  ]

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <ActionIconButton aria-label="Open navigation menu" tone="surface">
          <LuMoveVertical />
        </ActionIconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="1">
        {mobileLinks.map((link, index) => {
          const isActive = pathname === link.href

          return (
            <div key={index}>
              <DropdownMenu.Item asChild>
                <NavItem asChild active={isActive} variant="dropdown">
                  <Link key={link.href} href={link.href}>
                    <span className="pr-3">{link.label}</span>
                    <Icon type={link.type} />
                  </Link>
                </NavItem>
              </DropdownMenu.Item>
            </div>
          )
        })}
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <LanguageToggle />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

const Icon = ({ type }: { type: "ai" | "blogs" | "linkedin" }) => {
  switch (type) {
    case "ai":
      return <span className="text-xs font-bold">AI</span>
    case "blogs":
      return <FaBook />
    case "linkedin":
      return <FaLinkedin />
  }
}
