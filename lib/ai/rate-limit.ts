// Simple in-memory rate limiter for AI chat API
// In production, consider Redis or a persistent store

interface RateLimitEntry {
  count: number
  resetAt: number
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20 // max requests per window

const store = new Map<string, RateLimitEntry>()

function getClientId(req: Request): string {
  // Use forwarded IP, real IP, or a fallback
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown"
  return ip
}

export function checkRateLimit(req: Request): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  const clientId = getClientId(req)
  const now = Date.now()

  const entry = store.get(clientId)

  if (!entry || now > entry.resetAt) {
    // New window
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    }
    store.set(clientId, newEntry)
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetAt: newEntry.resetAt,
    }
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  entry.count += 1
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - entry.count,
    resetAt: entry.resetAt,
  }
}

export function rateLimitHeaders(result: {
  allowed: boolean
  remaining: number
  resetAt: number
}): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  }
}
