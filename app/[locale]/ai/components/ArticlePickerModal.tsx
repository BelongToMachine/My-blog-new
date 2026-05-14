"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/app/components/ui/input"

interface ArticlePickerModalProps {
  articles: Array<{ slug: string; title: string }>
  isOpen: boolean
  locale: string
  onClose: () => void
  onSelect: (article: { slug: string; title: string }) => void | Promise<void>
}

export default function ArticlePickerModal({
  articles,
  isOpen,
  locale,
  onClose,
  onSelect,
}: ArticlePickerModalProps) {
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return articles

    return articles.filter((article) =>
      article.title.toLowerCase().includes(normalizedQuery),
    )
  }, [articles, query])

  if (!isOpen) return null

  const searchPlaceholder = locale.startsWith("zh")
    ? "搜索文章标题..."
    : "Search article titles..."

  const modalTitle = locale.startsWith("zh") ? "选择一篇 blog" : "Choose a blog post"
  const modalHint = locale.startsWith("zh")
    ? "点一篇文章，我来介绍它写了什么、为什么值得看。"
    : "Pick a post and I'll explain what it covers and why it is worth reading."
  const emptyLabel = locale.startsWith("zh")
    ? "没有匹配的文章"
    : "No matching articles"

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-background/82 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[760px] border-2 border-border bg-background px-5 py-5 shadow-[0_24px_64px_hsl(var(--background)/0.5)] md:px-6 md:py-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="font-pixel text-[14px] uppercase tracking-[0.14em] text-foreground md:text-[16px]">
              {modalTitle}
            </h2>
            <p className="text-[12px] leading-7 tracking-[0.04em] text-muted-foreground md:text-[13px]">
              {modalHint}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ai-lab-pixel-button h-10 w-10 shrink-0 text-foreground"
            aria-label={locale.startsWith("zh") ? "关闭" : "Close"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3 border-2 border-border bg-background px-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="border-0 bg-transparent px-0 font-pixel text-[11px] uppercase tracking-[0.08em] shadow-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {filteredArticles.length > 0 ? (
            <div className="space-y-2">
              {filteredArticles.map((article) => (
                <button
                  key={article.slug}
                  type="button"
                  onClick={() => {
                    void onSelect(article)
                  }}
                  className="ai-lab-pixel-button flex w-full items-center justify-between border-border bg-background px-4 py-3 text-left text-[10px] text-foreground"
                >
                  <span className="block whitespace-normal text-[12px] leading-6 tracking-[0.04em] text-foreground md:text-[13px]">
                    {article.title}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="border-2 border-border/70 px-4 py-8 text-center">
              <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {emptyLabel}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
