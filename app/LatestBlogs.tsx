import prisma from "@/prisma/client"
import { withPrismaFallback } from "@/prisma/safe"
import { Avatar, Flex } from "@radix-ui/themes"
import React from "react"
import { IssueStatusBadge } from "./components"
import { Link } from "@/app/i18n/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import RetroPanel from "./components/system/RetroPanel"
import { RetroBadge } from "./components/system/RetroBadge"

const LatestBlogs = async () => {
  const locale = await getLocale()
  const t = await getTranslations("home")
  const blogs = await withPrismaFallback(
    async () => {
      const localizedCount = await prisma.issue.count({
        where: { language: locale },
      })

      return prisma.issue.findMany({
        where: localizedCount > 0 ? { language: locale } : undefined,
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          assignedToUser: true,
        },
      })
    },
    [],
    "Falling back to an empty latest blogs list because the database is unavailable.",
  )

  return (
    <RetroPanel
      eyebrow="recent logs"
      title={t("latestBlogs")}
      action={<RetroBadge tone="primary">{blogs.length} items</RetroBadge>}
    >
      <div className="grid gap-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="pixel-panel border border-border/70 bg-background/70 px-4 py-4"
            >
                <Flex direction="column" align="start" gap="3">
                  <Link
                    className="text-base font-medium text-foreground transition-colors hover:text-primary hover:underline"
                    href={`/blogs/${blog.id}`}
                  >
                    {blog.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-3">
                    <IssueStatusBadge status={blog.status} />
                    <RetroBadge tone="neutral">
                      {blog.createdAt.toLocaleDateString()}
                    </RetroBadge>
                  </div>
                </Flex>
                {blog.assignedToUser && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar
                      src={blog.assignedToUser?.image!}
                      fallback="?"
                      size="2"
                      radius="none"
                    />
                    <span>{blog.assignedToUser.name ?? "Unknown"}</span>
                  </div>
                )}
            </div>
          ))}
      </div>
    </RetroPanel>
  )
}

export default LatestBlogs
