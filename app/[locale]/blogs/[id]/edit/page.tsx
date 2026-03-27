import prisma from "@/prisma/client"
import { withPrismaFallback } from "@/prisma/safe"
import { notFound } from "next/navigation"
import IssueForm from "@/app/blogs/_components/IssueForm"
import { MODE } from "@/app/envConfig"

interface Props {
  params: { locale: string; id: string }
}

export default async function EditBlogPage({ params }: Props) {
  if (MODE !== "dev") {
    return null
  }

  const issue = await withPrismaFallback(
    () =>
      prisma.issue.findFirst({
        where: { id: parseInt(params.id), language: params.locale },
      }),
    null,
    `Blocking blog edit for issue ${params.id} because the database is unavailable.`
  )

  if (!issue) {
    notFound()
  }

  return <IssueForm issue={issue} />
}
