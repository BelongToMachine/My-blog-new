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

function createDeepSeekModel(): LanguageModel {
  const deepseek = createOpenAI({
    name: "deepseek",
    apiKey: getDeepSeekApiKey(),
    baseURL: DEEPSEEK_BASE_URL,
  })

  const baseModel = deepseek.chat(DEEPSEEK_MODEL)

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
