import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prisma/client"
import {
  getPrismaBypassReason,
  isPrismaConnectivityError,
  markPrismaHealthy,
  markPrismaUnavailable,
  shouldBypassPrisma,
} from "@/prisma/safe"
import {
  attachAiSessionCookie,
  getAiSession,
} from "@/lib/ai/session.server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getAiSession(req)

  if (shouldBypassPrisma()) {
    return attachAiSessionCookie(
      NextResponse.json(
        { error: getPrismaBypassReason() },
        { status: 503 },
      ),
      session,
    )
  }

  try {
    const thread = await prisma.chatThread.findFirst({
      where: { id: params.id, userId: session.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!thread) {
      return attachAiSessionCookie(
        NextResponse.json(
          { error: "Thread not found" },
          { status: 404 },
        ),
        session,
      )
    }

    markPrismaHealthy()
    return attachAiSessionCookie(NextResponse.json(thread), session)
  } catch (error) {
    if (isPrismaConnectivityError(error)) {
      markPrismaUnavailable("thread GET failed", error)
      return attachAiSessionCookie(
        NextResponse.json(
          { error: "Failed to load thread" },
          { status: 503 },
        ),
        session,
      )
    }

    console.warn("[api/ai/threads/:id] GET failed, client will use localStorage thread:", error)
    return attachAiSessionCookie(
      NextResponse.json(
        { error: "Failed to load thread" },
        { status: 500 },
      ),
      session,
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getAiSession(req)

  if (shouldBypassPrisma()) {
    return attachAiSessionCookie(
      NextResponse.json(
        { error: getPrismaBypassReason() },
        { status: 503 },
      ),
      session,
    )
  }

  try {
    const result = await prisma.chatThread.deleteMany({
      where: { id: params.id, userId: session.id },
    })

    if (result.count === 0) {
      return attachAiSessionCookie(
        NextResponse.json(
          { error: "Thread not found" },
          { status: 404 },
        ),
        session,
      )
    }

    markPrismaHealthy()
    return attachAiSessionCookie(NextResponse.json({ success: true }), session)
  } catch (error) {
    if (isPrismaConnectivityError(error)) {
      markPrismaUnavailable("thread DELETE failed", error)
      return attachAiSessionCookie(
        NextResponse.json(
          { error: "Failed to delete thread" },
          { status: 503 },
        ),
        session,
      )
    }

    console.warn(
      "[api/ai/threads/:id] DELETE failed, client will remove thread locally:",
      error,
    )
    return attachAiSessionCookie(
      NextResponse.json(
        { error: "Failed to delete thread" },
        { status: 500 },
      ),
      session,
    )
  }
}
