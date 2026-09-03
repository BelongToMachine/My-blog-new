import matter from "gray-matter"
import { Window } from "happy-dom"
import MarkdownIt from "markdown-it"
import { renderArticleCodeBlock } from "@/app/service/articleCodeHighlight"
import { toTitleCase } from "@/app/lib/mapper"

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

function transformHeadings(tokens: MarkdownToken[], md: MarkdownIt) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.type !== "heading_open") continue

    const inlineToken = tokens[i + 1]
    if (!inlineToken || inlineToken.type !== "inline") continue

    const original = inlineToken.content.trim()

    // Check if children are all plain text/softbreak
    const hasComplexChildren = inlineToken.children?.some(
      (child) => child.type !== "text" && child.type !== "softbreak"
    )

    if (!hasComplexChildren) {
      // Plain text heading: transform whole content and re-parse
      const transformed = toTitleCase(original)
      if (transformed !== original) {
        inlineToken.content = transformed
        inlineToken.children = md.parseInline(transformed, {})
      }
    } else if (inlineToken.children) {
      // Complex heading: transform individual text nodes only
      // This preserves inline markup (code, links, bold, etc.)
      let changed = false
      for (const child of inlineToken.children) {
        if (child.type === "text") {
          const transformed = toTitleCase(child.content)
          if (transformed !== child.content) {
            child.content = transformed
            changed = true
          }
        }
      }
      if (changed) {
        // Rebuild content approximately for downstream consumers (e.g. TOC extraction)
        inlineToken.content = inlineToken.children
          .map((c) => (c.type === "softbreak" ? " " : c.content))
          .join("")
      }
    }
  }
}

function createHeadingId(text: string, usedIds: Set<string>) {
  const base =
    text
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "section"

  let id = base
  let suffix = 2
  while (usedIds.has(id)) {
    id = `${base}-${suffix}`
    suffix += 1
  }

  usedIds.add(id)
  return id
}

function extractHeadings(tokens: MarkdownToken[]) {
  const headings: Heading[] = []
  const usedIds = new Set<string>()

  tokens.forEach((token, index) => {
    if (token.type !== "heading_open" || token.tag !== "h2") {
      return
    }

    const inlineToken = tokens[index + 1]
    // Content already transformed by transformHeadings; apply toTitleCase as a final guard.
    const text = toTitleCase(inlineToken?.content?.trim() ?? "")

    if (!text) {
      return
    }

    const id = createHeadingId(text, usedIds)
    token.attrSet("id", id)

    headings.push({
      text,
      level: 2,
      id,
    })
  })

  return headings
}

function validateArticleAccessibility(tokens: MarkdownToken[]) {
  const warnings: string[] = []
  let previousHeadingLevel = 0
  let h1Count = 0
  let currentTable: { index: number; hasHeader: boolean } | null = null
  const vagueLinkText = new Set([
    "click here",
    "here",
    "read more",
    "learn more",
    "点击这里",
    "这里",
    "更多",
    "阅读更多",
  ])

  tokens.forEach((token, index) => {
    if (token.type === "heading_open") {
      const level = Number(token.tag.slice(1))

      if (level === 1) h1Count += 1
      if (previousHeadingLevel && level > previousHeadingLevel + 1) {
        warnings.push(`heading level jumps from h${previousHeadingLevel} to h${level}`)
      }
      previousHeadingLevel = level
    }

    if (token.type === "image" && token.attrGet("alt") === null) {
      warnings.push(`image at token ${index} is missing an alt attribute`)
    }

    if (token.type === "link_open") {
      const inlineToken = tokens[index + 1]
      const linkText = inlineToken?.type === "inline" ? inlineToken.content.trim() : ""
      if (!linkText) warnings.push(`link at token ${index} has no accessible text`)
      if (vagueLinkText.has(linkText.toLowerCase())) {
        warnings.push(`link at token ${index} uses vague text: ${linkText}`)
      }
      if (/^https?:\/\//i.test(linkText)) {
        warnings.push(`link at token ${index} exposes a bare URL as its text`)
      }
    }

    if (token.type === "table_open") {
      currentTable = { index, hasHeader: false }
    }
    if (token.type === "th_open" && currentTable) {
      currentTable.hasHeader = true
    }
    if (token.type === "table_close" && currentTable) {
      if (!currentTable.hasHeader) {
        warnings.push(`table at token ${currentTable.index} has no header row`)
      }
      currentTable = null
    }

    if (token.type === "html_block" || token.type === "html_inline") {
      const mediaTags = Array.from(token.content.matchAll(/<(iframe|video|audio)\b([^>]*)>/gi))
      mediaTags.forEach(([, tagName, rawAttributes]) => {
        const attributes = rawAttributes ?? ""
        const hasAccessibleName = /\b(?:title|aria-label|aria-labelledby)\s*=/i.test(
          attributes,
        )
        if (!hasAccessibleName) {
          warnings.push(`${tagName} at token ${index} is missing an accessible name`)
        }
      })
    }
  })

  if (h1Count > 1) warnings.push(`article contains ${h1Count} h1 headings`)

  if (warnings.length) {
    console.warn(
      `[BlogParser] Accessibility warnings:\n${warnings
        .slice(0, 10)
        .map((warning) => `- ${warning}`)
        .join("\n")}`,
    )
  }
}

const allowedArticleTags = new Set([
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "button",
  "caption",
  "code",
  "del",
  "details",
  "div",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "iframe",
  "img",
  "kbd",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "s",
  "section",
  "small",
  "span",
  "strong",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
  "video",
  "audio",
  "source",
  "track",
])

const globalArticleAttributes = new Set([
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-hidden",
  "class",
  "data-code",
  "data-copy-error-label",
  "data-copy-label",
  "data-language",
  "data-line-count",
  "data-title",
  "dir",
  "id",
  "lang",
  "role",
  "title",
])

const articleAttributesByTag: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel", "download"]),
  audio: new Set(["controls", "preload", "src"]),
  iframe: new Set(["allow", "allowfullscreen", "height", "loading", "referrerpolicy", "sandbox", "src", "width"]),
  img: new Set(["alt", "height", "loading", "src", "srcset", "width"]),
  source: new Set(["media", "src", "type"]),
  button: new Set(["type"]),
  td: new Set(["colspan", "headers", "rowspan"]),
  th: new Set(["colspan", "headers", "rowspan", "scope"]),
  track: new Set(["default", "kind", "label", "src", "srclang"]),
  video: new Set(["controls", "height", "loop", "muted", "poster", "preload", "src", "width"]),
}

function isSafeArticleUrl(value: string) {
  const normalized = value.trim().toLowerCase()
  return (
    normalized.startsWith("/") ||
    normalized.startsWith("#") ||
    normalized.startsWith("./") ||
    normalized.startsWith("../") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("mailto:") ||
    normalized.startsWith("tel:")
  )
}

function isSafeArticleStyle(value: string) {
  return !/(?:url|expression|javascript|behavior)\s*\(|@import/i.test(value)
}

function sanitizeArticleHtml(html: string) {
  const window = new Window()
  const document = window.document
  const container = document.createElement("div")
  container.innerHTML = html

  container.querySelectorAll("*").forEach((element) => {
    const tagName = element.tagName.toLowerCase()

    if (!allowedArticleTags.has(tagName)) {
      if (["script", "style", "object", "embed", "form", "input", "textarea"].includes(tagName)) {
        element.remove()
      } else {
        element.replaceWith(...Array.from(element.childNodes))
      }
      return
    }

    const allowedAttributes = new Set([
      ...Array.from(globalArticleAttributes),
      ...Array.from(articleAttributesByTag[tagName] ?? []),
    ])
    const attributes: Attr[] = []
    for (let attributeIndex = 0; attributeIndex < element.attributes.length; attributeIndex += 1) {
      const attribute = element.attributes.item(attributeIndex)
      if (attribute) attributes.push(attribute)
    }
    attributes.forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase()
      const isEventHandler = attributeName.startsWith("on")
      const isAllowed = allowedAttributes.has(attributeName)
      const isUrlAttribute = ["href", "src", "srcset", "poster"].includes(attributeName)
      const isStyleAttribute = attributeName === "style"
      const isUnsafeIframeSource =
        tagName === "iframe" &&
        attributeName === "src" &&
        !attribute.value.trim().toLowerCase().startsWith("https://")

      if (
        isEventHandler ||
        (!isAllowed && !(isStyleAttribute && ["pre", "span"].includes(tagName))) ||
        (isUrlAttribute && !isSafeArticleUrl(attribute.value)) ||
        isUnsafeIframeSource ||
        (isStyleAttribute && !isSafeArticleStyle(attribute.value))
      ) {
        element.removeAttribute(attribute.name)
      }
    })

    if (tagName === "a" && element.getAttribute("target") === "_blank") {
      const rel = new Set((element.getAttribute("rel") ?? "").split(/\s+/).filter(Boolean))
      rel.add("noopener")
      rel.add("noreferrer")
      element.setAttribute("rel", Array.from(rel).join(" "))
    }
  })

  const sanitized = container.innerHTML
  window.close()
  return sanitized
}

async function renderMarkdown(content: string, locale = "zh") {
  const md = createMarkdownParser()
  const tokens = md.parse(content, {})
  transformHeadings(tokens, md)
  validateArticleAccessibility(tokens)
  const headings = extractHeadings(tokens)
  const highlightedBlocks = new Map<number, string>()
  const defaultFenceRenderer = md.renderer.rules.fence
  const defaultCodeBlockRenderer = md.renderer.rules.code_block

  const codeBlockTokens = tokens
    .map((token, index) => ({ token, index }))
    .filter(({ token }) => token.type === "fence" || token.type === "code_block")

  const renderedBlocks = await Promise.all(
    codeBlockTokens.map(async ({ token, index }) => [
      index,
      await renderArticleCodeBlock(
        token.content,
        token.type === "fence" ? token.info : "",
        locale,
      ),
    ] as const)
  )

  renderedBlocks.forEach(([index, html]) => {
    highlightedBlocks.set(index, html)
  })

  md.renderer.rules.fence = (currentTokens, idx, options, env, self) => {
    const html = highlightedBlocks.get(idx)
    if (html) return html
    return defaultFenceRenderer?.(currentTokens, idx, options, env, self) ?? self.renderToken(currentTokens, idx, options)
  }

  md.renderer.rules.code_block = (currentTokens, idx, options, env, self) => {
    const html = highlightedBlocks.get(idx)
    if (html) return html
    return defaultCodeBlockRenderer?.(currentTokens, idx, options, env, self) ?? self.renderToken(currentTokens, idx, options)
  }

  return {
    htmlContent: sanitizeArticleHtml(md.renderer.render(tokens, md.options, {})),
    headings,
  }
}

class BlogParser {
  constructor(private blog: string) {}

  public async getParserdContent(locale = "zh") {
    const { data, content } = matter(this.blog)
    const { htmlContent, headings } = await renderMarkdown(content, locale)

    return {
      header: data as ArticleHeader,
      htmlContent,
      headings,
    }
  }
}

export default BlogParser
type MarkdownToken = MarkdownIt.Token
