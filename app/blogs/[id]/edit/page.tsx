import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import IssueForm from "../../_components/IssueForm";
import { MODE } from "@/app/envConfig";
interface Props {
  params: { id: string };
}

const EditIssuePage = async ({ params }: Props) => {
  if (MODE !== "dev") return;

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue) notFound();

  return <IssueForm issue={issue} />;
};

export default EditIssuePage;
