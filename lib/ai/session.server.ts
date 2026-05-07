import { randomUUID } from "crypto"

const AI_SESSION_COOKIE = "jie_ai_session"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365
const SESSION_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{15,127}$/

export interface AiSession {
  id: string
  setCookieHeader?: string
}

function parseCookieHeader(header: string | null): Record<string, string> {
  if (!header) return {}

  return header.split(";").reduce<Record<string, string>>((cookies, part) => {
    const [name, ...valueParts] = part.trim().split("=")
    if (!name || valueParts.length === 0) return cookies

    try {
      cookies[name] = decodeURIComponent(valueParts.join("="))
    } catch {
      cookies[name] = valueParts.join("=")
    }

    return cookies
  }, {})
}

function serializeSessionCookie(sessionId: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  return [
    `${AI_SESSION_COOKIE}=${encodeURIComponent(sessionId)}`,
    "Path=/",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
  ].join("; ") + secure
}

function isValidSessionId(value: string | undefined): value is string {
  return Boolean(value && SESSION_ID_PATTERN.test(value))
}

export function getAiSession(request: Request): AiSession {
  const cookies = parseCookieHeader(request.headers.get("cookie"))
  const existing = cookies[AI_SESSION_COOKIE]

  if (isValidSessionId(existing)) {
    return { id: existing }
  }

  const id = randomUUID()
  return {
    id,
    setCookieHeader: serializeSessionCookie(id),
  }
}

export function attachAiSessionCookie<T extends Response>(
  response: T,
  session: AiSession,
): T {
  if (session.setCookieHeader) {
    response.headers.append("Set-Cookie", session.setCookieHeader)
  }

  return response
}
