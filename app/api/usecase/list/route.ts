import { NextResponse } from "next/server"
import prisma from "@/prisma/client"

export async function GET(request: Request) {
  const authHeader =
    request.headers.get("authorization") ||
    request.headers.get("x-forwarded-authorization")

  const DEV_SECRET_TOKEN = process.env.NEXT_PUBLIC_DEV_SECRET_TOKEN

  console.log("Auth header received:", authHeader?.substring(0, 10) + "...")
  console.log(
    "Expected token format:",
    `Bearer ${DEV_SECRET_TOKEN?.substring(0, 3)}...`
  )

  if (
    !authHeader ||
    !DEV_SECRET_TOKEN ||
    authHeader !== `Bearer ${DEV_SECRET_TOKEN}`
  ) {
    // More specific error for debugging
    if (!authHeader) {
      return NextResponse.json(
        { error: "No authorization header found" },
        { status: 401 }
      )
    } else if (!DEV_SECRET_TOKEN) {
      return NextResponse.json(
        { error: "Environment variable DEV_SECRET_TOKEN is not set" },
        { status: 500 }
      )
    } else {
      return NextResponse.json(
        { error: "Invalid authorization token" },
        { status: 401 }
      )
    }
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
