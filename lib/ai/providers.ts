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

/* ─── DeepSeek ─── */

const DEEPSEEK_BASE_URL =
  process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1"

const DEEPSEEK_MODEL_ALIASES: Record<string, string> = {
  "deepseek v3 flash": "deepseek-v4-flash",
  "deepseek-v3-flash": "deepseek-v4-flash",
  "deepseek v4 flash": "deepseek-v4-flash",
  "deepseek v4 pro": "deepseek-v4-pro",
}

function getDeepSeekModel(): string {
  const rawModel = process.env.DEEPSEEK_MODEL?.trim() || "deepseek-v4-flash"
  const normalizedModel =
    DEEPSEEK_MODEL_ALIASES[rawModel.toLowerCase()] ?? rawModel

  if (normalizedModel !== rawModel) {
    console.warn(
      `[ai] Normalized legacy DeepSeek model "${rawModel}" to "${normalizedModel}"`,
    )
  }

  return normalizedModel
}

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

  const baseModel = deepseek.chat(getDeepSeekModel())

  return wrapLanguageModel({
    model: baseModel,
    middleware: extractReasoningMiddleware({ tagName: "think" }),
  })
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
