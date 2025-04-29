import { NextResponse } from "next/server"
import prisma from "@/prisma/client"

const DEV_SECRET_TOKEN = process.env.NEXT_PUBLIC_DEV_SECRET_TOKEN

export async function GET(request: Request) {
  const authHeader =
    request.headers.get("authorization") ||
    request.headers.get("x-forwarded-authorization")

  if (!authHeader || authHeader !== `Bearer ${DEV_SECRET_TOKEN}`) {
    return NextResponse.json({ error: "not cotent" }, { status: 400 })
  }

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
