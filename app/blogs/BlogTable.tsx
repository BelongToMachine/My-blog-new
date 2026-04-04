import { ArrowUpIcon } from "@radix-ui/react-icons"
import { Table } from "@radix-ui/themes"
import React from "react"
import { IssueStatusBadge } from "../components"
import { Issue, Status } from "@prisma/client"
import { Link } from "@/app/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { SurfaceCard } from "../components/system"
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
    <SurfaceCard padding="none" className="overflow-hidden">
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row className="bg-muted/65 text-foreground">
            {columns(t).map((column) => (
              <Table.ColumnHeaderCell
                key={column.value}
                className={`${column.className ?? ""} text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground`}
              >
                <Link
                  href={{
                    pathname: "/blogs",
                    query: { ...searchParams, orderBy: column.value },
                  }}
                  className="transition-colors hover:text-primary"
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
            <Table.Row key={issue.id} className="bg-card/60 text-foreground">
              <Table.Cell>
                <Link
                  href={`/blogs/${issue.id}`}
                  className="transition-colors hover:text-primary"
                >
                  {issue.title}
                </Link>
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
    </SurfaceCard>
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
