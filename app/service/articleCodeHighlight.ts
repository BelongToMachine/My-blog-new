import { bundledLanguages, getSingletonHighlighter } from "shiki"

const ARTICLE_CODE_THEMES = {
  light: "github-light",
  dark: "andromeeda",
} as const

const languageAliasMap: Record<string, string> = {
  shell: "bash",
  zsh: "bash",
  env: "bash",
  yml: "yaml",
  md: "markdown",
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function extractFenceMetadata(info: string) {
  const trimmedInfo = info.trim()
  const rawLanguage = trimmedInfo.split(/\s+/)[0]?.toLowerCase() ?? ""
  const aliasedLanguage = languageAliasMap[rawLanguage] ?? rawLanguage
  const titleMatch = trimmedInfo.match(
    /(?:title|filename|file)=("([^"]+)"|'([^']+)'|([^\s]+))/i
  )
  const title = titleMatch?.[2] ?? titleMatch?.[3] ?? titleMatch?.[4] ?? ""

  if (!aliasedLanguage) {
    return {
      language: "text",
      title,
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(bundledLanguages, aliasedLanguage) ||
    ["text", "txt", "plaintext", "plain"].includes(aliasedLanguage)
  ) {
    return {
      language: aliasedLanguage,
      title,
    }
  }

  return {
    language: "text",
    title,
  }
}

async function getArticleCodeHighlighter() {
  return getSingletonHighlighter({
    themes: [ARTICLE_CODE_THEMES.light, ARTICLE_CODE_THEMES.dark],
    langs: ["text"],
  })
}

export async function renderArticleCodeBlock(code: string, info: string) {
  const highlighter = await getArticleCodeHighlighter()
  const { language, title } = extractFenceMetadata(info)

  await highlighter.loadLanguage(language as any)

  const highlightedHtml = highlighter.codeToHtml(code, {
    lang: language as any,
    themes: {
      light: ARTICLE_CODE_THEMES.light,
      dark: ARTICLE_CODE_THEMES.dark,
    },
  })

  return [
    `<div class="article-code-shell" data-language="${escapeHtml(language)}"${
      title ? ` data-title="${escapeHtml(title)}"` : ""
    }>`,
    '<div class="article-code-meta">',
    '<div class="article-code-traffic" aria-hidden="true">',
    '<span class="article-code-dot article-code-dot--rose"></span>',
    '<span class="article-code-dot article-code-dot--amber"></span>',
    '<span class="article-code-dot article-code-dot--green"></span>',
    "</div>",
    title ? `<span class="article-code-title">${escapeHtml(title)}</span>` : '<span class="article-code-title">snippet</span>',
    `<span class="article-code-label">${escapeHtml(language)}</span>`,
    "</div>",
    highlightedHtml,
    "</div>",
  ].join("")
}
