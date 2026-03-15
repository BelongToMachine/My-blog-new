import { NextResponse } from "next/server"
import OpenAI from "openai"
import prisma from "@/prisma/client"

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_AI_KEY!,
  baseURL: "https://xiaoai.plus/v1",
})

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type")

    if (contentType?.startsWith("multipart/form-data")) {
      const formData = await request.formData()
      const file = formData.get("file") as File
      const prompt = formData.get("prompt") as string

      if (!file) {
        return NextResponse.json({ error: "Missing file" }, { status: 400 })
      }

      const arrayBuffer = await file.arrayBuffer()
      const base64Image = Buffer.from(arrayBuffer).toString("base64")

      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  "Knowing that I have vitest installed, don't repeat install related code. please write vitest code against this picture" +
                  prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      })

      const dialogContent = response.choices[0]?.message?.content

      if (dialogContent) {
        await prisma.dialog.create({
          data: {
            title: prompt,
            content: dialogContent,
          },
        })
      }

      return NextResponse.json(dialogContent ?? "No content generated")
    } else {
      // fallback to normal text chat if not multipart
      const { content } = await request.json()

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a practical AI coding assistant. Give clear implementation help, explain tradeoffs briefly, and use fenced code blocks when code is useful.",
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
    }
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
            "You are a practical AI coding assistant. Give clear implementation help, explain tradeoffs briefly, and use fenced code blocks when code is useful.",
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
