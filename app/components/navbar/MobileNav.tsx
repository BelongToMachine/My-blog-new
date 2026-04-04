"use client"

import React from "react"
import NextLink from "next/link"
import { FaBook, FaLinkedin } from "react-icons/fa6"
import { LuMoveVertical } from "react-icons/lu"
import { PiGithubLogoFill } from "react-icons/pi"
import { DropdownMenu } from "@radix-ui/themes"
import { useTranslations } from "next-intl"

import { ActionIconButton } from "@/app/components/system"
import { Link } from "@/app/i18n/navigation"

import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"

const MobileNav = () => {
  return (
    <div className="flex h-16 items-center justify-between gap-4">
      <NextLink
        href="https://github.com/JieLuis"
        className="nav-control nav-control-icon"
        aria-label="Open GitHub profile"
        target="_blank"
        rel="noreferrer"
      >
        <PiGithubLogoFill className="h-[18px] w-[18px]" />
      </NextLink>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Menu />
      </div>
    </div>
  )
}

const Menu = () => {
  const t = useTranslations("nav")
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
      <DropdownMenu.Trigger>
        <button
          type="button"
          className="nav-control nav-control-icon"
          aria-label="Open navigation menu"
        >
          <LuMoveVertical className="h-[18px] w-[18px]" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        size="1"
        className="min-w-[220px] rounded-2xl border border-border/80 bg-card/95 p-2 text-card-foreground shadow-[0_20px_48px_-32px_rgba(15,23,42,0.36)] backdrop-blur-xl"
      >
        {mobileLinks.map((link) => (
          <DropdownMenu.Item
            key={link.href}
            className="rounded-xl px-0 py-0 focus:bg-accent"
          >
            {"href" in link && link.href.startsWith("http") ? (
              <a
                href={link.href}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-foreground"
                target="_blank"
                rel="noreferrer"
              >
                <span>{link.label}</span>
                <Icon type={link.type} />
              </a>
            ) : (
              <Link
                href={link.href}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-foreground"
              >
                <span>{link.label}</span>
                <Icon type={link.type} />
              </Link>
            )}
          </DropdownMenu.Item>
        ))}
        <DropdownMenu.Separator className="my-2 h-px bg-border/70" />
        <div className="px-1 py-1">
          <LanguageToggle />
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

const Icon = ({ type }: { type: "ai" | "blogs" | "linkedin" }) => {
  switch (type) {
    case "ai":
      return (
        <ActionIconButton
          type="button"
          size="sm"
          active
          className="pointer-events-none h-7 w-7 text-[10px] font-bold"
        >
          AI
        </ActionIconButton>
      )
    case "blogs":
      return <FaBook className="h-4 w-4 text-muted-foreground" />
    case "linkedin":
      return <FaLinkedin className="h-4 w-4 text-muted-foreground" />
  }
}

export default MobileNav
