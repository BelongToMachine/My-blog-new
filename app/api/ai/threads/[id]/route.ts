import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prisma/client"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const thread = await prisma.chatThread.findUnique({
      where: { id: params.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(thread)
  } catch (error) {
    console.warn("[api/ai/threads/:id] GET failed, client will use localStorage thread:", error)
    return NextResponse.json(
      { error: "Failed to load thread" },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.chatThread.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.warn(
      "[api/ai/threads/:id] DELETE failed, client will remove thread locally:",
      error,
    )
    return NextResponse.json(
      { error: "Failed to delete thread" },
      { status: 500 },
    )
  }
}
