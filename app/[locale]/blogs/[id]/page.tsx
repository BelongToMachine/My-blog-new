import prisma from "@/prisma/client"
import { withPrismaFallback } from "@/prisma/safe"
import { Box, Container, Flex, Grid } from "@radix-ui/themes"
import { notFound } from "next/navigation"
import { cache } from "react"
import { getTranslations } from "next-intl/server"
import EditIssueButton from "@/app/blogs/[id]/EditIssueButton"
import IssueDetails from "@/app/blogs/[id]/IssueDetails"
import DeleteIssueButton from "@/app/blogs/[id]/DeleteIssueButton"
import AssigneeSelect from "@/app/blogs/[id]/AssigneeSelect"
import { MODE } from "@/app/envConfig"

interface Props {
  params: { locale: string; id: string }
}

const fetchIssue = cache((issueId: number, locale: string) =>
  withPrismaFallback(
    () =>
      prisma.issue
        .findFirst({ where: { id: issueId, language: locale } })
        .then((issue) =>
          issue ?? prisma.issue.findUnique({ where: { id: issueId } })
        ),
    null,
    `Falling back to a missing blog detail for issue ${issueId}.`
  )
)

export default async function BlogDetailPage({ params }: Props) {
  const issue = await fetchIssue(parseInt(params.id), params.locale)

  if (!issue) {
    notFound()
  }

  return (
    <Container>
      <Grid columns={{ initial: "1", sm: "5" }} gap="5">
        <Box className="md:col-span-5">
          <IssueDetails issue={issue} />
        </Box>
        {MODE === "dev" && (
          <Box>
            <Flex direction="column" gap="4">
              <AssigneeSelect issue={issue} />
              <EditIssueButton issueId={issue.id} />
              <DeleteIssueButton issueId={issue.id} />
            </Flex>
          </Box>
        )}
      </Grid>
    </Container>
  )
}

export async function generateMetadata({ params }: Props) {
  const issue = await fetchIssue(parseInt(params.id), params.locale)
  const t = await getTranslations({
    locale: params.locale,
    namespace: "blogs",
  })

  return {
    title: issue?.title,
    description: t("detailDescription", { id: issue?.id ?? params.id }),
    alternates: {
      canonical: `/${params.locale}/blogs/${params.id}`,
      languages: {
        en: `/en/blogs/${params.id}`,
        zh: `/zh/blogs/${params.id}`,
      },
    },
  }
}
