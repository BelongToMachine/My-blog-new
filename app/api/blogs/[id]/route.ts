import { patchBlogSchema } from "@/app/validationSchema"
import prisma from "@/prisma/client"
import { AuthOptions, getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import authOptions from "@/app/auth/authOptions"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

  const parsedId = parseInt(id)

  if (isNaN(parsedId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  const blog = await prisma.issue.findUnique({ where: { id: parsedId } })

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 })
  }

  return NextResponse.json({ title: blog.title })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getServerSession(authOptions)
  if (!session) return NextResponse.json({}, { status: 401 })

  const body = await request.json()
  const validation = patchBlogSchema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(validation.error.format, { status: 400 })

  const { assignedToUserId, title, description } = body
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
    },
  })

  return NextResponse.json(updatedBlog)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({}, { status: 401 })

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
function getSereverSession(authOptions: AuthOptions) {
  throw new Error("Function not implemented.")
}
