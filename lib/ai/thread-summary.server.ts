import { generateText, type UIMessage } from "ai"
import { getModel } from "./providers"
import type { ThreadContextState } from "./context-window"

const SUMMARY_SYSTEM_PROMPT = `
You are a conversation summarizer. Your job is to compress a chat history into a concise factual summary that preserves:
- The user's main questions and intent
- Key facts, preferences, and conclusions already established
- What topics have been discussed

Rules:
- Chinese: 50-120 characters
- English: 80-160 characters
- Keep only facts, preferences, confirmed conclusions
- Do NOT keep emotional greetings, small talk, or apologies
- Do NOT include code blocks, full tool outputs, or reasoning chains
- Output plain text only, no markdown
`.trim()

const SUMMARY_MAX_TOKENS = 180

export async function generateThreadSummary(
  messages: UIMessage[],
): Promise<string> {
  const model = getModel()

  // Build a simple text representation of the conversation
  const conversation = messages
    .map((m) => {
      const role = m.role === "user" ? "User" : "Assistant"
      const text = m.parts
        .filter((p) => typeof p === "object" && p !== null && (p as { type?: string }).type === "text")
        .map((p) => (p as { text?: string }).text ?? "")
        .join("\n")
      return `${role}: ${text}`
    })
    .join("\n\n")

  const { text } = await generateText({
    model,
    system: SUMMARY_SYSTEM_PROMPT,
    prompt: `Summarize the following conversation:\n\n${conversation}`,
    maxOutputTokens: SUMMARY_MAX_TOKENS,
  })

  return text.trim()
}

export function buildContextState({
  messages,
  summary,
}: {
  messages: UIMessage[]
  summary: string
}): ThreadContextState {
  const recentWindowMessageIds = messages.slice(-12).map((m) => m.id)
  return {
    summary,
    summarySourceMessageId: messages[messages.length - 1]?.id,
    summaryUpdatedAt: Date.now(),
    recentWindowMessageIds,
  }
}
