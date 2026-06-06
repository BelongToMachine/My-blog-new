import type { ReactNode } from "react"
import { ArrowRight, Volume2 } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import {
  DatabaseDollarIcon,
  HumanAgentIcon,
} from "../projects/PixelProjectIcons"
import SectionHeading from "../system/SectionHeading"
import LiveDistanceCard from "./LiveDistanceCard"

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
        <LiveDistanceCard />

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

function MetaPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-border/60 bg-background/70 px-2.5 py-1 font-pixel text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  )
}
