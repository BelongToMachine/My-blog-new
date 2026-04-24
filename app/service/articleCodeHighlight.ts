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
    `<button class="article-code-copy" data-code="${escapeHtml(code)}" onclick="navigator.clipboard.writeText(this.dataset.code).then(()=>{this.classList.add('is-copied');setTimeout(()=>this.classList.remove('is-copied'),1500)})" aria-label="复制代码">copy</button>`,
    highlightedHtml,
    "</div>",
  ].join("")
}
