import { Container } from "@radix-ui/themes"
import { cn } from "@/lib/utils"
import { getMdxArticleList } from "@/app/service/mdxArticles"
import Hero from "../Hero"
import ProjectsSection from "../projects/ProjectsSection"
import SummaryHeader from "@/app/SummaryHeader"
import PostSummary from "@/app/PostSummary"
import AboutPinnedHeroShell from "./AboutPinnedHeroShell"

interface Props {
  locale: string
  overlapTop?: boolean
  sectionId?: string
  showBackLink?: boolean
  pinHeroUnderDesktop?: boolean
  mirrorDesktopCurve?: boolean
  heroVariant?: "default" | "spotlight"
}

export default async function AboutSections({
  locale,
  overlapTop = false,
  sectionId,
  showBackLink = true,
  pinHeroUnderDesktop = false,
  mirrorDesktopCurve = false,
  heroVariant = "default",
}: Props) {
  const articles = await getMdxArticleList(locale)

  const webDevCount = articles.filter((article) => article.category === "webDev").length
  const aiCount = articles.filter((article) => article.category === "ai").length
  const nonTechCount = articles.filter((article) => article.category === "nonTech").length

  const content = (
    <section
      id={pinHeroUnderDesktop ? sectionId : undefined}
      className={cn(
        "relative z-40 bg-background",
        overlapTop && "-mt-[78px]",
        pinHeroUnderDesktop &&
          "max-lg:relative max-lg:border-t-[3px] max-lg:border-solid max-lg:border-border max-lg:shadow-[6px_-6px_0_rgba(0,0,0,0.34)]",
      )}
    >
      <Container
        className={cn(
          "px-3 pb-16 sm:px-4 md:px-6 md:pb-20 lg:px-8 xl:px-10",
          pinHeroUnderDesktop && "pt-12 sm:pt-14 md:pt-16 lg:pt-0",
        )}
      >
        <ProjectsSection />
        <SummaryHeader />
        <PostSummary
          total={articles.length}
          webDev={webDevCount}
          ai={aiCount}
          nonTech={nonTechCount}
        />
      </Container>
    </section>
  )

  if (pinHeroUnderDesktop) {
    return (
      <AboutPinnedHeroShell
        hero={<Hero showBackLink={showBackLink} variant={heroVariant} />}
        mirrorDesktopCurve={mirrorDesktopCurve}
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
          <Hero showBackLink={showBackLink} variant={heroVariant} />
        </Container>
      </div>
      {content}
    </section>
  )
}
