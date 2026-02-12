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
          title: "Generated Dialog", // You can customize the title
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
