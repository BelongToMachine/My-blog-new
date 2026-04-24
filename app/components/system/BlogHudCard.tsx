import * as React from "react"

import { Link } from "@/app/i18n/navigation"
import { cn } from "@/lib/utils"

type HudChipTone = "primary" | "neutral" | "amber"

interface BlogHudCardProps {
  href: string
  title: string
  description: string
  publishedOn: string
  localeLabel: string
  typeLabel: string
  systemOnlineLabel: string
  readLabel: string
  className?: string
}

function HudChip({
  tone,
  children,
}: {
  tone: HudChipTone
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "blog-hud-chip",
        tone === "primary" && "blog-hud-chip--primary",
        tone === "neutral" && "blog-hud-chip--neutral",
        tone === "amber" && "blog-hud-chip--amber"
      )}
    >
      {children}
    </span>
  )
}

function SignalBars() {
  return (
    <div aria-hidden className="blog-hud-bars">
      {Array.from({ length: 7 }).map((_, index) => (
        <span
          key={index}
          className="blog-hud-bars__bar"
          style={{ height: `${0.65 + ((index % 4) + 1) * 0.38}rem` }}
        />
      ))}
    </div>
  )
}

function RadarDecoration() {
  return (
    <div aria-hidden className="blog-hud-radar">
      <span className="blog-hud-radar__ring" />
      <span className="blog-hud-radar__ring blog-hud-radar__ring--middle" />
      <span className="blog-hud-radar__ring blog-hud-radar__ring--outer" />
      <span className="blog-hud-radar__cross blog-hud-radar__cross--horizontal" />
      <span className="blog-hud-radar__cross blog-hud-radar__cross--vertical" />
      <span className="blog-hud-radar__core" />
    </div>
  )
}

export default function BlogHudCard({
  href,
  title,
  description,
  publishedOn,
  localeLabel,
  typeLabel,
  systemOnlineLabel,
  readLabel,
  className,
}: BlogHudCardProps) {
  return (
    <article className={cn("blog-hud-card group w-full min-w-0", className)}>
      <div aria-hidden className="blog-hud-corner blog-hud-corner--top-left" />
      <div aria-hidden className="blog-hud-corner blog-hud-corner--top-right" />
      <div aria-hidden className="blog-hud-corner blog-hud-corner--bottom-right" />

      <div className="relative z-10 flex min-w-0 flex-col gap-5 md:gap-6">
        <div className="flex flex-wrap items-start justify-between gap-3 md:gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <HudChip tone="primary">{typeLabel}</HudChip>
            <HudChip tone="neutral">{localeLabel}</HudChip>
            <HudChip tone="amber">{publishedOn}</HudChip>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="blog-hud-status">
              <span>{systemOnlineLabel}</span>
              <span className="blog-hud-status__dot" />
            </div>
            <SignalBars />
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="min-w-0 xl:pr-32">
            <Link
              className="blog-hud-title block min-w-0 text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href={href}
            >
              {title}
            </Link>

            <div className="blog-hud-copy mt-4 max-w-4xl border-l-2 border-[hsl(var(--signal-rose))]/70 pl-4 text-muted-foreground sm:mt-5 sm:pl-5 xl:max-w-3xl">
              {description}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-28 xl:block">
            <RadarDecoration />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <Link
            className="blog-hud-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href={href}
          >
            <span>{readLabel}</span>
            <span aria-hidden className="blog-hud-cta__arrow">
              →
            </span>
          </Link>

          <div aria-hidden className="hidden items-center gap-3 lg:flex">
            <span className="blog-hud-footer-line" />
            <div className="flex items-center gap-3">
              <span className="blog-hud-footer-dot bg-primary" />
              <span className="blog-hud-footer-dot bg-[hsl(var(--signal-rose))]" />
              <span className="blog-hud-footer-dot bg-[hsl(var(--signal-amber))]" />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
