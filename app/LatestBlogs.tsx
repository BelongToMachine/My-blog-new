import prisma from "@/prisma/client"
import { withPrismaFallback } from "@/prisma/safe"
import { Avatar, Flex, Heading, Table } from "@radix-ui/themes"
import React from "react"
import { IssueStatusBadge } from "./components"
import { Link } from "@/app/i18n/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import { SurfaceCard } from "./components/system"

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
    <SurfaceCard>
      <Heading size="4" mb="4">
        {t("latestBlogs")}
      </Heading>
      <Table.Root>
        <Table.Body>
          {blogs.map((blog) => (
            <Table.Row key={blog.id}>
              <Table.Cell className="border-b border-border/60">
                <Flex direction="column" align="start" gap="2">
                  <Link
                    className="text-foreground transition-colors hover:text-primary"
                    href={`/blogs/${blog.id}`}
                  >
                    {blog.title}
                  </Link>
                  <IssueStatusBadge status={blog.status} />
                </Flex>
                {blog.assignedToUser && (
                  <Avatar
                    src={blog.assignedToUser?.image!}
                    fallback="?"
                    size="2"
                    radius="full"
                  />
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </SurfaceCard>
  )
}

export default LatestBlogs
