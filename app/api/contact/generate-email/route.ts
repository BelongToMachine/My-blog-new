import { generateText } from "ai"
import { getModel } from "@/lib/ai/providers"
import { z } from "zod"

export const maxDuration = 30
export const dynamic = "force-dynamic"

const requestSchema = z.object({
  name: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  business: z.string().max(200).optional(),
  customPrompt: z.string().max(500).optional(),
})

function buildPrompt(data: z.infer<typeof requestSchema>): string {
  const parts: string[] = []

  if (data.name) parts.push(`The sender's name is ${data.name}.`)
  if (data.company) parts.push(`They work at or represent ${data.company}.`)
  if (data.business) parts.push(`Their reason for reaching out: ${data.business}.`)

  const contextBlock = parts.length > 0 ? parts.join(" ") : "The sender didn't provide specific details about themselves."

  const customBlock = data.customPrompt?.trim()
    ? `\n\nThe sender added this personal note: "${data.customPrompt}"`
    : ""

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
- Write 2-4 short, warm paragraphs that feel personal and specific.
- Use the sender's actual name, company, and purpose directly in the text.
- Do not write "My name is [X]" — if you know the name, just sign with it or mention it naturally.
- The subject line should be specific and intriguing, not generic.
- End with a clear, friendly call-to-action (a meeting, a call, a reply).
- Sign off with the sender's name if provided.`
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
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  // Require at least some context
  const { name, company, business, customPrompt } = parsed.data
  if (!name && !company && !business && !customPrompt?.trim()) {
    return Response.json(
      { error: "Please provide at least a name, company, business, or custom note." },
      { status: 400 },
    )
  }

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
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```$/i, "")

    const email = JSON.parse(jsonStr) as { subject?: string; body?: string }

    if (!email.subject || !email.body) {
      throw new Error("Model returned incomplete email")
    }

    return Response.json({ subject: email.subject, body: email.body })
  } catch (error) {
    console.error("[generate-email] error:", error)
    return Response.json(
      { error: "Failed to generate email. Please try again." },
      { status: 500 },
    )
  }
}
