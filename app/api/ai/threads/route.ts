import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prisma/client"
import { checkIpRateLimit, rateLimitHeaders } from "@/lib/ai/rate-limit.server"
import {
  attachAiSessionCookie,
  getAiSession,
} from "@/lib/ai/session.server"

export async function GET(req: NextRequest) {
  const session = getAiSession(req)

  try {
    const threads = await prisma.chatThread.findMany({
      where: { userId: session.id },
      orderBy: { updatedAt: "desc" },
      take: 50,
    })
    return attachAiSessionCookie(NextResponse.json(threads), session)
  } catch (error) {
    console.warn("[api/ai/threads] GET failed, client will fall back to localStorage:", error)
    return attachAiSessionCookie(
      NextResponse.json(
        { error: "Failed to load threads" },
        { status: 500 },
      ),
      session,
    )
  }
}

export async function POST(req: NextRequest) {
  const session = getAiSession(req)
  const limitResult = await checkIpRateLimit(req)
  if (!limitResult.allowed) {
    return attachAiSessionCookie(
      NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: rateLimitHeaders(limitResult),
        },
      ),
      session,
    )
  }

  try {
    const thread = await prisma.chatThread.create({
      data: {
        title: "New Chat",
        userId: session.id,
      },
    })
    return attachAiSessionCookie(
      NextResponse.json(thread, { status: 201 }),
      session,
    )
  } catch (error) {
    console.warn("[api/ai/threads] POST failed, client will keep thread locally:", error)
    return attachAiSessionCookie(
      NextResponse.json(
        { error: "Failed to create thread" },
        { status: 500 },
      ),
      session,
    )
  }
}
