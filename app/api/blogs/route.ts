import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prisma/client"
import { blogSchema } from "@/app/validationSchema"
import { MODE } from "@/app/envConfig"

export async function POST(request: NextRequest) {
  if (MODE !== "dev") {
    return NextResponse.json({}, { status: 403 })
  }

  const body = await request.json()
  const validation = blogSchema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 })

  const newBlog = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
      language: body.language ?? "zh",
    },
  })

  return NextResponse.json(newBlog, { status: 201 })
}
