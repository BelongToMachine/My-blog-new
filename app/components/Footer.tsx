"use client"

import NextLink from "next/link"
import { useTranslations } from "next-intl"
import { Link } from "@/app/i18n/navigation"
import { cn } from "@/lib/utils"
import { ActionIconButton } from "./system/ActionIconButton"
import PixelGithubIcon from "./navbar/PixelGithubIcon"

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
    className={cn("h-6 w-6", className)}
    fill="currentColor"
  >
    <path d="M23 4H1v16h22V4zm-2 2v.4l-9 5.6-9-5.6V6h18zm0 12H3V9.2l9 5.6 9-5.6V18z" />
  </svg>
)

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

export default function Footer() {
  const t = useTranslations("footer")
  const navT = useTranslations("nav")

  const navLinks: FooterLink[] = [
    { label: navT("aboutMe"), href: "/" },
    { label: navT("blogs"), href: "/articles" },
    { label: navT("ai"), href: "/ai" },
  ]

  const socialLinks: FooterLink[] = [
    {
      label: "GitHub",
      href: "https://github.com/JieLuis",
      external: true,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jieliao",
      external: true,
    },
  ]

  return (
    <footer className="border-t-4 border-border bg-background/80 backdrop-blur-sm">
      <div className="pixel-divider mx-auto max-w-6xl" />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Identity */}
          <div className="space-y-3">
            <p
              className={cn(
                "font-pixel text-sm uppercase tracking-[0.22em] text-foreground"
              )}
            >
              {t("identity")}
            </p>
            <p className="font-pixel text-[11px] leading-relaxed tracking-[0.12em] text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          {/* Navigate */}
          <div className="space-y-3">
            <p
              className={cn(
                "font-pixel text-[10px] uppercase tracking-[0.28em] text-primary/80"
              )}
            >
              {t("navigate")}
            </p>
            <ul className="space-y-1.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "inline-block px-2 py-1 -mx-2 font-pixel text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-200 hover:text-primary border-2 border-transparent hover:border-primary/30 hover:bg-primary/5"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <p
              className={cn(
                "font-pixel text-[10px] uppercase tracking-[0.28em] text-primary/80"
              )}
            >
              {t("connect")}
            </p>
            <div className="flex items-center gap-1.5 -ml-1.5">
              {socialLinks.map((link) => (
                <ActionIconButton
                  key={link.href}
                  asChild
                  aria-label={link.label}
                  tone="borderless"
                  size="default"
                >
                  <NextLink
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label === "GitHub" ? (
                      <PixelGithubIcon />
                    ) : (
                      <PixelLinkedInIcon />
                    )}
                  </NextLink>
                </ActionIconButton>
              ))}
            </div>

            <p className="flex items-center gap-1.5 pt-2 font-pixel text-[10px] tracking-[0.12em] text-muted-foreground">
              <PixelMailIcon className="h-4 w-4 shrink-0 text-primary/60" />
              <span>jie.liao.dev@gmail.com</span>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t-2 border-border pt-6">
          <p className="font-pixel text-[9px] uppercase tracking-[0.32em] text-muted-foreground/60 text-center">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
