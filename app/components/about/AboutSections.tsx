import { Suspense } from "react"
import { Container } from "@radix-ui/themes"
import { cn } from "@/lib/utils"
import Hero from "../Hero"
import ProjectsSection from "../projects/ProjectsSection"
import SummaryHeader from "@/app/SummaryHeader"
import PostSummary from "@/app/PostSummary"
import AboutPinnedHeroShell from "./AboutPinnedHeroShell"
import FunFactsSection from "./FunFactsSection"

const BLOG_SUMMARY_COUNTS = {
  total: 6,
  webDev: 1,
  ai: 5,
  nonTech: 0,
} as const

interface Props {
  locale: string
  overlapTop?: boolean
  sectionId?: string
  showBackLink?: boolean
  pinHeroUnderDesktop?: boolean
  roundedButtons?: boolean
}

export default async function AboutSections({
  locale,
  overlapTop = false,
  sectionId,
  showBackLink = true,
  pinHeroUnderDesktop = false,
  roundedButtons = false,
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
          <DeferredHomeSections roundedButtons={roundedButtons} />
        </Suspense>
      </Container>
    </section>
  )

  if (pinHeroUnderDesktop) {
    return (
      <AboutPinnedHeroShell
        hero={<Hero showBackLink={showBackLink} roundedButtons={roundedButtons} />}
      >
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
          <Hero showBackLink={showBackLink} roundedButtons={roundedButtons} />
        </Container>
      </div>
      {content}
    </section>
  )
}

async function DeferredHomeSections({
  roundedButtons,
}: {
  roundedButtons: boolean
}) {
  return (
    <>
      <FunFactsSection roundedButtons={roundedButtons} />
      <ProjectsSection />
      <section className="pt-8 md:pt-12 lg:pt-14">
        <SummaryHeader />
        <PostSummary {...BLOG_SUMMARY_COUNTS} />
      </section>
    </>
  )
}

function DeferredHomeSectionsFallback() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid gap-5 md:grid-cols-12 md:items-start">
        <div className="h-[25rem] animate-pulse rounded-[2px] bg-muted/60 md:col-span-8" />
        <div className="grid gap-5 md:col-span-4">
          <div className="h-56 animate-pulse rounded-[2px] bg-muted/60" />
          <div className="h-56 animate-pulse rounded-[2px] bg-muted/60" />
        </div>
      </div>
      <div className="h-[28rem] animate-pulse rounded-[2px] bg-muted/55" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-[2px] bg-muted/60" />
        <div className="h-80 animate-pulse rounded-[2px] bg-muted/60" />
      </div>
    </div>
  )
}
