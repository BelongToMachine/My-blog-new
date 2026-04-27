"use client"

import type { ReactNode } from "react"
import NextLink from "next/link"
import { useTranslations } from "next-intl"
import { Link } from "@/app/i18n/navigation"
import { cn } from "@/lib/utils"
import PixelGithubIcon from "./navbar/PixelGithubIcon"
import Boop from "./system/Boop"

const PixelLinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    shapeRendering="crispEdges"
    className={cn("h-6 w-6", className)}
    fill="currentColor"
  >
    <path d="M22 0H2v24h20V0zM8 20H5V9h3v11zM6.5 7.3c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8zM20 20h-3v-5.6c0-3.4-4-3.1-4 0V20h-3V9h3v1.8c1.4-2.6 7-2.8 7 2.5V20z" />
  </svg>
)

const PixelMailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    shapeRendering="crispEdges"
    className={cn("h-5 w-5", className)}
    fill="currentColor"
  >
    <path d="M23 4H1v16h22V4zm-2 2v.4l-9 5.6-9-5.6V6h18zm0 12H3V9.2l9 5.6 9-5.6V18z" />
  </svg>
)

interface FooterLink {
  label: string
  href: string
}

interface FooterContactLink extends FooterLink {
  detail: string
  icon: ReactNode
}

export default function Footer() {
  const t = useTranslations("footer")
  const navT = useTranslations("nav")

  const navLinks: FooterLink[] = [
    { label: navT("aboutMe"), href: "/" },
    { label: navT("blogs"), href: "/articles" },
    { label: navT("ai"), href: "/ai" },
  ]

  const socialLinks: FooterContactLink[] = [
    {
      label: "GitHub",
      href: "https://github.com/JieLuis",
      detail: "github.com/JieLuis",
      icon: <PixelGithubIcon className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jieliao",
      detail: "linkedin.com/in/jieliao",
      icon: <PixelLinkedInIcon className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
  ]

  return (
    <footer className="relative z-40 border-t-4 border-border bg-background/88 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
        <div className="grid gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(11rem,0.8fr)_minmax(0,1fr)] lg:gap-x-12">
          <div className="space-y-4 border-b-2 border-border/70 pb-8 md:col-span-2 lg:col-span-1 lg:border-b-0 lg:border-r-2 lg:pb-0 lg:pr-10">
            <p className="font-pixel text-lg uppercase tracking-[0.14em] text-foreground sm:text-xl lg:text-2xl">
              {t("identity")}
            </p>
            <p className="max-w-[36rem] text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              {t("tagline")}
            </p>
          </div>

          <div className="space-y-4">
            <p className="font-pixel text-[11px] uppercase tracking-[0.28em] text-primary/80 sm:text-xs">
              {t("navigate")}
            </p>
            <ul className="grid gap-1.5">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "group flex items-center justify-between border-b border-border/60 py-2.5 transition-colors duration-200 hover:border-primary/40"
                    )}
                  >
                    <span className="font-pixel text-sm uppercase tracking-[0.14em] text-foreground transition-colors duration-200 group-hover:text-primary sm:text-[15px]">
                      {link.label}
                    </span>
                    <span className="text-xs tracking-[0.16em] text-muted-foreground transition-colors duration-200 group-hover:text-primary/80 sm:text-sm">
                      0{index + 1}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="font-pixel text-[11px] uppercase tracking-[0.28em] text-primary/80 sm:text-xs">
              {t("connect")}
            </p>
            <div className="grid gap-3">
              {socialLinks.map((link) => (
                <NextLink
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 border-b border-border/60 pb-3 transition-colors duration-200 hover:border-primary/40"
                >
                  <Boop>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-border/80 bg-background/60 text-muted-foreground transition-colors duration-200 group-hover:border-primary/50 group-hover:text-primary">
                      {link.icon}
                    </span>
                  </Boop>
                  <span className="min-w-0">
                    <span className="block font-pixel text-sm uppercase tracking-[0.14em] text-foreground sm:text-[15px]">
                      {link.label}
                    </span>
                    <span className="mt-1 block break-all text-sm text-muted-foreground sm:break-normal sm:text-base">
                      {link.detail}
                    </span>
                  </span>
                </NextLink>
              ))}
              <NextLink
                href="mailto:jie.liao.dev@gmail.com"
                className="group flex items-center gap-3 border-b border-border/60 pb-3 transition-colors duration-200 hover:border-primary/40"
              >
                <Boop>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-border/80 bg-background/60 text-muted-foreground transition-colors duration-200 group-hover:border-primary/50 group-hover:text-primary">
                    <PixelMailIcon className="h-4.5 w-4.5 text-primary/70 sm:h-5 sm:w-5" />
                  </span>
                </Boop>
                <span className="min-w-0">
                  <span className="block font-pixel text-sm uppercase tracking-[0.14em] text-foreground sm:text-[15px]">
                    Email
                  </span>
                  <span className="mt-1 block break-all text-sm text-muted-foreground sm:break-normal sm:text-base">
                    jie.liao.dev@gmail.com
                  </span>
                </span>
              </NextLink>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t-2 border-border/80 pt-4 sm:mt-10 sm:pt-5 lg:mt-12">
          <p className="text-center text-sm tracking-[0.08em] text-muted-foreground sm:text-[15px]">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
