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
      className="min-w-0 w-full"
      eyebrow="recent logs"
      title={t("latestBlogs")}
      action={<RetroBadge tone="primary">{recent.length} items</RetroBadge>}
    >
      <div className="grid gap-3">
        {recent.map((article) => (
          <div
            key={article.slug}
            className="pixel-panel w-full min-w-0 border border-border/70 bg-background/70 px-4 py-4"
          >
            <div className="flex min-w-0 flex-col gap-3">
              <Link
                className="block min-w-0 font-pixel text-sm uppercase tracking-[0.12em] text-foreground transition-colors hover:text-primary hover:underline md:text-base"
                href={`/articles/${article.slug}`}
              >
                {article.title}
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <RetroBadge tone="primary">MDX</RetroBadge>
                <RetroBadge tone="neutral">
                  {article.publishedOn}
                </RetroBadge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </RetroPanel>
  )
}

export default LatestBlogs
