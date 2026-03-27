import { NextResponse } from "next/server"
import OpenAI from "openai"
import prisma from "@/prisma/client"

const MINIMAX_BASE_URL =
  process.env.MINIMAX_BASE_URL || "https://api.minimaxi.com/v1"
const MINIMAX_MODEL = process.env.MINIMAX_MODEL || "MiniMax-M2.5"

const ABOUT_JIE_SYSTEM_PROMPT = `
You are Jie's portfolio AI assistant.

Your job is to answer questions specifically about Jie Liao (廖永杰), his skills, his portfolio, his projects, his blog, and his working style.

Use this profile as your default knowledge base:
- Name: Jie Liao / 廖永杰
- Role: front-end developer with about 1.5 years of professional experience at State Street
- Focus: React, Next.js, TypeScript, polished UI engineering, maintainable front-end architecture, and practical AI product integration
- Location framing: Hangzhou, China
- Portfolio positioning: recruiter-facing, production-quality portfolio demonstrating independent delivery, front-end engineering strength, and AI prompt engineering/product integration
- Product areas on this site: hero showcase, blog system, project showcase, AI chatbot/playground, contact form, bilingual UX, responsive and dark mode support

Behavior rules:
- Stay focused on Jie and this site unless the user clearly asks for a broader answer.
- If asked about experience, strengths, projects, or fit, answer as a portfolio concierge using the profile above.
- If the user asks for code or implementation help related to this portfolio, still answer helpfully with practical code advice.
- If you are unsure about a fact not present in the profile, say so briefly instead of inventing details.
- Keep answers clear, direct, and useful. Use fenced code blocks only when code is genuinely helpful.
- Do not output chain-of-thought, hidden reasoning, or tags like <think>. Return only the final user-facing answer.
`.trim()

const getClient = () => {
  const apiKey = process.env.MINIMAX_API_KEY

  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY is not configured")
  }

  return new OpenAI({
    apiKey,
    baseURL: MINIMAX_BASE_URL,
  })
}

const sanitizeAssistantResponse = (content: string) =>
  content
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^\s*<\/?think>\s*$/gim, "")
    .trim()

export async function POST(request: Request) {
  try {
    const client = getClient()
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

      const response = await client.chat.completions.create({
        model: MINIMAX_MODEL,
        messages: [
          {
            role: "system",
            content: ABOUT_JIE_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `The user uploaded an image related to Jie's portfolio or work. Answer the user's request with Jie-focused context when appropriate.\n\nUser prompt: ${prompt}`,
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
      const sanitizedContent = dialogContent
        ? sanitizeAssistantResponse(dialogContent)
        : null

      if (sanitizedContent) {
        await prisma.dialog.create({
          data: {
            title: prompt,
            content: sanitizedContent,
          },
        })
      }

      return NextResponse.json(sanitizedContent ?? "No content generated")
    } else {
      // fallback to normal text chat if not multipart
      const { content } = await request.json()

      const response = await client.chat.completions.create({
        model: MINIMAX_MODEL,
        messages: [
          {
            role: "system",
            content: ABOUT_JIE_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content,
          },
        ],
      })

      const dialogContent = response.choices[0]?.message?.content
      const sanitizedContent = dialogContent
        ? sanitizeAssistantResponse(dialogContent)
        : null

      if (sanitizedContent) {
        await prisma.dialog.create({
          data: {
            title: content,
            content: sanitizedContent,
          },
        })
      }

      return NextResponse.json(sanitizedContent ?? "No content generated")
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
    const client = getClient()
    const { searchParams } = new URL(request.url)
    const encoded = searchParams.get("q")

    if (!encoded) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    const decoded = atob(encoded)
    const { content } = JSON.parse(decoded)

    const response = await client.chat.completions.create({
      model: MINIMAX_MODEL,
      messages: [
        {
          role: "system",
          content: ABOUT_JIE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content,
        },
      ],
    })

    const dialogContent = response.choices[0]?.message?.content
    const sanitizedContent = dialogContent
      ? sanitizeAssistantResponse(dialogContent)
      : null

    if (sanitizedContent) {
      await prisma.dialog.create({
        data: {
          title: content,
          content: sanitizedContent,
        },
      })
    }

    return NextResponse.json(sanitizedContent ?? "No content generated")
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    )
  }
}
