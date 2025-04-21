import { NextResponse } from "next/server"
import OpenAI from "openai"

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

    return NextResponse.json(response.choices[0].message.content)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
