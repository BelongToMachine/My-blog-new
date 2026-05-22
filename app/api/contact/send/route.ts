import { Resend } from "resend"
import { z } from "zod"

export const dynamic = "force-dynamic"

const requestSchema = z.object({
  fromName: z.string().min(1).max(100),
  fromEmail: z.string().email().max(200),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
})

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured")
  return new Resend(apiKey)
}

// Simple in-memory rate limiter (per IP, 3 requests per 10 minutes)
const rateMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 })
    return true
  }

  if (entry.count >= 3) return false

  entry.count++
  return true
}

// Clean up stale entries periodically
setInterval(() => {
  const now = Date.now()
  rateMap.forEach((val, key) => {
    if (now > val.resetAt) rateMap.delete(key)
  })
}, 60_000).unref()

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"

  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Too many requests. Please wait a few minutes." },
      { status: 429 },
    )
  }

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

  const { fromName, fromEmail, subject, message } = parsed.data
  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL

  if (!recipientEmail) {
    console.error("[contact/send] CONTACT_RECIPIENT_EMAIL is not configured")
    return Response.json({ error: "Server misconfiguration." }, { status: 500 })
  }

  try {
    const resend = getResend()

    const { error } = await resend.emails.send({
      from: `${fromName} via Portfolio <onboarding@resend.dev>`,
      to: [recipientEmail],
      replyTo: fromEmail,
      subject: `[Portfolio Contact] ${subject}`,
      text: `${message}\n\n---\nFrom: ${fromName} (${fromEmail})`,
    })

    if (error) {
      console.error("[contact/send] Resend error:", error)
      return Response.json({ error: "Failed to send email. Please try again." }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("[contact/send] error:", error)
    return Response.json({ error: "Failed to send email. Please try again." }, { status: 500 })
  }
}
