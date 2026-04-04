import prisma from "@/prisma/client"
import { withPrismaFallback } from "@/prisma/safe"
import { Container } from "@radix-ui/themes"
import { getTranslations } from "next-intl/server"
import { Tag } from "@prisma/client"
import Hero from "../components/Hero"
import SummaryHeader from "../SummaryHeader"
import DynamicBezierCurve from "../components/navbar/DynamicBezierCurve"
import PostSummary from "../PostSummary"

interface Props {
  params: { locale: string }
  searchParams: { tags: Tag }
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
  const summary = await withPrismaFallback(
    async () => {
      const localizedCount = await prisma.issue.count({
        where: { language: params.locale },
      })
      const where = localizedCount > 0 ? { language: params.locale } : {}
      const [open, inProgress, closed] = await Promise.all([
        prisma.issue.count({
          where: { ...where, status: "FINISHED" },
        }),
        prisma.issue.count({
          where: { ...where, status: "IN_PROGRESS" },
        }),
        prisma.issue.count({
          where: { ...where, status: "CLOSED" },
        }),
      ])

      return { open, inProgress, closed }
    },
    { open: 0, inProgress: 0, closed: 0 },
    "Falling back to empty home summary because the database is unavailable."
  )

  return (
    <>
      <DynamicBezierCurve>
        <Hero />
      </DynamicBezierCurve>
      <Container>
        <SummaryHeader />
        <PostSummary
          web={summary.open}
          tech={summary.inProgress}
          nonTech={summary.closed}
        />
      </Container>
    </>
  )
}
