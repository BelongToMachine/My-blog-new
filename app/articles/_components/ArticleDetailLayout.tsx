"use client"

import React, { useState } from "react"
import { Box, Container, Grid } from "@radix-ui/themes"
import { cn } from "@/lib/utils"
import PixelMenuIcon from "@/app/components/system/PixelMenuIcon"
import TableOfContent from "@/app/articles/_components/TableOfContent"
import { RetroBadge } from "@/app/components/system/RetroBadge"
import ArticleEnhancement from "@/app/articles/_components/ArticleEnhancement"
import ArticleBody from "@/app/articles/_components/ArticleBody"
import ArticleFooter from "@/app/articles/_components/ArticleFooter"
import type { Heading } from "@/app/service/BlogParser"
import styles from "@/app/articles/post.module.css"

interface ArticleDetailLayoutProps {
  article: {
    slug: string
    title: string
    publishedOn: string
    locale: string
    htmlContent: string
    headings: Heading[]
  }
}

export default function ArticleDetailLayout({ article }: ArticleDetailLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Container>
      <div className="space-y-6 p-5">
        <ArticleEnhancement slug={article.slug} />

        {/* Mobile TOC toggle — fixed, follows scroll */}
        <div className="fixed bottom-6 left-6 z-40 lg:hidden">
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="flex h-12 w-12 items-center justify-center border-2 border-border/70 bg-background/90 text-foreground shadow-[var(--shadow-elevated)] backdrop-blur-sm transition-colors hover:border-primary/60 hover:bg-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            aria-label={sidebarOpen ? "关闭目录" : "打开目录"}
            aria-expanded={sidebarOpen}
            aria-controls="article-toc-sidebar"
          >
            <PixelMenuIcon isOpen={sidebarOpen} />
          </button>
        </div>

        <div className="relative flex flex-row">
          {/* Mobile TOC sidebar */}
          <aside
            id="article-toc-sidebar"
            className={cn(
              "fixed inset-y-0 left-0 z-30 border-r-2 border-border/60 bg-background/95 backdrop-blur-sm transition-all duration-200 ease-out lg:hidden",
              "w-[min(280px,85vw)]",
              sidebarOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            )}
          >
            <div className="h-full overflow-y-auto p-4">
              <TableOfContent
                headings={article.headings}
                className="!max-h-[calc(100dvh-3.5rem)]"
                viewportClassName="!max-h-full"
              />
            </div>
          </aside>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 touch-none bg-background/80 backdrop-blur-sm transition-opacity duration-200 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          <Grid columns={{ initial: "1", lg: "5" }} gap="5" className="relative flex-1">
            <Box className="min-w-0 lg:col-span-4">
              <div className="mb-10 md:mb-14">
                <div className="terminal-label mb-3">article detail</div>
                <h1 className="font-pixel mb-5 text-[clamp(2rem,4vw,3.4rem)] uppercase leading-[1.08] tracking-[0.05em] text-foreground">
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <RetroBadge tone="amber">{article.publishedOn}</RetroBadge>
                  <RetroBadge tone="primary">MDX POC</RetroBadge>
                  <RetroBadge tone="neutral">{article.locale}</RetroBadge>
                </div>
              </div>
              <div className={styles.article}>
                <ArticleBody
                  slug={article.slug}
                  htmlContent={article.htmlContent}
                  headings={article.headings}
                />
              </div>
              <ArticleFooter />
            </Box>
            <Box className="hidden lg:block lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <TableOfContent headings={article.headings} />
              </div>
            </Box>
          </Grid>
        </div>
      </div>
    </Container>
  )
}
