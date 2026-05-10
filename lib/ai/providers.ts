import { extractReasoningMiddleware, wrapLanguageModel, type LanguageModel } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export type AIProvider = "deepseek"

const PROVIDER: AIProvider = "deepseek"
const THINKING_ENABLED = process.env.AI_THINKING_ENABLED === "true"

/* ─── DeepSeek ─── */

const DEEPSEEK_BASE_URL =
  process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1"
const DEEPSEEK_MODEL = "deepseek-v4-flash"

function getDeepSeekApiKey(): string {
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) throw new Error("DEEPSEEK_API_KEY is not configured")
  return key
}

function createDeepSeekFetch() {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    if (!init?.body || typeof init.body !== "string") {
      return fetch(input, init)
    }

    try {
      const body = JSON.parse(init.body) as Record<string, unknown>
      body.thinking = { type: THINKING_ENABLED ? "enabled" : "disabled" }

      if (!THINKING_ENABLED) {
        delete body.reasoning_effort
      }

      return fetch(input, {
        ...init,
        body: JSON.stringify(body),
      })
    } catch {
      return fetch(input, init)
    }
  }
}

function createDeepSeekModel(): LanguageModel {
  const deepseek = createOpenAI({
    name: "deepseek",
    apiKey: getDeepSeekApiKey(),
    baseURL: DEEPSEEK_BASE_URL,
    fetch: createDeepSeekFetch(),
  })

  const baseModel = deepseek.chat(DEEPSEEK_MODEL)

  if (!THINKING_ENABLED) {
    return baseModel
  }

  return wrapLanguageModel({
    model: baseModel,
    middleware: extractReasoningMiddleware({ tagName: "think" }),
  })
}

/* ─── Factory ─── */

export function getModel(): LanguageModel {
  return createDeepSeekModel()
}

export function getProvider(): AIProvider {
  return PROVIDER
}

export function isThinkingEnabled(): boolean {
  return THINKING_ENABLED
}
