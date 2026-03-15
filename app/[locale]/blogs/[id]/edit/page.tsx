import prisma from "@/prisma/client"
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

  const issue = await prisma.issue.findFirst({
    where: { id: parseInt(params.id), language: params.locale },
  })

  if (!issue) {
    notFound()
  }

  return <IssueForm issue={issue} />
}
