"use client"

import Link from "next/link"
import { useLocale } from "next-intl"
import type { ArticleSummaryArtifactData } from "@/app/types/ai-workspace"

export default function ArticleSummaryBlock({
  title,
  data,
}: {
  title?: string
  data: ArticleSummaryArtifactData
}) {
  const locale = useLocale()
  const articles = data.articles ?? []

  return (
    <div className="space-y-4">
      {title ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          {title}
        </p>
      ) : null}

      <div className="space-y-3">
        {articles.map((article, index) => (
          <div
            key={index}
            className="border-b border-border/40 pb-3 last:border-0 last:pb-0"
          >
            <p className="mb-1 text-[12px] font-medium tracking-[0.02em] text-foreground">
              <Link
                href={`/${locale}/articles/${article.slug}`}
                className="transition-colors hover:text-primary"
              >
                {article.title}
              </Link>
            </p>
            <p className="mb-1.5 text-[12px] leading-6 tracking-[0.04em] text-muted-foreground">
              {article.description}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/72">
                {article.publishedOn}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-primary/68">
                {article.locale}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
