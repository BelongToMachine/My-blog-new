import prisma from "@/prisma/client"
import { withPrismaFallback } from "@/prisma/safe"
import { Avatar, Card, Flex, Heading, Table } from "@radix-ui/themes"
import React from "react"
import { IssueStatusBadge } from "./components"
import { Link } from "@/app/i18n/navigation"
import { getLocale, getTranslations } from "next-intl/server"

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
    <Card className="section-shell p-5 sm:p-6">
      <Heading size="4" className="mb-4 text-foreground">
        {t("latestBlogs")}
      </Heading>
      <Table.Root variant="surface">
        <Table.Body>
          {blogs.map((blog) => (
            <Table.Row key={blog.id}>
              <Table.Cell className="border-b border-border/70 px-0 py-4 last:border-b-0">
                <Flex direction="column" align="start" gap="2">
                  <Link
                    className="text-foreground transition-colors hover:text-primary hover:underline"
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
    </Card>
  )
}

export default LatestBlogs
