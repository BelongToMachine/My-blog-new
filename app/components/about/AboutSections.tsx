import { Container } from "@radix-ui/themes"
import { cn } from "@/lib/utils"
import { getMdxArticleList } from "@/app/service/mdxArticles"
import Hero from "../Hero"
import ProjectsSection from "../projects/ProjectsSection"
import SummaryHeader from "@/app/SummaryHeader"
import PostSummary from "@/app/PostSummary"
import AboutClientShell from "@/app/[locale]/about/AboutClientShell"
import HomeInlinePixelBezier from "../home/HomeInlinePixelBezier"

interface Props {
  locale: string
  overlapTop?: boolean
  sectionId?: string
  showBackLink?: boolean
  showBezierCurve?: boolean
  showInlinePixelBezier?: boolean
  heroVariant?: "default" | "spotlight"
}

export default async function AboutSections({
  locale,
  overlapTop = false,
  sectionId,
  showBackLink = true,
  showBezierCurve = false,
  showInlinePixelBezier = false,
  heroVariant = "default",
}: Props) {
  const articles = await getMdxArticleList(locale)

  const webDevCount = articles.filter((article) => article.category === "webDev").length
  const aiCount = articles.filter((article) => article.category === "ai").length
  const nonTechCount = articles.filter((article) => article.category === "nonTech").length

  const content = (
    <section
      id={sectionId}
      className={cn("relative z-40 bg-background", overlapTop && "-mt-[78px]")}
    >
      <Container className="px-3 pb-16 sm:px-4 md:px-6 md:pb-20 lg:px-8 xl:px-10">
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

  if (showBezierCurve) {
    return (
      <AboutClientShell hero={<Hero showBackLink={showBackLink} variant={heroVariant} />}>
        {content}
      </AboutClientShell>
    )
  }

  const contentWithInlineCurve = showInlinePixelBezier ? (
    <HomeInlinePixelBezier>{content}</HomeInlinePixelBezier>
  ) : (
    content
  )

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
      {contentWithInlineCurve}
    </section>
  )
}
