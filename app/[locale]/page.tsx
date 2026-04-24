import { Container } from "@radix-ui/themes"
import { getTranslations } from "next-intl/server"
import { getMdxArticleList } from "@/app/service/mdxArticles"
import Hero from "../components/Hero"
import SummaryHeader from "../SummaryHeader"
import DynamicBezierCurve from "../components/navbar/DynamicBezierCurve"
import PostSummary from "../PostSummary"

interface Props {
  params: { locale: string }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "meta" })

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        en: "/en",
        zh: "/zh",
      },
    },
  }
}

export default async function Home({ params }: Props) {
  const articles = await getMdxArticleList(params.locale)

  return (
    <>
      <DynamicBezierCurve>
        <Hero />
      </DynamicBezierCurve>
      <Container className="relative z-40 -mt-[78px] px-3 sm:px-4 md:z-auto md:mt-0 md:px-6 lg:px-8 xl:px-10">
        <SummaryHeader />
        <PostSummary total={articles.length} />
      </Container>
    </>
  )
}
