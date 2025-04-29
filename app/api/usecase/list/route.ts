import { NextResponse } from "next/server"
import prisma from "@/prisma/client"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get("page")

  if (!page) {
    return NextResponse.json({ error: "page not found" }, { status: 400 })
  }

  const pageNumber = parseInt(page)

  if (isNaN(pageNumber)) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 })
  }

  const skip = (pageNumber - 1) * 10

  try {
    const dialogs = await prisma.dialog.findMany({
      take: 10,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(dialogs)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dialogs" },
      { status: 500 }
    )
  }
}
