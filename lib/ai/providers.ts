import { extractReasoningMiddleware, wrapLanguageModel, type LanguageModel } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export type AIProvider = "minimax" | "deepseek"

const PROVIDER = (process.env.AI_PROVIDER ?? "minimax") as AIProvider
const THINKING_ENABLED = process.env.AI_THINKING_ENABLED === "true"

/* ─── MiniMax ─── */

const MINIMAX_BASE_URL =
  process.env.MINIMAX_BASE_URL || "https://api.minimaxi.com/v1"
const MINIMAX_MODEL = process.env.MINIMAX_MODEL || "MiniMax-M2.5"

function getMiniMaxApiKey(): string {
  const key = process.env.MINIMAX_API_KEY
  if (!key) throw new Error("MINIMAX_API_KEY is not configured")
  return key
}

function createMiniMaxModel(): LanguageModel {
  const minimax = createOpenAI({
    name: "minimax",
    apiKey: getMiniMaxApiKey(),
    baseURL: MINIMAX_BASE_URL,
  })

  const baseModel = minimax.chat(MINIMAX_MODEL)

  return wrapLanguageModel({
    model: baseModel,
    middleware: extractReasoningMiddleware({ tagName: "think" }),
  })
}

/* ─── DeepSeek (placeholder for future migration) ─── */

function createDeepSeekModel(): LanguageModel {
  throw new Error("DeepSeek provider is not yet implemented")
}

/* ─── Factory ─── */

export function getModel(): LanguageModel {
  switch (PROVIDER) {
    case "minimax":
      return createMiniMaxModel()
    case "deepseek":
      return createDeepSeekModel()
    default:
      throw new Error(`Unknown AI provider: ${PROVIDER}`)
  }
}

export function getProvider(): AIProvider {
  return PROVIDER
}

export function isThinkingEnabled(): boolean {
  return THINKING_ENABLED
}
