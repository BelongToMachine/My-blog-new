import { ArrowUpIcon } from "@radix-ui/react-icons"
import { Table } from "@radix-ui/themes"
import React from "react"
import { IssueStatusBadge } from "../components"
import { Issue, Status } from "@prisma/client"
import { xTheme } from "../service/ThemeService"
import { Link } from "@/app/i18n/navigation"
import { getTranslations } from "next-intl/server"
export interface BlogQuery {
  status: Status
  orderBy: keyof Issue
  page: string
}

interface Props {
  searchParams: Promise<BlogQuery>
  issues: Issue[]
}

const BlogTable = async ({ searchParams: params, issues }: Props) => {
  const t = await getTranslations("blogs")
  const searchParams = (await params) ?? {}

  const orderBy = searchParams.orderBy ?? undefined

  return (
    <div className="overflow-hidden rounded-[0.55rem] border border-border/70 bg-background/75 shadow-sm">
      <Table.Root variant="surface">
      <Table.Header
        style={{
          background: "",
        }}
      >
        <Table.Row style={xTheme.blogTableHeader}>
          {columns(t).map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.className}
            >
              <Link
                href={{
                  pathname: "/blogs",
                  query: { ...searchParams, orderBy: column.value },
                }}
              >
                {column.label}
              </Link>
              {column.value === orderBy && <ArrowUpIcon className="inline" />}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {issues.map((issue) => (
          <Table.Row key={issue.id} style={xTheme.blogTableBody}>
            <Table.Cell>
              <Link href={`/blogs/${issue.id}`}>{issue.title}</Link>
              <div className="block md:hidden">
                <IssueStatusBadge status={issue.status} />
              </div>
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              <IssueStatusBadge status={issue.status} />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              {issue.createdAt.toLocaleString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      </Table.Root>
    </div>
  )
}

const columns = (t: Awaited<ReturnType<typeof getTranslations>>) => [
  { label: t("title"), value: "title" as const },
  {
    label: t("type"),
    value: "status" as const,
    className: "hidden md:table-cell",
  },
  {
    label: t("createdAt"),
    value: "createdAt" as const,
    className: "hidden md:table-cell",
  },
]

export const columnNames: (keyof Issue)[] = ["title", "status", "createdAt"]

export default BlogTable
