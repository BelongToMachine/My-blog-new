import { NextResponse } from "next/server"
import OpenAI from "openai"
import prisma from "@/prisma/client"

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_AI_KEY!,
  baseURL: "https://xiaoai.plus/v1",
})

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a code generator, you will generate code based on the user's request",
        },
        {
          role: "user",
          content,
        },
      ],
    })

    const dialogContent = response.choices[0]?.message?.content

    if (dialogContent) {
      // Save the dialog to the database
      await prisma.dialog.create({
        data: {
          title: content, // You can customize the title
          content: dialogContent,
        },
      })
    }

    return NextResponse.json(dialogContent ?? "No content generated")
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const encoded = searchParams.get("q")

    if (!encoded) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    const decoded = atob(encoded)
    const { content } = JSON.parse(decoded)

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a code generator, you will generate code based on the user's request",
        },
        {
          role: "user",
          content,
        },
      ],
    })

    const dialogContent = response.choices[0]?.message?.content

    if (dialogContent) {
      await prisma.dialog.create({
        data: {
          title: content,
          content: dialogContent,
        },
      })
    }

    return NextResponse.json(dialogContent ?? "No content generated")
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
