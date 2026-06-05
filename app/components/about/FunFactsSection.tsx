import type { ReactNode } from "react"
import { ArrowRight, Volume2 } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import {
  DatabaseDollarIcon,
  HumanAgentIcon,
} from "../projects/PixelProjectIcons"
import SectionHeading from "../system/SectionHeading"

const sharedCardShell =
  "pixel-panel overflow-hidden border border-border/80 bg-card/88 transition-colors duration-200 hover:border-primary/50"

interface ContributionCardConfig {
  key: "financial" | "uxAgent"
  index: string
  accentClassName: string
  icon: ReactNode
}

const contributionCards: ContributionCardConfig[] = [
  {
    key: "financial",
    index: "01",
    accentClassName: "text-primary",
    icon: (
      <DatabaseDollarIcon className="h-12 w-12 text-primary md:h-14 md:w-14" />
    ),
  },
  {
    key: "uxAgent",
    index: "02",
    accentClassName: "text-[hsl(var(--signal-amber))]",
    icon: (
      <HumanAgentIcon className="h-12 w-12 text-[hsl(var(--signal-amber))] md:h-14 md:w-14" />
    ),
  },
]

export default async function FunFactsSection() {
  const t = await getTranslations("funFacts")
  const projectT = await getTranslations("projects")

  return (
    <section className="mb-10 space-y-5 md:mb-14 md:space-y-6">
      <div>
        <SectionHeading
          title={t("heading")}
          description={t("description")}
          align="left"
          className="mb-0"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <article className={cn(sharedCardShell, "p-0")}>
          <div className="border-b border-border/60 bg-[linear-gradient(180deg,hsl(var(--accent))/0.44,transparent)] p-4 sm:p-5">
            <div className="overflow-hidden border-2 border-border/60 bg-[linear-gradient(180deg,#cfe6f2_0%,#d9ecf6_100%)]">
              <MockDistanceMap />
            </div>
          </div>

          <div className="grid gap-5 p-6 md:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <MetaPill>{t("map.eyebrow")}</MetaPill>
              <MetaPill>{t("map.route")}</MetaPill>
            </div>

            <div className="space-y-3">
              <h3 className="font-editorial max-w-[18ch] text-[clamp(1.65rem,2.3vw,2.35rem)] leading-[1.04] tracking-[-0.03em] text-foreground">
                {t("map.title")}
              </h3>
              <p className="max-w-[60ch] text-pretty text-[15px] leading-7 text-foreground/82 md:text-base md:leading-8">
                {t("map.body")}
              </p>
            </div>

            <div className="grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-3">
              <FactStat label={t("map.fromLabel")} value={t("map.fromValue")} />
              <FactStat label={t("map.toLabel")} value={t("map.toValue")} />
              <FactStat
                label={t("map.distanceLabel")}
                value={t("map.distanceValue")}
                valueClassName="text-primary"
              />
            </div>
          </div>
        </article>

        <article
          className={cn(
            sharedCardShell,
            "flex flex-col justify-between gap-6 p-6 md:p-7",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <MetaPill>{t("pronunciation.eyebrow")}</MetaPill>
            <div aria-hidden className="flex items-end gap-1 text-primary/70">
              <span className="h-3 w-1.5 bg-current" />
              <span className="h-5 w-1.5 bg-current" />
              <span className="h-7 w-1.5 bg-current" />
              <span className="h-4 w-1.5 bg-current" />
              <span className="h-6 w-1.5 bg-current" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-editorial text-[clamp(2rem,4vw,3.35rem)] leading-none tracking-[-0.05em] text-foreground">
                {t("pronunciation.name")}
              </p>
              <div className="inline-flex items-center gap-3 border border-border/60 bg-background/72 px-4 py-2">
                <span className="font-pixel text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t("pronunciation.phoneticLabel")}
                </span>
                <span className="font-editorial text-xl italic tracking-[-0.03em] text-primary">
                  {t("pronunciation.phonetic")}
                </span>
              </div>
            </div>

            <p className="text-pretty text-[15px] leading-7 text-foreground/82 md:text-base md:leading-8">
              {t("pronunciation.body")}
            </p>
          </div>

          <div className="grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="border border-border/60 bg-background/68 px-4 py-3">
              <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("pronunciation.breakdownLabel")}
              </p>
              <p className="mt-2 text-sm leading-7 text-foreground/82">
                {t("pronunciation.breakdownValue")}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 border border-border/60 bg-background/68 px-4 py-3">
              <span className="font-pixel text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("pronunciation.audioLabel")}
              </span>
              <Volume2 className="h-4 w-4 text-primary" />
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {contributionCards.map((card) => (
          <ContributionCard
            key={card.key}
            index={card.index}
            accentClassName={card.accentClassName}
            icon={card.icon}
            kicker={t(`stateStreet.cards.${card.key}.kicker`)}
            summary={t(`stateStreet.cards.${card.key}.summary`)}
            title={projectT(`${card.key}.title`)}
            highlights={[
              projectT(`${card.key}.highlight1`),
              projectT(`${card.key}.highlight2`),
            ]}
            highlightsLabel={t("stateStreet.highlightsLabel")}
            ctaLabel={t("stateStreet.cta")}
          />
        ))}
      </div>
    </section>
  )
}

function ContributionCard({
  accentClassName,
  ctaLabel,
  highlights,
  highlightsLabel,
  icon,
  index,
  kicker,
  summary,
  title,
}: {
  accentClassName: string
  ctaLabel: string
  highlights: string[]
  highlightsLabel: string
  icon: ReactNode
  index: string
  kicker: string
  summary: string
  title: string
}) {
  return (
    <article className={cn(sharedCardShell, "p-6 md:p-7")}>
      <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <MetaPill>State Street</MetaPill>
            <MetaPill>{index}</MetaPill>
          </div>
          <p
            className={cn(
              "font-pixel text-[10px] uppercase tracking-[0.22em]",
              accentClassName,
            )}
          >
            {kicker}
          </p>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-border/70 bg-background/78">
          {icon}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="font-editorial max-w-[16ch] text-[clamp(1.4rem,2vw,2rem)] leading-[1.06] tracking-[-0.03em] text-foreground">
          {title}
        </h3>
        <p className="mt-3 text-pretty text-[15px] leading-7 text-foreground/80">
          {summary}
        </p>
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <p className="font-pixel text-[10px] uppercase tracking-[0.22em] text-primary/80">
          {highlightsLabel}
        </p>
        <div className="mt-3 space-y-3">
          {highlights.map((highlight) => (
            <div key={highlight} className="flex items-start gap-3">
              <span className="mt-2 block h-1.5 w-1.5 shrink-0 bg-primary/70" />
              <span className="text-sm leading-7 text-foreground/82">
                {highlight}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <a
          href="#projects"
          className="inline-flex items-center gap-2 font-pixel text-[10px] uppercase tracking-[0.22em] text-primary transition-colors hover:text-primary/75"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  )
}

function FactStat({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="border border-border/60 bg-background/68 px-4 py-3">
      <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-sm leading-7 text-foreground/84",
          valueClassName,
        )}
      >
        {value}
      </p>
    </div>
  )
}

function MetaPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-border/60 bg-background/70 px-2.5 py-1 font-pixel text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  )
}

function MockDistanceMap() {
  return (
    <svg
      viewBox="0 0 800 420"
      role="img"
      aria-label="Mock map connecting a visitor in San Francisco to Hangzhou, China"
      className="h-full w-full"
    >
      <rect width="800" height="420" fill="#cfe6f2" />

      <g fill="#f6fbff">
        <path d="M44 78c36-19 97-27 152-17l25 10 31-10 47 15 13 29-17 16-34 6-27 21-58 7-28-20-31 11-29-21-15-4-11-18 8-16z" />
        <path d="M170 183l22 18 11 37-18 54-20 53-18-8-6-30 9-50 3-35 17-39z" />
        <path d="M332 95l32-16 34 4 17 17 13-2 15 10-5 17 22 14 29-6 15 21-17 8-30 2-16 17-33 3-12 30 9 46-22 42-48-7-30-51 5-48 17-25-6-26 11-25z" />
        <path d="M520 92l31-13 83 3 45 20 23-5 40 15-11 21 13 20-18 19-43 8-29 20-41 0-21 17-42 5-35-14-18-29 8-30 21-19-4-22 18-16z" />
        <path d="M660 275l33 2 24 14-6 20-29 8-35-8-8-18 21-18z" />
      </g>

      <path
        d="M120 156C245 177 416 196 627 190"
        fill="none"
        stroke="#4d55e2"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="6 15"
      />

      <g>
        <circle cx="120" cy="156" r="17" fill="#f7b500" opacity="0.18" />
        <circle cx="120" cy="156" r="8" fill="#f7b500" />
        <circle cx="627" cy="190" r="17" fill="#00a7d1" opacity="0.18" />
        <circle cx="627" cy="190" r="8" fill="#00a7d1" />
      </g>
    </svg>
  )
}
