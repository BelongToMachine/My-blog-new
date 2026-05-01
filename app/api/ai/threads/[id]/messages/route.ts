import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prisma/client"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = (await req.json()) as {
      messages: Array<{
        id: string
        role: string
        content: string
        parts?: unknown[]
      }>
      title?: string
    }

    const threadId = params.id

    // Delete existing messages for this thread and re-insert
    await prisma.chatMessage.deleteMany({
      where: { threadId },
    })

    if (body.messages.length > 0) {
      await prisma.chatMessage.createMany({
        data: body.messages.map((msg) => ({
          threadId,
          role: msg.role,
          content: msg.content,
          parts: JSON.stringify(msg.parts ?? []),
        })),
      })
    }

    // Update thread title and timestamp
    await prisma.chatThread.update({
      where: { id: threadId },
      data: {
        title: body.title ?? undefined,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[api/ai/threads/:id/messages] POST error:", error)
    return NextResponse.json(
      { error: "Failed to save messages" },
      { status: 500 },
    )
  }
}
