import prisma from "@/prisma/client"
import { Container } from "@radix-ui/themes"
import { getTranslations } from "next-intl/server"
import { Tag } from "@prisma/client"
import Hero from "../components/Hero"
import SummaryHeader from "../SummaryHeader"
import Contact from "../Contact"
import DynamicBezierCurve from "../components/navbar/DynamicBezierCurve"
import PostSummary from "../PostSummary"
import AIPlayground from "./ai/AIPlayground"

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
  const localizedCount = await prisma.issue.count({
    where: { language: params.locale },
  })
  const where = localizedCount > 0 ? { language: params.locale } : {}

  const open = await prisma.issue.count({
    where: { ...where, status: "FINISHED" },
  })
  const inProgress = await prisma.issue.count({
    where: { ...where, status: "IN_PROGRESS" },
  })
  const closed = await prisma.issue.count({
    where: { ...where, status: "CLOSED" },
  })

  return (
    <>
      <DynamicBezierCurve>
        <Hero />
      </DynamicBezierCurve>
      <Container>
        <SummaryHeader />
        <PostSummary web={open} tech={inProgress} nonTech={closed} />
        <AIPlayground />
        <Contact />
      </Container>
    </>
  )
}
