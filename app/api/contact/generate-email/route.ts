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

  if (data.name) parts.push(`- Sender name: ${data.name}`)
  if (data.company) parts.push(`- Company/Organization: ${data.company}`)
  if (data.business) parts.push(`- Business/Purpose: ${data.business}`)

  const contextBlock = parts.length > 0 ? parts.join("\n") : "No additional context provided."

  const customBlock = data.customPrompt?.trim()
    ? `\n\nThe sender also wrote this note:\n"${data.customPrompt}"`
    : ""

  return `Write a professional, concise email from a potential collaborator/recruiter/company to a developer named Jie (a front-end developer & AI prompt engineer with 1.5 years experience at State Street, based in Hangzhou, China).

Context about the sender:
${contextBlock}${customBlock}

Generate the email in this exact JSON format (no markdown, no extra text):
{
  "subject": "<email subject line>",
  "body": "<full email body>"
}

Requirements:
- The subject should be clear, specific, and attention-grabbing (not generic).
- The body should be 2-4 short paragraphs, polite and professional.
- Mention specific details the sender provided — don't be vague.
- The tone should be warm but business-appropriate.
- Include a call-to-action (e.g., request a call, meeting, or reply).
- Sign off naturally.`
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
