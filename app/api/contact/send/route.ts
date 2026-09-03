import { randomUUID } from "crypto"
import { Resend } from "resend"
import { z } from "zod"
import {
  checkContactRateLimit,
  rateLimitHeaders,
} from "@/lib/ai/rate-limit.server"

export const dynamic = "force-dynamic"

const headerText = (max: number) =>
  z
    .string()
    .min(1)
    .max(max)
    .refine((value) => !/[\r\n]/.test(value), "Line breaks are not allowed")

const requestSchema = z.object({
  fromName: headerText(100),
  fromEmail: z.string().email().max(200).optional(),
  subject: headerText(200),
  message: z.string().min(1).max(5000),
})

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return null
  return new Resend(apiKey)
}

function getContactFromEmail(): string | null {
  const configured = process.env.CONTACT_FROM_EMAIL?.trim()
  if (configured && z.string().email().safeParse(configured).success) {
    return configured
  }

  // The shared resend.dev sender is useful for local testing only. Resend
  // restricts it to the account owner and it cannot be used for production
  // recipients without a verified domain.
  if (process.env.NODE_ENV !== "production") {
    return "onboarding@resend.dev"
  }

  return null
}

function getErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return { message: String(error) }
  }

  const value = error as Record<string, unknown>
  return {
    name: typeof value.name === "string" ? value.name : undefined,
    message: typeof value.message === "string" ? value.message : undefined,
    code: typeof value.code === "string" ? value.code : undefined,
    statusCode:
      typeof value.statusCode === "number" ? value.statusCode : undefined,
  }
}

function rateLimitResponse(
  result: Awaited<ReturnType<typeof checkContactRateLimit>>,
) {
  const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000))

  return Response.json(
    {
      error: result.unavailable
        ? "Email service is temporarily unavailable. Please try again later."
        : "Too many email requests. Please wait a few minutes.",
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

  const limitResult = await checkContactRateLimit(request, "send-email")
  if (!limitResult.allowed) {
    return rateLimitResponse(limitResult)
  }

  const configuredRecipient = process.env.CONTACT_RECIPIENT_EMAIL?.trim()
  const recipientEmail =
    configuredRecipient &&
    z.string().email().safeParse(configuredRecipient).success
      ? configuredRecipient
      : null
  const fromEmail = getContactFromEmail()
  const resend = getResend()

  if (!recipientEmail || !fromEmail || !resend) {
    console.error("[contact/send] missing email configuration", {
      hasRecipient: Boolean(recipientEmail),
      hasFrom: Boolean(fromEmail),
      hasApiKey: Boolean(process.env.RESEND_API_KEY),
      nodeEnv: process.env.NODE_ENV,
    })
    return Response.json(
      { error: "Email service is not configured. Please try again later." },
      { status: 503 },
    )
  }

  const requestId = randomUUID()
  const suppliedIdempotencyKey = request.headers
    .get("idempotency-key")
    ?.trim()
  const idempotencyKey =
    suppliedIdempotencyKey &&
    suppliedIdempotencyKey.length <= 256 &&
    !/[\r\n]/.test(suppliedIdempotencyKey)
      ? suppliedIdempotencyKey
      : requestId

  try {
    const { data, error } = await resend.emails.send(
      {
        from: `Jie's Portfolio <${fromEmail}>`,
        to: [recipientEmail],
        ...(parsed.data.fromEmail
          ? { replyTo: parsed.data.fromEmail }
          : {}),
        subject: `[Portfolio Contact] ${parsed.data.subject}`,
        text: `${parsed.data.message}\n\n---\nFrom: ${parsed.data.fromName}${
          parsed.data.fromEmail ? ` (${parsed.data.fromEmail})` : ""
        }`,
      },
      { idempotencyKey },
    )

    if (error) {
      console.error("[contact/send] Resend error", {
        requestId,
        ...getErrorDetails(error),
      })
      return Response.json(
        {
          error: "Failed to send email. Please try again later.",
          requestId,
        },
        { status: 502 },
      )
    }

    return Response.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("[contact/send] unexpected error", {
      requestId,
      ...getErrorDetails(error),
    })
    return Response.json(
      {
        error: "Failed to send email. Please try again later.",
        requestId,
      },
      { status: 502 },
    )
  }
}
