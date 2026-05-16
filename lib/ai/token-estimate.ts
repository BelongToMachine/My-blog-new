import type { UIMessage } from "ai"
import { trimMessages } from "./context-window"

export type TokenRisk = "low" | "medium" | "high"

export interface TokenEstimate {
  estimatedPromptTokens: number
  estimatedOutputTokens: number
  estimatedTotalTokens: number
  risk: TokenRisk
}

/* ─── Heuristic constants ─── */

const SYSTEM_PROMPT_TOKENS = 800
const SUMMARY_TOKENS = 120
const CHARS_PER_TOKEN = 1.5 // CJK-mixed conservative estimate
const MAX_SAFE_PROMPT_TOKENS = 12000
const MAX_HARD_PROMPT_TOKENS = 16000
const DEFAULT_OUTPUT_TOKENS = 1000

/* ─── Estimation ─── */

export function estimateTokens({
  messages,
  summary,
  pendingInput,
  outputTokens = DEFAULT_OUTPUT_TOKENS,
}: {
  messages: UIMessage[]
  summary?: string
  pendingInput?: string
  outputTokens?: number
}): TokenEstimate {
  const normalizedPendingInput = pendingInput?.trim() ?? ""
  const estimatedMessages =
    normalizedPendingInput.length > 0
      ? [
          ...messages,
          {
            id: "pending-input",
            role: "user",
            parts: [{ type: "text", text: normalizedPendingInput }],
          } as UIMessage,
        ]
      : messages

  const trimmedMessages = trimMessages(estimatedMessages)

  const text = trimmedMessages
    .flatMap((m) =>
      m.parts
        .filter((p) => typeof p === "object" && p !== null && (p as { type?: string }).type === "text")
        .map((p) => (p as { text?: string }).text ?? ""),
    )
    .join("")

  const promptTokens =
    SYSTEM_PROMPT_TOKENS +
    (summary ? SUMMARY_TOKENS : 0) +
    Math.ceil(text.length / CHARS_PER_TOKEN)

  const totalTokens = promptTokens + outputTokens

  let risk: TokenRisk = "low"
  if (promptTokens > MAX_HARD_PROMPT_TOKENS) {
    risk = "high"
  } else if (promptTokens > MAX_SAFE_PROMPT_TOKENS) {
    risk = "medium"
  }

  return {
    estimatedPromptTokens: promptTokens,
    estimatedOutputTokens: outputTokens,
    estimatedTotalTokens: totalTokens,
    risk,
  }
}

/* ─── Formatting ─── */

export function formatTokenCount(n: number): string {
  if (n >= 1000) {
    return `~${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`
  }
  return `~${n}`
}

export function getRiskLabel(risk: TokenRisk): string {
  switch (risk) {
    case "low":
      return "偏低"
    case "medium":
      return "接近上限，建议开始新对话"
    case "high":
      return "输入过长，请精简后再发送"
  }
}

export function getRiskLabelEn(risk: TokenRisk): string {
  switch (risk) {
    case "low":
      return "Low"
    case "medium":
      return "Near limit — consider starting a new chat"
    case "high":
      return "Input too long — please shorten before sending"
  }
}
