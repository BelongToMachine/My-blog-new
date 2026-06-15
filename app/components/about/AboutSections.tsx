import { Suspense } from "react"
import { Container } from "@radix-ui/themes"
import { cn } from "@/lib/utils"
import { getMdxArticleList } from "@/app/service/mdxArticles"
import Hero from "../Hero"
import ProjectsSection from "../projects/ProjectsSection"
import SummaryHeader from "@/app/SummaryHeader"
import PostSummary from "@/app/PostSummary"
import AboutPinnedHeroShell from "./AboutPinnedHeroShell"
import FunFactsSection from "./FunFactsSection"

interface Props {
  locale: string
  overlapTop?: boolean
  sectionId?: string
  showBackLink?: boolean
  pinHeroUnderDesktop?: boolean
}

export default async function AboutSections({
  locale,
  overlapTop = false,
  sectionId,
  showBackLink = true,
  pinHeroUnderDesktop = false,
}: Props) {
  const content = (
    <section
      id={pinHeroUnderDesktop ? sectionId : undefined}
      className={cn("relative z-40 bg-background", overlapTop && "-mt-[78px]")}
    >
      {pinHeroUnderDesktop ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 block h-10 -translate-y-[calc(100%-2px)] bg-background [clip-path:polygon(0_0,100%_100%,100%_100%,0_100%)] sm:h-12 md:h-16 lg:h-20 xl:h-24"
        />
      ) : null}
      <Container
        className={cn(
          "px-3 pb-16 sm:px-4 md:px-6 md:pb-20 lg:px-8 xl:px-10",
          pinHeroUnderDesktop && "pt-12 sm:pt-14 md:pt-16 lg:pt-16 xl:pt-20",
        )}
      >
        <Suspense fallback={<DeferredHomeSectionsFallback />}>
          <DeferredHomeSections locale={locale} />
        </Suspense>
      </Container>
    </section>
  )

  if (pinHeroUnderDesktop) {
    return (
      <AboutPinnedHeroShell hero={<Hero showBackLink={showBackLink} />}>
        {content}
      </AboutPinnedHeroShell>
    )
  }

  return (
    <section
      id={sectionId}
      className={cn("relative z-40 bg-background", overlapTop && "-mt-[78px]")}
    >
      <div className="home-about-bridge">
        <Container className="pb-14 md:pb-20">
          <Hero showBackLink={showBackLink} />
        </Container>
      </div>
      {content}
    </section>
  )
}

async function DeferredHomeSections({ locale }: { locale: string }) {
  const articles = await getMdxArticleList(locale)

  const webDevCount = articles.filter(
    (article) => article.category === "webDev",
  ).length
  const aiCount = articles.filter((article) => article.category === "ai").length
  const nonTechCount = articles.filter(
    (article) => article.category === "nonTech",
  ).length

  return (
    <>
      <FunFactsSection />
      <ProjectsSection />
      <SummaryHeader />
      <PostSummary
        total={articles.length}
        webDev={webDevCount}
        ai={aiCount}
        nonTech={nonTechCount}
      />
    </>
  )
}

function DeferredHomeSectionsFallback() {
  return (
    <div className="space-y-8 md:space-y-10">
      <section className="mb-10 space-y-6 md:mb-14 md:space-y-7">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="terminal-label">FUN FACT FILE</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>
          <div className="h-10 w-56 animate-pulse bg-muted/70 md:h-12 md:w-72" />
        </div>
        <div className="grid gap-5 md:grid-cols-12 md:items-start">
          <div className="h-[25rem] animate-pulse bg-muted/60 md:col-span-8" />
          <div className="grid gap-5 md:col-span-4">
            <div className="h-56 animate-pulse bg-muted/60" />
            <div className="h-56 animate-pulse bg-muted/60" />
          </div>
        </div>
      </section>
      <div className="h-[28rem] animate-pulse bg-muted/55" />
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse bg-muted/70" />
        <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="h-80 animate-pulse bg-muted/60" />
          <div className="h-80 animate-pulse bg-muted/60" />
        </div>
      </div>
    </div>
  )
}
