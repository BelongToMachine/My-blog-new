import prisma from "@/prisma/client"
import { Avatar } from "@radix-ui/themes"
import React from "react"
import { IssueStatusBadge } from "./components"
import { Link } from "@/app/i18n/navigation"
import { getLocale, getTranslations } from "next-intl/server"

const LatestBlogs = async () => {
  const locale = await getLocale()
  const t = await getTranslations("home")
  const localizedCount = await prisma.issue.count({
    where: { language: locale },
  })
  const blogs = await prisma.issue.findMany({
    where: localizedCount > 0 ? { language: locale } : undefined,
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      assignedToUser: true,
    },
  })

  return (
    <section className="section-shell h-full p-6 sm:p-7">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker mb-2">{t("latestBlogsEyebrow")}</p>
          <h3 className="text-2xl font-bold tracking-[-0.04em] text-foreground">
            {t("latestBlogs")}
          </h3>
        </div>
        <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {blogs.length}
        </span>
      </div>

      <div className="space-y-3">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.id}`}
            className="group block rounded-[1.35rem] border border-border/70 bg-background/70 px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)] dark:bg-slate-950/35"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <p className="truncate text-base font-semibold tracking-[-0.02em] text-foreground">
                  {blog.title}
                </p>
                <IssueStatusBadge status={blog.status} />
              </div>
              {blog.assignedToUser && (
                <Avatar
                  src={blog.assignedToUser.image!}
                  fallback="?"
                  size="2"
                  radius="full"
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default LatestBlogs
