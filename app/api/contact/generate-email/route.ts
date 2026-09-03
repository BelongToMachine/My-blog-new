import { randomUUID } from "crypto"
import { generateText } from "ai"
import { getModel } from "@/lib/ai/providers"
import { z } from "zod"
import {
  checkContactRateLimit,
  rateLimitHeaders,
} from "@/lib/ai/rate-limit.server"

export const maxDuration = 30
export const dynamic = "force-dynamic"

const requestSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  company: z.string().max(100).optional(),
  business: z.string().max(200).optional(),
  customPrompt: z.string().trim().min(1).max(500),
})

function buildPrompt(data: z.infer<typeof requestSchema>): string {
  const parts: string[] = []

  if (data.name) parts.push(`The sender's name is ${data.name}.`)
  if (data.company) parts.push(`They work at or represent ${data.company}.`)
  if (data.business)
    parts.push(`Their reason for reaching out: ${data.business}.`)

  const contextBlock =
    parts.length > 0
      ? parts.join(" ")
      : "The sender didn't provide specific details about themselves."

  const customBlock = `\n\nThe sender added this personal note: "${data.customPrompt}"`

  return `You are writing an email on behalf of a real person who wants to contact Jie, a front-end developer and AI prompt engineer. Jie has 1.5 years of experience at State Street and is based in Hangzhou, China.

Sender details (use these naturally — do NOT put them in brackets or as placeholders):
${contextBlock}${customBlock}

Write the email in the sender's voice — you are that person writing directly to Jie. Weave the sender's details naturally into the text. Do not use bracketed placeholders like [Name] or [Company]. The email should read as if a real human wrote it from scratch.

Return ONLY valid JSON (no markdown, no code fences):
{
  "subject": "the email subject line",
  "body": "the full email body"
}

Guidelines:
- Be direct and business-like. This is a professional inquiry, not a fan letter.
- Do NOT use flattering language — no "impressed", "amazing", "inspiring", "great fit", "love your work", or similar compliments.
- State the purpose plainly. If it's a job opening, say so. If it's a collaboration, say what it's about.
- Keep it 2-3 short paragraphs. Get to the point quickly.
- Use the sender's actual name, company, and purpose directly in the text.
- The subject line should be descriptive and specific, not clickbait.
- End with a straightforward call-to-action (a meeting, a call, a reply).
- Sign off with the sender's name if provided.`
}

function rateLimitResponse(
  result: Awaited<ReturnType<typeof checkContactRateLimit>>,
) {
  const retryAfter = Math.max(
    1,
    Math.ceil((result.resetAt - Date.now()) / 1000),
  )

  return Response.json(
    {
      error: result.unavailable
        ? "Email generation is temporarily unavailable. Please try again later."
        : "Too many email generation requests. Please wait a few minutes.",
    },
    {
      status: result.unavailable ? 503 : 429,
      headers: {
        ...rateLimitHeaders(result),
        "Retry-After": String(retryAfter),
      },
    },
  )
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const limitResult = await checkContactRateLimit(request, "generate-email")
  if (!limitResult.allowed) {
    return rateLimitResponse(limitResult)
  }

  const requestId = randomUUID()

  try {
    const model = getModel()
    const prompt = buildPrompt(parsed.data)

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
    })

    // Parse the JSON from the model response
    let jsonStr = text.trim()
    // Strip markdown code fences if present
    jsonStr = jsonStr
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?```$/i, "")

    const email = JSON.parse(jsonStr) as { subject?: string; body?: string }

    if (!email.subject || !email.body) {
      throw new Error("Model returned incomplete email")
    }

    return Response.json({ subject: email.subject, body: email.body })
  } catch (error) {
    console.error("[generate-email] error", { requestId, error })
    return Response.json(
      {
        error: "Failed to generate email. Please try again later.",
        requestId,
      },
      { status: 503 },
    )
  }
}
