"use client"

import { useEffect, useRef } from "react"
import AiAgentInlineBlock from "./AiAgentInlineBlock"
import NextjsRenderingInlineBlock from "./NextjsRenderingInlineBlock"
import styles from "@/app/articles/post.module.css"
import type { Heading } from "@/app/service/BlogParser"

interface ArticleBodyProps {
  slug: string
  htmlContent: string
  headings: Heading[]
  locale?: string
}

interface ArticleSection {
  key: string
  headingText?: string
  html: string
}

function splitHtmlByHeadings(htmlContent: string, headings: Heading[]): ArticleSection[] {
  const articleHeadings = headings.filter((heading) => heading.level === 2)

  if (!articleHeadings.length) {
    return [{ key: "body", html: htmlContent }]
  }

  const sections: ArticleSection[] = []
  let cursor = 0

  articleHeadings.forEach((heading, index) => {
    const anchorToken = `id="${heading.id}"`
    const headingAnchorIndex = htmlContent.indexOf(anchorToken, cursor)

    if (headingAnchorIndex === -1) {
      return
    }

    const headingStartIndex = htmlContent.lastIndexOf("<h2", headingAnchorIndex)

    if (headingStartIndex === -1) {
      return
    }

    if (headingStartIndex > cursor) {
      sections.push({
        key: index === 0 ? "intro" : `section-gap-${index}`,
        html: htmlContent.slice(cursor, headingStartIndex),
      })
    }

    const nextHeading = articleHeadings[index + 1]
    const nextAnchorIndex = nextHeading
      ? htmlContent.indexOf(`id="${nextHeading.id}"`, headingStartIndex + 1)
      : -1
    const sectionEndIndex =
      nextAnchorIndex === -1 ? htmlContent.length : htmlContent.lastIndexOf("<h2", nextAnchorIndex)

    sections.push({
      key: heading.id,
      headingText: heading.text,
      html: htmlContent.slice(headingStartIndex, sectionEndIndex === -1 ? htmlContent.length : sectionEndIndex),
    })

    cursor = sectionEndIndex === -1 ? htmlContent.length : sectionEndIndex
  })

  if (cursor < htmlContent.length) {
    sections.push({
      key: "tail",
      html: htmlContent.slice(cursor),
    })
  }

  return sections.filter((section) => section.html.trim().length > 0)
}

export default function ArticleBody({
  slug,
  htmlContent,
  headings,
  locale = "zh",
}: ArticleBodyProps) {
  const sections = splitHtmlByHeadings(htmlContent, headings)
  const articleRef = useRef<HTMLDivElement>(null)
  const copyStatusRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = articleRef.current
    if (!root) return

    const fallbackLabels =
      locale.startsWith("en")
        ? { copy: "Copy code", error: "Copy failed" }
        : { copy: "复制代码", error: "复制失败" }
    const buttons = Array.from(
      root.querySelectorAll<HTMLButtonElement>(".article-code-copy"),
    )
    const timeoutIds: number[] = []

    const cleanups = buttons.map((button) => {
      const originalText = button.textContent || fallbackLabels.copy
      const copyLabel = button.dataset.copyLabel || fallbackLabels.copy
      const errorLabel =
        button.dataset.copyErrorLabel || fallbackLabels.error

      button.setAttribute("aria-label", copyLabel)

      const handleCopy = async () => {
        try {
          if (!navigator.clipboard) throw new Error("Clipboard unavailable")
          await navigator.clipboard.writeText(button.dataset.code || "")
          button.classList.add("is-copied")
          button.textContent = ""
          button.setAttribute("aria-label", copyLabel)
          if (copyStatusRef.current) {
            copyStatusRef.current.textContent = "✓"
          }
        } catch {
          button.classList.remove("is-copied")
          button.textContent = errorLabel
          button.setAttribute("aria-label", errorLabel)
          if (copyStatusRef.current) {
            copyStatusRef.current.textContent = errorLabel
          }
        }

        const timeoutId = window.setTimeout(() => {
          button.classList.remove("is-copied")
          button.textContent = originalText
          button.setAttribute("aria-label", copyLabel)
          if (copyStatusRef.current) {
            copyStatusRef.current.textContent = ""
          }
        }, 1500)
        timeoutIds.push(timeoutId)
      }

      button.addEventListener("click", handleCopy)
      return () => button.removeEventListener("click", handleCopy)
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [htmlContent, locale])

  return (
    <div ref={articleRef} className={styles.articleFlow}>
      {sections.map((section) => (
        <div key={section.key} className={styles.articleSection}>
          <div
            id={section.key === "intro" ? "post-content" : undefined}
            className="post-content"
            dangerouslySetInnerHTML={{ __html: section.html }}
          />
          <NextjsRenderingInlineBlock slug={slug} sectionKey={section.key} headingText={section.headingText} />
          <AiAgentInlineBlock slug={slug} sectionKey={section.key} headingText={section.headingText} />
        </div>
      ))}
      <span
        ref={copyStatusRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  )
}
