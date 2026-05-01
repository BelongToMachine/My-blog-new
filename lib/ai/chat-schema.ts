import { z } from "zod"
import type { UIMessage } from "ai"

export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.string().min(1),
        role: z.enum(["user", "assistant"]),
        parts: z.array(z.any()).default([]),
      }),
    )
    .min(1, "messages must contain at least one message")
    .max(50, "too many messages"),
  threadId: z.string().min(1).optional(),
})

export type ChatRequest = {
  messages: UIMessage[]
  threadId?: string
}

/* ─── Validation helpers ─── */

const MAX_SINGLE_MESSAGE_CHARS = 6000
const MAX_TOTAL_TEXT_CHARS = 16000
const MAX_MESSAGES_COUNT = 50

export function validateChatRequest(body: unknown): {
  ok: true
  data: ChatRequest
} | {
  ok: false
  error: string
  status: number
} {
  const parsed = chatRequestSchema.safeParse(body)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors.map((e) => e.message).join("; "),
      status: 400,
    }
  }

  const { messages } = parsed.data

  // Must end with a user message
  const last = messages[messages.length - 1]
  if (last.role !== "user") {
    return {
      ok: false,
      error: "last message must be from user",
      status: 400,
    }
  }

  // Single message length check
  for (const msg of messages) {
    const textParts = msg.parts
      .filter((p) => typeof p === "object" && p !== null && (p as { type?: string }).type === "text")
    const text = textParts.map((p) => (p as { text?: string }).text ?? "").join("")
    if (text.length > MAX_SINGLE_MESSAGE_CHARS) {
      return {
        ok: false,
        error: `single message exceeds ${MAX_SINGLE_MESSAGE_CHARS} characters`,
        status: 413,
      }
    }
  }

  // Total text size check
  const totalText = messages
    .flatMap((msg) =>
      msg.parts
        .filter((p) => typeof p === "object" && p !== null && (p as { type?: string }).type === "text")
        .map((p) => (p as { text?: string }).text ?? ""),
    )
    .join("")

  if (totalText.length > MAX_TOTAL_TEXT_CHARS) {
    return {
      ok: false,
      error: `total context exceeds ${MAX_TOTAL_TEXT_CHARS} characters`,
      status: 413,
    }
  }

  if (messages.length > MAX_MESSAGES_COUNT) {
    return {
      ok: false,
      error: `too many messages (max ${MAX_MESSAGES_COUNT})`,
      status: 413,
    }
  }

  return { ok: true, data: parsed.data }
}

export function getLastUserText(messages: ChatRequest["messages"]): string {
  const last = messages[messages.length - 1]
  if (last.role !== "user") return ""
  const textParts = last.parts
    .filter((p) => typeof p === "object" && p !== null && (p as { type?: string }).type === "text")
  return textParts.map((p) => (p as { text?: string }).text ?? "").join("")
}
