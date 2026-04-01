import NextjsRenderingInlineBlock from "./NextjsRenderingInlineBlock"
import styles from "@/app/blogs/[id]/post.module.css"
import type { Heading } from "@/app/service/BlogParser"

interface ArticleBodyProps {
  slug: string
  htmlContent: string
  headings: Heading[]
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

export default function ArticleBody({ slug, htmlContent, headings }: ArticleBodyProps) {
  const sections = splitHtmlByHeadings(htmlContent, headings)

  return (
    <div className={styles.articleFlow}>
      {sections.map((section) => (
        <div key={section.key} className={styles.articleSection}>
          <div
            id={section.key === "intro" ? "post-content" : undefined}
            className="post-content"
            dangerouslySetInnerHTML={{ __html: section.html }}
          />
          <NextjsRenderingInlineBlock slug={slug} sectionKey={section.key} headingText={section.headingText} />
        </div>
      ))}
    </div>
  )
}
