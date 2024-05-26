import React from "react";
import prisma from "@/prisma/client";
import delay from "delay";
import IssueActions from "./IssueActions";
import { Status } from "@prisma/client";
import BlogTable, { BlogQuery } from "@/app/blogs/BlogTable";
import Pagination from "../components/Pagination";
import { columnNames } from "@/app/blogs/BlogTable";
import { Metadata } from "next";

interface Props {
  searchParams: BlogQuery;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const orderBy = columnNames.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: "asc" }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;
  const where = { status };

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({
    where,
  });

  return (
    <div className="space-y-3 p-5">
      <IssueActions />
      <BlogTable searchParams={searchParams} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCounts={issueCount}
      />
    </div>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs List",
  description: "View all of my blogs",
};
export default IssuesPage;
