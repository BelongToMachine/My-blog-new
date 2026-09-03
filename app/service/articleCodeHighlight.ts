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

const CODE_COPY_LABELS = {
  zh: {
    copy: "复制代码",
    visibleCopy: "copy",
    error: "复制失败",
  },
  en: {
    copy: "Copy code",
    visibleCopy: "copy",
    error: "Copy failed",
  },
} as const

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

export async function renderArticleCodeBlock(
  code: string,
  info: string,
  locale: string = "zh",
) {
  const highlighter = await getArticleCodeHighlighter()
  const { language, title } = extractFenceMetadata(info)
  const labels = locale.startsWith("en") ? CODE_COPY_LABELS.en : CODE_COPY_LABELS.zh

  await highlighter.loadLanguage(language as any)

  const trimmedCode = code.trimEnd()
  const lineCount = trimmedCode.split("\n").length

  let highlightedHtml = highlighter.codeToHtml(trimmedCode, {
    lang: language as any,
    themes: {
      light: ARTICLE_CODE_THEMES.light,
      dark: ARTICLE_CODE_THEMES.dark,
    },
  })

  // Override Shiki's background with transparent so the shell grid always shows through.
  // Inline !important beats both Shiki's inline style and its injected <style> rules.
  highlightedHtml = highlightedHtml.replace(
    /(<pre\b[^>]*style=")([^"]*)(")/,
    '$1$2;background:transparent !important;$3'
  )

  return [
    `<div class="article-code-shell" data-language="${escapeHtml(language)}" data-line-count="${lineCount}"${
      title ? ` data-title="${escapeHtml(title)}"` : ""
    }>`,
    `<button type="button" class="article-code-copy" data-code="${escapeHtml(code)}" data-copy-label="${escapeHtml(labels.copy)}" data-copy-error-label="${escapeHtml(labels.error)}" aria-label="${escapeHtml(labels.copy)}">${escapeHtml(labels.visibleCopy)}</button>`,
    highlightedHtml,
    "</div>",
  ].join("")
}
