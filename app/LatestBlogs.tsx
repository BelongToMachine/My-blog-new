import React from "react"
import { Link } from "@/app/i18n/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import { getMdxArticleList } from "@/app/service/mdxArticles"
import RetroPanel from "./components/system/RetroPanel"
import { RetroBadge } from "./components/system/RetroBadge"

const LatestBlogs = async () => {
  const locale = await getLocale()
  const t = await getTranslations("home")
  const tBlog = await getTranslations("blogs")
  const articles = await getMdxArticleList(locale).catch(() => [])

  const recent = articles.slice(0, 5)

  return (
    <RetroPanel
      className="!shadow-none flex min-w-0 w-full flex-col"
      typography="plain"
      eyebrow="recent logs"
      title={t("latestBlogs")}
      action={
        <div className="flex w-full justify-start md:w-auto md:justify-end">
          <RetroBadge
            typography="plain"
            tone="primary"
            className="px-2 text-[10px] tracking-[0.02em] md:px-2.5 md:text-[11px]"
          >
            {recent.length} items
          </RetroBadge>
        </div>
      }
      contentClassName="flex flex-1 flex-col px-3 py-3.5 sm:px-4 sm:py-4 md:px-5 md:py-5"
    >
      <div className="flex flex-1 flex-col gap-2.5 md:gap-3">
        {recent.map((article) => (
          <div
            key={article.slug}
            className="pixel-panel !shadow-none flex w-full min-w-0 flex-col gap-3 border border-border/70 bg-background/70 px-3 py-3.5 sm:px-4 sm:py-4 md:flex-row md:items-start md:justify-between md:gap-4 lg:items-center"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Link
                className="block min-w-0 overflow-hidden text-[0.98rem] font-medium leading-[1.6] tracking-[0.01em] text-foreground transition-colors hover:text-primary hover:underline [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] md:text-[1.02rem] md:leading-[1.65]"
                href={`/articles/${article.slug}`}
              >
                {article.title}
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 md:shrink-0 md:flex-nowrap md:justify-end md:self-center">
              <RetroBadge
                typography="plain"
                tone="primary"
                className="px-2 text-[10px] tracking-[0.02em] md:px-2.5 md:text-[11px]"
              >
                {article.category ? tBlog(`category.${article.category}`) : "MDX"}
              </RetroBadge>
              <RetroBadge
                typography="plain"
                tone="neutral"
                className="px-2 text-[10px] tracking-[0.02em] md:px-2.5 md:text-[11px]"
              >
                {article.publishedOn}
              </RetroBadge>
            </div>
          </div>
        ))}
      </div>
    </RetroPanel>
  )
}

export default LatestBlogs
