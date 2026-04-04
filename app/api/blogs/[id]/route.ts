import { patchBlogSchema } from "@/app/validationSchema"
import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { MODE } from "@/app/envConfig"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const locale = request.nextUrl.searchParams.get("locale")

  const parsedId = parseInt(id)

  if (isNaN(parsedId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  const blog = await prisma.issue.findFirst({
    where: { id: parsedId, ...(locale ? { language: locale } : {}) },
  })

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 })
  }

  return NextResponse.json({ title: blog.title })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (MODE !== "dev") return NextResponse.json({}, { status: 403 })

  const body = await request.json()
  const validation = patchBlogSchema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 })

  const { assignedToUserId, title, description, language } = body
  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId },
    })

    if (!user)
      return NextResponse.json({ error: "Invalid User" }, { status: 400 })
  }

  const { id } = await params

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  })

  if (!issue)
    return NextResponse.json(
      {
        error: "Invalid blog",
      },
      { status: 404 }
    )

  const updatedBlog = await prisma.issue.update({
    where: { id: parseInt(id) },
    data: {
      title,
      description,
      assignedToUserId,
      language,
    },
  })

  return NextResponse.json(updatedBlog)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (MODE !== "dev") return NextResponse.json({}, { status: 403 })

  const { id } = await params

  const blog = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  })
  if (!blog)
    return NextResponse.json(
      {
        error: "Blog not found",
      },
      { status: 404 }
    )

  await prisma.issue.delete({
    where: { id: blog.id },
  })

  return NextResponse.json({})
}
