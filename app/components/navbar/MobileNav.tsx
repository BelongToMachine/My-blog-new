"use client"
import { LuMoveVertical } from "react-icons/lu"
import React from "react"
import { PiGithubLogoFill } from "react-icons/pi"
import NextLink from "next/link"
import { Button, DropdownMenu } from "@radix-ui/themes"
import { FaBook } from "react-icons/fa6"
import { FaLinkedin } from "react-icons/fa"
import { useTranslations } from "next-intl"
import { Link } from "@/app/i18n/navigation"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"

const MobileNav = () => {
  return (
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <NextLink
        href="http://github.com/JieLuis"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/70 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
      >
        <PiGithubLogoFill />
      </NextLink>
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
  const mobileLinks = [
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
        <Button
          variant="soft"
          size="2"
          className="rounded-full border border-border/70 bg-background/75 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
        >
          <LuMoveVertical />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="1" className="min-w-[12rem]">
        {mobileLinks.map((link, index) => {
          return (
            <div key={index}>
              <DropdownMenu.Item className="flex justify-between">
                <Link key={link.href} href={link.href} className="pr-3">
                  {link.label}
                </Link>
                <Icon type={link.type} />
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

const Icon = ({ type }: { type: "blogs" | "linkedin" }) => {
  switch (type) {
    case "blogs":
      return <FaBook />
    case "linkedin":
      return <FaLinkedin />
  }
}
