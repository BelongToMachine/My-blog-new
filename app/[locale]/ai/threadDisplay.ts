import type { ChatThread } from "@/app/hooks/useChatThreads"

export interface ThreadDisplayLabels {
  defaultTitle: string
  greetingTitle: string
  aboutJieTitle: string
}

const GREETING_PATTERNS = [
  /^hi[!.?\s]*$/i,
  /^hello[!.?\s]*$/i,
  /^hey[!.?\s]*$/i,
  /^yo[!.?\s]*$/i,
  /^greetings[!.?\s]*$/i,
  /^你好[！!，,\s]*$/,
  /^您好[！!，,\s]*$/,
  /^嗨[！!，,\s]*$/,
  /^哈喽[！!，,\s]*$/,
]

const ABOUT_JIE_PATTERNS = [
  /tell me about jie/i,
  /about jie/i,
  /introduce jie/i,
  /who is jie/i,
  /portfolio intro/i,
  /关于\s*jie/,
  /介绍\s*jie/,
  /介绍一下\s*jie/,
  /介绍下\s*jie/,
  /聊聊\s*jie/,
]

const NEW_CHAT_PATTERNS = [
  /^new chat$/i,
  /^new conversation$/i,
  /^新建对话$/,
  /^新对话$/,
]

const ALL_CAPS_LATIN_PATTERN = /^[A-Z0-9\s"'!?.,:&/+-]+$/

function normalizeTitle(raw: string | undefined): string {
  return raw?.replace(/\s+/g, " ").trim() ?? ""
}

function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((segment) => {
      if (!segment) return segment
      return segment.charAt(0).toUpperCase() + segment.slice(1)
    })
    .join(" ")
}

export function deriveThreadDisplayTitle(
  thread: Pick<ChatThread, "title" | "summary">,
  labels: ThreadDisplayLabels,
): string {
  const summary = normalizeTitle(thread.summary)
  if (summary) return summary

  const title = normalizeTitle(thread.title)
  if (!title) return labels.defaultTitle

  if (NEW_CHAT_PATTERNS.some((pattern) => pattern.test(title))) {
    return labels.defaultTitle
  }

  if (GREETING_PATTERNS.some((pattern) => pattern.test(title))) {
    return labels.greetingTitle
  }

  if (ABOUT_JIE_PATTERNS.some((pattern) => pattern.test(title))) {
    return labels.aboutJieTitle
  }

  if (ALL_CAPS_LATIN_PATTERN.test(title)) {
    return toTitleCase(title)
  }

  return title
}
