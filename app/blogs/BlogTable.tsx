import { ArrowUpIcon } from "@radix-ui/react-icons"
import React from "react"
import { IssueStatusBadge } from "../components"
import { Issue, Status } from "@prisma/client"
import { Link } from "@/app/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { RetroBadge } from "@/app/components/system/RetroBadge"
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
    <div className="pixel-panel overflow-hidden border border-border/80 bg-card/88">
      <div className="hidden grid-cols-[minmax(0,1.3fr)_180px_220px] gap-4 border-b border-border/70 px-4 py-4 font-pixel text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:grid">
            {columns(t).map((column) => (
              <div
                key={column.value}
                className={column.className}
              >
                <Link
                  className="font-medium text-foreground transition-colors hover:text-primary"
                  href={{
                    pathname: "/blogs",
                    query: { ...searchParams, orderBy: column.value },
                  }}
                >
                  {column.label}
                </Link>
                {column.value === orderBy && <ArrowUpIcon className="inline" />}
              </div>
            ))}
      </div>
      <div className="grid">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="grid gap-3 border-b border-border/70 px-4 py-4 last:border-b-0 md:grid-cols-[minmax(0,1.3fr)_180px_220px] md:items-center"
            >
              <div>
                <Link
                  className="text-foreground transition-colors hover:text-primary hover:underline"
                  href={`/blogs/${issue.id}`}
                >
                  {issue.title}
                </Link>
                <div className="mt-3 flex flex-wrap gap-2 md:hidden">
                  <IssueStatusBadge status={issue.status} />
                  <RetroBadge tone="neutral">{issue.createdAt.toLocaleDateString()}</RetroBadge>
                </div>
              </div>
              <div className="hidden md:block">
                <IssueStatusBadge status={issue.status} />
              </div>
              <div className="hidden text-foreground/80 md:block">
                {issue.createdAt.toLocaleString()}
              </div>
            </div>
          ))}
      </div>
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
