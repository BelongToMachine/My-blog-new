import prisma from "@/prisma/client"
import { withPrismaFallback } from "@/prisma/safe"
import { Status } from "@prisma/client"
import { Container } from "@radix-ui/themes"
import { getTranslations } from "next-intl/server"
import BlogTable, { columnNames, type BlogQuery } from "@/app/blogs/BlogTable"
import Pagination from "@/app/components/Pagination"
import IssueActions from "@/app/blogs/IssueActions"
import { PageSection, SectionHeading } from "@/app/components/system"

interface Props {
  params: { locale: string }
  searchParams: BlogQuery
}

const BlogsPage = async ({ params, searchParams }: Props) => {
  const t = await getTranslations("blogs")
  const statuses = Object.values(Status)
  const { locale } = params
  const { status: statusValue, orderBy: orderByValue, page: pageValue } =
    searchParams

  const status = statuses.includes(statusValue) ? statusValue : undefined
  const orderBy = columnNames.includes(orderByValue)
    ? { [orderByValue]: "asc" as const }
    : undefined
  const page = parseInt(pageValue) || 1
  const pageSize = 10
  const data = await withPrismaFallback(
    async () => {
      const localizedCount = await prisma.issue.count({
        where: { language: locale },
      })
      const where =
        localizedCount > 0 ? { status, language: locale } : { status }
      const [issues, issueCount] = await Promise.all([
        prisma.issue.findMany({
          where,
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.issue.count({ where }),
      ])

      return { issues, issueCount }
    },
    { issues: [], issueCount: 0 },
    "Falling back to an empty blog list because the database is unavailable."
  )

  return (
    <Container>
      <PageSection className="space-y-6 px-5">
        <SectionHeading
          align="left"
          title={t("listTitle")}
          description={t("listDescription")}
          className="mb-0"
        />
        <IssueActions />
        <BlogTable
          searchParams={Promise.resolve(searchParams)}
          issues={data.issues}
        />
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCounts={data.issueCount}
        />
      </PageSection>
    </Container>
  )
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "meta" })

  return {
    title: t("blogsTitle"),
    description: t("blogsDescription"),
    alternates: {
      canonical: `/${params.locale}/blogs`,
      languages: {
        en: "/en/blogs",
        zh: "/zh/blogs",
      },
    },
  }
}

export const dynamic = "force-dynamic"

export default BlogsPage
