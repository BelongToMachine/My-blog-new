import matter from "gray-matter"
import MarkdownIt from "markdown-it"
import { v4 as uuidv4 } from "uuid"
import { renderArticleCodeBlock } from "@/app/service/articleCodeHighlight"

export interface ArticleHeader {
  title: string
  date: string
  author: string
}

export interface Heading {
  text: string
  level: number
  id: string
}

function createMarkdownParser() {
  return new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })
}

function extractHeadings(tokens: MarkdownToken[]) {
  const headings: Heading[] = []

  tokens.forEach((token, index) => {
    if (token.type !== "heading_open" || token.tag !== "h2") {
      return
    }

    const id = uuidv4()
    const inlineToken = tokens[index + 1]
    const text = inlineToken?.content?.trim()

    token.attrSet("id", id)

    if (!text) {
      return
    }

    headings.push({
      text,
      level: 2,
      id,
    })
  })

  return headings
}

async function renderMarkdown(content: string) {
  const md = createMarkdownParser()
  const tokens = md.parse(content, {})
  const headings = extractHeadings(tokens)
  const highlightedBlocks = new Map<number, string>()
  const defaultFenceRenderer = md.renderer.rules.fence

  const fenceTokens = tokens
    .map((token, index) => ({ token, index }))
    .filter(({ token }) => token.type === "fence")

  const renderedBlocks = await Promise.all(
    fenceTokens.map(async ({ token, index }) => [
      index,
      await renderArticleCodeBlock(token.content, token.info),
    ] as const)
  )

  renderedBlocks.forEach(([index, html]) => {
    highlightedBlocks.set(index, html)
  })

  md.renderer.rules.fence = (currentTokens, idx, options, env, self) => {
    return (
      highlightedBlocks.get(idx) ??
      defaultFenceRenderer?.(currentTokens, idx, options, env, self) ??
      self.renderToken(currentTokens, idx, options)
    )
  }

  return {
    htmlContent: md.renderer.render(tokens, md.options, {}),
    headings,
  }
}

class BlogParser {
  constructor(private blog: string) {}

  public async getParserdContent() {
    const { data, content } = matter(this.blog)
    const { htmlContent, headings } = await renderMarkdown(content)

    return {
      header: data as ArticleHeader,
      htmlContent,
      headings,
    }
  }
}

export default BlogParser
type MarkdownToken = MarkdownIt.Token
