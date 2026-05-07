import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/prisma/client"
import {
  attachAiSessionCookie,
  getAiSession,
} from "@/lib/ai/session.server"

const MAX_MESSAGES_COUNT = 50
const MAX_MESSAGE_CONTENT_CHARS = 6000
const MAX_PARTS_JSON_CHARS = 12000

const saveMessagesSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(MAX_MESSAGE_CONTENT_CHARS).default(""),
        parts: z.array(z.unknown()).default([]),
      }),
    )
    .max(MAX_MESSAGES_COUNT),
  title: z.string().trim().max(255).optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getAiSession(req)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return attachAiSessionCookie(
      NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      ),
      session,
    )
  }

  try {
    const parsed = saveMessagesSchema.safeParse(body)
    if (!parsed.success) {
      return attachAiSessionCookie(
        NextResponse.json(
          { error: "Invalid messages payload" },
          { status: 400 },
        ),
        session,
      )
    }

    const threadId = params.id
    const messages: Array<{
      threadId: string
      role: "user" | "assistant"
      content: string
      parts: string
    }> = []

    for (const msg of parsed.data.messages) {
      const parts = JSON.stringify(msg.parts)

      if (parts.length > MAX_PARTS_JSON_CHARS) {
        return attachAiSessionCookie(
          NextResponse.json(
            { error: "Message parts payload too large" },
            { status: 413 },
          ),
          session,
        )
      }

      messages.push({
        threadId,
        role: msg.role,
        content: msg.content,
        parts,
      })
    }

    const saved = await prisma.$transaction(async (tx) => {
      const thread = await tx.chatThread.findFirst({
        where: { id: threadId, userId: session.id },
        select: { id: true },
      })

      if (!thread) return false

      await tx.chatMessage.deleteMany({
        where: { threadId },
      })

      if (messages.length > 0) {
        await tx.chatMessage.createMany({
          data: messages,
        })
      }

      await tx.chatThread.update({
        where: { id: threadId },
        data: {
          title: parsed.data.title ?? undefined,
          updatedAt: new Date(),
        },
      })

      return true
    })

    if (!saved) {
      return attachAiSessionCookie(
        NextResponse.json(
          { error: "Thread not found" },
          { status: 404 },
        ),
        session,
      )
    }

    return attachAiSessionCookie(NextResponse.json({ success: true }), session)
  } catch (error) {
    console.warn(
      "[api/ai/threads/:id/messages] POST failed, client will persist to localStorage:",
      error,
    )
    return attachAiSessionCookie(
      NextResponse.json(
        { error: "Failed to save messages" },
        { status: 500 },
      ),
      session,
    )
  }
}
