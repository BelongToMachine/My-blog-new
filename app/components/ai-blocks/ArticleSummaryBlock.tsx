"use client"

interface Article {
  slug: string
  title: string
  description: string
  publishedOn: string
  locale: string
}

export default function ArticleSummaryBlock({
  title,
  data,
}: {
  title?: string
  data: { articles?: unknown[] }
}) {
  const articles = data.articles ?? []

  return (
    <div className="space-y-4">
      {title ? (
        <p className="font-pixel text-xs uppercase tracking-[0.22em] text-primary">
          {title}
        </p>
      ) : null}

      <div className="space-y-3">
        {articles.map((item, index) => {
          const article = item as Article
          return (
            <div
              key={index}
              className="border-b border-border/40 pb-3 last:border-0 last:pb-0"
            >
              <p className="mb-1 text-sm font-medium text-foreground">
                {article.title}
              </p>
              <p className="mb-1.5 text-sm leading-6 text-muted-foreground">
                {article.description}
              </p>
              <div className="flex items-center gap-3">
                <span className="font-pixel text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70">
                  {article.publishedOn}
                </span>
                <span className="font-pixel text-[9px] uppercase tracking-[0.2em] text-primary/60">
                  {article.locale}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
