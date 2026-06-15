import type { ReactNode } from "react"
import dynamic from "next/dynamic"
import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import {
  DatabaseDollarIcon,
  HumanAgentIcon,
} from "../projects/PixelProjectIcons"
import ArticleFooter from "@/app/articles/_components/ArticleFooter"
import WaveFlagCard from "./WaveFlagCard"

const sharedCardShell =
  "pixel-panel overflow-hidden border border-border/80 bg-card/88 transition-colors duration-200 hover:border-primary/50"
const metaTextClassName =
  "text-[11px] font-medium leading-none tracking-[0.04em] text-muted-foreground"
const accentLabelClassName =
  "text-xs font-medium tracking-[0.04em] text-primary/80"

const LiveDistanceCard = dynamic(() => import("./LiveDistanceCard"), {
  ssr: false,
  loading: () => <LiveDistanceCardFallback />,
})

const PronunciationCard = dynamic(() => import("./PronunciationCard"), {
  ssr: false,
  loading: () => <PronunciationCardFallback className={sharedCardShell} />,
})

interface ContributionCardConfig {
  key: "financial" | "uxAgent"
  index: string
  accentClassName: string
  icon: ReactNode
  layoutClassName: string
}

const contributionCards: ContributionCardConfig[] = [
  {
    key: "financial",
    index: "01",
    accentClassName: "text-primary",
    layoutClassName: "md:col-span-6 xl:col-span-7",
    icon: (
      <DatabaseDollarIcon className="h-12 w-12 text-primary md:h-14 md:w-14" />
    ),
  },
  {
    key: "uxAgent",
    index: "02",
    accentClassName: "text-[hsl(var(--signal-amber))]",
    layoutClassName: "md:col-span-6 xl:col-span-5",
    icon: (
      <HumanAgentIcon className="h-12 w-12 text-[hsl(var(--signal-amber))] md:h-14 md:w-14" />
    ),
  },
]

export default async function FunFactsSection() {
  const t = await getTranslations("funFacts")
  const projectT = await getTranslations("projects")
  const description = t("description")

  return (
    <section className="mb-10 space-y-6 md:mb-14 md:space-y-7">
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-3">
          <span className="terminal-label">FUN FACT FILE</span>
          <div className="h-px flex-1 bg-border/60" />
        </div>
        <h2 className="max-w-4xl text-balance text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground">
          {t("heading")}
        </h2>
        {description ? (
          <p className="max-w-2xl text-pretty text-sm leading-7 text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-12 md:items-start">
        <div className="md:col-span-8">
          <LiveDistanceCard />
        </div>

        <div className="grid content-start gap-5 md:col-span-4">
          <PronunciationCard className={sharedCardShell} />

          <WaveFlagCard className={sharedCardShell} />
        </div>

        <article
          className={cn(
            sharedCardShell,
            "px-3 sm:px-4 md:col-span-10 md:px-5 lg:col-span-8 xl:col-span-7",
          )}
        >
          <ArticleFooter fullWidth compact showHeader={false} />
        </article>

        <div className="grid gap-5 md:col-span-12 md:grid-cols-12">
          {contributionCards.map((card) => (
            <ContributionCard
              key={card.key}
              index={card.index}
              accentClassName={card.accentClassName}
              icon={card.icon}
              layoutClassName={card.layoutClassName}
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
  layoutClassName,
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
  layoutClassName: string
  kicker: string
  summary: string
  title: string
}) {
  return (
    <article
      className={cn(
        sharedCardShell,
        layoutClassName,
        "flex h-full flex-col p-5 md:p-6 lg:p-7",
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-3">
          <MetaPill>{index}</MetaPill>
          <p
            className={cn(
              "text-sm font-medium tracking-[0.01em]",
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
        <p className="mt-3 text-pretty text-sm leading-6 text-foreground/80 md:text-[15px] md:leading-7">
          {summary}
        </p>
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <p className={accentLabelClassName}>{highlightsLabel}</p>
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

      <div className="mt-auto border-t border-border/60 pt-4">
        <a
          href="#projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/75"
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
    <span
      className={cn(
        "inline-flex w-fit items-center border border-border/60 bg-background/70 px-2.5 py-1",
        metaTextClassName,
      )}
    >
      {children}
    </span>
  )
}

function LiveDistanceCardFallback() {
  return (
    <article className={cn(sharedCardShell, "grid h-full gap-0 p-0")}>
      <div className="f··lex items-center justify-between gap-3 border-b border-border/60 bg-[linear-gradient(180deg,hsl(var(--accent))/0.34,transparent)] px-5 py-3 sm:px-6">
        <span className="terminal-label">LIVE DISTANCE</span>
        <span className="inline-flex items-center border border-border/70 bg-background/76 px-2.5 py-1 font-pixel text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          loading
        </span>
      </div>
      <div className="border-b border-border/60 bg-[linear-gradient(180deg,hsl(var(--accent))/0.44,transparent)] p-3 sm:p-4 md:p-5">
        <div className="h-[13.5rem] animate-pulse border-2 border-border/60 bg-muted/60 sm:h-[15rem] md:h-[16rem]" />
      </div>
      <div className="grid gap-5 p-5 sm:p-6 md:p-6">
        <div className="space-y-3">
          <div className="h-5 w-full max-w-[36rem] animate-pulse bg-muted/60" />
          <div className="h-5 w-3/4 animate-pulse bg-muted/55" />
        </div>
      </div>
    </article>
  )
}

function PronunciationCardFallback({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        className,
        "flex flex-col items-center gap-5 p-4 text-center md:p-4 lg:p-5",
      )}
    >
      <div className="grid w-full grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-start gap-3">
        <div aria-hidden className="h-11 w-11" />
        <div className="mx-auto h-12 w-28 animate-pulse bg-muted/60" />
        <div className="h-11 w-11 animate-pulse border border-border/60 bg-background/72" />
      </div>
      <div className="h-14 w-full max-w-[16ch] animate-pulse bg-muted/55" />
      <div className="h-10 w-full max-w-[13ch] animate-pulse bg-muted/50" />
    </article>
  )
}
