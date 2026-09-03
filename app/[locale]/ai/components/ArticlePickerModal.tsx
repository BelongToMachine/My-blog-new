"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { useFocusTrap } from "@/app/hooks/useFocusTrap"

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
  const dialogRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const searchLabelId = useId()

  useEffect(() => {
    if (!isOpen) {
      setQuery("")
    }
  }, [isOpen])

  useFocusTrap({
    active: isOpen,
    containerRef: dialogRef,
    initialFocusRef: searchInputRef,
    onEscape: onClose,
  })

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
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center bg-background/82 px-4 backdrop-blur-[2px]"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="w-full max-w-[760px] border-2 border-border bg-background px-5 py-5 shadow-[0_24px_64px_hsl(var(--background)/0.5)] md:px-6 md:py-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 id={titleId} className="font-semibold text-[14px] tracking-[0.02em] text-foreground md:text-[16px]">
              {modalTitle}
            </h2>
            <p id={descriptionId} className="text-[12px] leading-7 tracking-[0.04em] text-muted-foreground md:text-[13px]">
              {modalHint}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ai-lab-pixel-button h-11 w-11 shrink-0 text-foreground"
            aria-label={locale.startsWith("zh") ? "关闭" : "Close"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3 border-2 border-border bg-background px-3">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
          <label id={searchLabelId} className="sr-only" htmlFor="article-picker-search">
            {locale.startsWith("zh") ? "搜索文章" : "Search articles"}
          </label>
          <Input
            ref={searchInputRef}
            id="article-picker-search"
            aria-labelledby={searchLabelId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="border-0 bg-transparent px-0 text-[11px] tracking-[0.02em] shadow-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
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
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {emptyLabel}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
