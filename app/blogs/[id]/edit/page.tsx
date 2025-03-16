import prisma from "@/prisma/client"
import { notFound } from "next/navigation"
import React from "react"
import IssueForm from "../../_components/IssueForm"
import { MODE } from "@/app/envConfig"
interface Props {
  params: Promise<{ id: string }>
}

const EditIssuePage = async ({ params }: Props) => {
  if (MODE !== "dev") return

  const { id } = await params

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  })

  if (!issue) notFound()

  return <IssueForm issue={issue} />
}

export default EditIssuePage
