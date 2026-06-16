import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import ArticleFooter from "@/app/articles/_components/ArticleFooter"
import WaveFlagCard from "./WaveFlagCard"

const sharedCardShell =
  "pixel-panel overflow-hidden border border-border/60 bg-card/88 transition-colors duration-200 hover:border-primary/40"

const LiveDistanceCard = dynamic(() => import("./LiveDistanceCard"), {
  ssr: false,
  loading: () => <LiveDistanceCardFallback />,
})

const PronunciationCard = dynamic(() => import("./PronunciationCard"), {
  ssr: false,
  loading: () => <PronunciationCardFallback className={sharedCardShell} />,
})

export default async function FunFactsSection() {
  return (
    <section className="mb-8 md:mb-10">
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
      </div>
    </section>
  )
}

function LiveDistanceCardFallback() {
  return (
    <article className={cn(sharedCardShell, "grid h-full gap-0 p-0")}>
      <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-[linear-gradient(180deg,hsl(var(--accent))/0.34,transparent)] px-5 py-3 sm:px-6">
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