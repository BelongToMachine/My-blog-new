import { extractReasoningMiddleware, wrapLanguageModel } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

const MINIMAX_BASE_URL =
  process.env.MINIMAX_BASE_URL || "https://api.minimaxi.com/v1"
const MINIMAX_MODEL = process.env.MINIMAX_MODEL || "MiniMax-M2.5"

const getMiniMaxApiKey = () => {
  const apiKey = process.env.MINIMAX_API_KEY

  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY is not configured")
  }

  return apiKey
}

export const getMiniMaxModel = () => {
  const minimax = createOpenAI({
    name: "minimax",
    apiKey: getMiniMaxApiKey(),
    baseURL: MINIMAX_BASE_URL,
  })

  return wrapLanguageModel({
    model: minimax.chat(MINIMAX_MODEL),
    middleware: extractReasoningMiddleware({
      tagName: "think",
    }),
  })
}
