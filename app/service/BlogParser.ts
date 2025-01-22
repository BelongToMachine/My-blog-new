import { Issue } from "@prisma/client"
import MarkdownIt from "markdown-it"
import { v4 as uuidv4 } from "uuid"

interface ArticleHeader {
  title: string
  date: string
  author: string
}

export interface Heading {
  text: string
  level: number
  id: string
}

interface Props {
  tocPoisition: React.CSSProperties
  issue: Issue
}

class Parser {}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

md.renderer.rules.heading_open = (tokens, idx) => {
  const token = tokens[idx]
  const level = token.tag.slice(1)
  const content = tokens[idx + 1].content
  const id = uuidv4()

  token.attrSet("id", id)
  return `<h${level} id="${id}">${content}</h${level}>`
}

const extractHeadings = (htmlContent: string): Heading[] => {
  const headingRegex = /<h([2])\s*(?:id="([^"]*)")?[^>]*>([^<]+)<\/h\1>/g
  const headings: Heading[] = []
  let match

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const [, levelStr, existingId, text] = match
    const level = parseInt(levelStr)
    const id = existingId || `heading-${headings.length}`

    headings.push({
      text: text.trim(),
      level,
      id,
    })
  }

  return headings
}
