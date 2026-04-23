import React from "react"
import { Link } from "@/app/i18n/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import { getMdxArticleList } from "@/app/service/mdxArticles"
import RetroPanel from "./components/system/RetroPanel"
import { RetroBadge } from "./components/system/RetroBadge"

const LatestBlogs = async () => {
  const locale = await getLocale()
  const t = await getTranslations("home")
  const articles = await getMdxArticleList(locale).catch(() => [])

  const recent = articles.slice(0, 5)

  return (
    <RetroPanel
      className="flex min-w-0 w-full flex-col"
      eyebrow="recent logs"
      title={t("latestBlogs")}
      action={<RetroBadge tone="primary">{recent.length} items</RetroBadge>}
      contentClassName="flex flex-1 flex-col"
    >
      <div className="flex flex-1 flex-col gap-3">
        {recent.map((article) => (
          <div
            key={article.slug}
            className="pixel-panel flex w-full min-w-0 flex-col gap-3 border border-border/70 bg-background/70 px-4 py-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <Link
                className="block min-w-0 font-pixel text-sm uppercase tracking-[0.12em] text-foreground transition-colors hover:text-primary hover:underline md:text-base"
                href={`/articles/${article.slug}`}
              >
                {article.title}
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:shrink-0 md:justify-end">
              <RetroBadge tone="primary">MDX</RetroBadge>
              <RetroBadge tone="neutral">{article.publishedOn}</RetroBadge>
            </div>
          </div>
        ))}
      </div>
    </RetroPanel>
  )
}

export default LatestBlogs
