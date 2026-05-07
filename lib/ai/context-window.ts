import type { UIMessage } from "ai"

export interface ContextWindowConfig {
  maxRecentMessages: number
  maxOutputTokens: number
}

export const DEFAULT_CONTEXT_CONFIG: ContextWindowConfig = {
  maxRecentMessages: 12, // ~6 turns (user + assistant)
  maxOutputTokens: 1000,
}

export interface ThreadContextState {
  summary?: string
  summarySourceMessageId?: string
  summaryUpdatedAt?: number
  recentWindowMessageIds: string[]
}

const INITIAL_SUMMARY_TRIGGER_MESSAGES = 8
const SUMMARY_REFRESH_AFTER_NEW_MESSAGES = 4
const SUMMARY_TRIGGER_TOKENS = 8000

/* ─── Message trimming ─── */

export function trimMessages(
  messages: UIMessage[],
  config: Partial<ContextWindowConfig> = {},
): UIMessage[] {
  const { maxRecentMessages = DEFAULT_CONTEXT_CONFIG.maxRecentMessages } = config

  if (messages.length <= maxRecentMessages) return messages

  // Keep the most recent messages; UIMessages don't carry explicit system messages,
  // so we simply slice from the end.
  return messages.slice(-maxRecentMessages)
}

/* ─── Context assembly ─── */

export function assembleContextWindow({
  messages,
  summary,
  config,
}: {
  messages: UIMessage[]
  summary?: string
  config?: Partial<ContextWindowConfig>
}): UIMessage[] {
  const trimmed = trimMessages(messages, config)

  if (!summary) return trimmed

  const summaryMessage: UIMessage = {
    id: `context-summary-${summary.length}`,
    role: "user",
    parts: [
      {
        type: "text",
        text: `[对话摘要]\n${summary}`,
      },
    ],
  }

  return [summaryMessage, ...trimmed]
}

/* ─── Threshold checks ─── */

export function shouldTriggerSummary({
  messages,
  contextState,
}: {
  messages: UIMessage[]
  contextState?: ThreadContextState
}): boolean {
  const totalChars = messages
    .flatMap((m) =>
      m.parts
        .filter(
          (p) =>
            typeof p === "object" &&
            p !== null &&
            (p as { type?: string }).type === "text",
        )
        .map((p) => (p as { text?: string }).text ?? ""),
    )
    .join("").length

  // Rough heuristic: 1 token ~= 1.5 chars for CJK-mixed text
  const estimatedTokens = Math.ceil(totalChars / 1.5)

  if (!contextState?.summary) {
    return (
      messages.length > INITIAL_SUMMARY_TRIGGER_MESSAGES ||
      estimatedTokens > SUMMARY_TRIGGER_TOKENS
    )
  }

  if (contextState.recentWindowMessageIds.length > 0) {
    const recentIds = new Set(contextState.recentWindowMessageIds)
    const newMessagesCount = messages.filter((m) => !recentIds.has(m.id)).length

    if (newMessagesCount >= SUMMARY_REFRESH_AFTER_NEW_MESSAGES) {
      return true
    }
  }

  return estimatedTokens > SUMMARY_TRIGGER_TOKENS
}
