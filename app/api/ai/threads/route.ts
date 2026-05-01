import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prisma/client"
import { checkIpRateLimit, rateLimitHeaders } from "@/lib/ai/rate-limit.server"

export async function GET() {
  try {
    const threads = await prisma.chatThread.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
    })
    return NextResponse.json(threads)
  } catch (error) {
    console.error("[api/ai/threads] GET error:", error)
    return NextResponse.json(
      { error: "Failed to load threads" },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  const limitResult = await checkIpRateLimit(req)
  if (!limitResult.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: rateLimitHeaders(limitResult),
      },
    )
  }

  try {
    const thread = await prisma.chatThread.create({
      data: {
        title: "New Chat",
      },
    })
    return NextResponse.json(thread, { status: 201 })
  } catch (error) {
    console.error("[api/ai/threads] POST error:", error)
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 },
    )
  }
}
