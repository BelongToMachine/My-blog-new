import { createAgentUIStreamResponse } from "ai"
import { portfolioAgent } from "@/lib/ai/portfolio-agent"

export async function POST(request: Request) {
  const { messages } = await request.json()

  return createAgentUIStreamResponse({
    agent: portfolioAgent,
    uiMessages: messages,
    abortSignal: request.signal,
  })
}
