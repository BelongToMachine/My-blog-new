import prisma from "@/prisma/client"
import { Box, Container, Flex, Grid } from "@radix-ui/themes"
import { notFound } from "next/navigation"
import EditIssueButton from "./EditIssueButton"
import IssueDetails from "./IssueDetails"
import DeleteIssueButton from "./DeleteIssueButton"
import { getServerSession } from "next-auth"
import authOptions from "@/app/auth/authOptions"
import AssigneeSelect from "./AssigneeSelect"
import { cache } from "react"
import Wind from "./Wind"
import style from "@/app/service/ThemeCssProperties"

interface Props {
  params: Promise<{ id: string }>
}

const fetchUser = cache((issueId: number) =>
  prisma.issue.findUnique({ where: { id: issueId } })
)

const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)

  const { id } = await params

  const issue = await fetchUser(parseInt(id))

  if (!issue) notFound()

  return (
    <Container
      style={{
        background: style.background,
      }}
    >
      <Grid columns={{ initial: "1", sm: "5" }} gap="5">
        <Box className="md:col-span-5">
          <IssueDetails issue={issue} />
        </Box>
        {session && (
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
  const { id } = await params

  const issue = await fetchUser(parseInt(id))

  return {
    title: issue?.title,
    description: "Details of issue " + issue?.id,
  }
}

export default IssueDetailPage
