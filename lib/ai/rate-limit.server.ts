import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/* ─── Redis client ─── */

const RATE_LIMIT_BYPASS_MS = 60_000

let _redis: Redis | null = null
let redisBypassUntil = 0
let lastRedisNotice = ""

function hasRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return false
  if (!/^https?:\/\//.test(url)) return false
  return true
}

function logRedisBypass(reason: string) {
  if (reason === lastRedisNotice) return
  lastRedisNotice = reason
  console.warn(`[ai/rate-limit] bypassing Redis-backed limits: ${reason}`)
}

function shouldBypassRedis(): boolean {
  if (!hasRedisConfig()) {
    logRedisBypass(
      "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are missing or invalid",
    )
    return true
  }

  if (Date.now() < redisBypassUntil) {
    return true
  }

  return false
}

function markRedisUnavailable(error: unknown) {
  redisBypassUntil = Date.now() + RATE_LIMIT_BYPASS_MS
  const message = error instanceof Error ? error.message : String(error)
  logRedisBypass(`${message}; bypassing for 60s`)
}

function getRedis(): Redis {
  if (_redis) return _redis

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!hasRedisConfig() || !url || !token) {
    throw new Error(
      "Upstash Redis is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
    )
  }

  _redis = new Redis({ url, token })
  return _redis
}

let _ratelimitIp: Ratelimit | null = null
let _ratelimitSession: Ratelimit | null = null

const WEIGHTED_LIMIT_WINDOW_MS = 5 * 60 * 1000
const WEIGHTED_LIMIT_MAX_CREDITS = 30

function getIpRatelimit(): Ratelimit {
  if (_ratelimitIp) return _ratelimitIp
  _ratelimitIp = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(10, "5 m"),
    analytics: false,
  })
  return _ratelimitIp
}

function getSessionRatelimit(): Ratelimit {
  if (_ratelimitSession) return _ratelimitSession
  _ratelimitSession = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(20, "1 d"),
    analytics: false,
  })
  return _ratelimitSession
}

/* ─── Client identifiers ─── */

function getIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim()
  if (ip) return ip
  // Fallback to a stable but non-identifying key per connection
  return "unknown"
}

/* ─── Weighted credit calculator ─── */

export type CreditTier = "short" | "medium" | "long"

export function classifyInput(text: string): CreditTier {
  const len = text.length
  if (len > 4000) return "long"
  if (len > 1200) return "medium"
  return "short"
}

export function getCreditCost(tier: CreditTier): number {
  switch (tier) {
    case "short":
      return 1
    case "medium":
      return 3
    case "long":
      return 5
  }
}

/* ─── Public API ─── */

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  reason?: "ip" | "session"
}

export async function checkIpRateLimit(req: Request): Promise<RateLimitResult> {
  if (shouldBypassRedis()) {
    return { allowed: true, remaining: 999, resetAt: Date.now() + 60000 }
  }

  try {
    const ip = getIp(req)
    const result = await getIpRatelimit().limit(ip)
    return {
      allowed: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    }
  } catch (error) {
    // If Redis fails, fail open to avoid blocking legitimate users
    markRedisUnavailable(error)
    return { allowed: true, remaining: 999, resetAt: Date.now() + 60000 }
  }
}

export async function checkSessionRateLimit(
  sessionId: string,
): Promise<RateLimitResult> {
  if (shouldBypassRedis()) {
    return { allowed: true, remaining: 999, resetAt: Date.now() + 60000 }
  }

  try {
    const result = await getSessionRatelimit().limit(`session:${sessionId}`)
    return {
      allowed: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    }
  } catch (error) {
    markRedisUnavailable(error)
    return { allowed: true, remaining: 999, resetAt: Date.now() + 60000 }
  }
}

export async function checkWeightedRateLimit(
  req: Request,
  text: string,
): Promise<RateLimitResult> {
  const tier = classifyInput(text)
  const cost = getCreditCost(tier)

  if (shouldBypassRedis()) {
    return { allowed: true, remaining: 999, resetAt: Date.now() + 60000 }
  }

  try {
    const ip = getIp(req)
    const redis = getRedis()
    const key = `ratelimit:weighted:${ip}`
    const ttl = await redis.pttl(key)
    const currentWindowTtl =
      typeof ttl === "number" && ttl > 0 ? ttl : WEIGHTED_LIMIT_WINDOW_MS
    const nextUsed = await redis.incrby(key, cost)

    if (nextUsed === cost) {
      await redis.pexpire(key, WEIGHTED_LIMIT_WINDOW_MS)
    }

    if (nextUsed > WEIGHTED_LIMIT_MAX_CREDITS) {
      await redis.decrby(key, cost)
      const current = await redis.get<number>(key)
      const usedCredits = typeof current === "number" ? current : 0

      return {
        allowed: false,
        remaining: Math.max(0, WEIGHTED_LIMIT_MAX_CREDITS - usedCredits),
        resetAt: Date.now() + currentWindowTtl,
      }
    }

    return {
      allowed: true,
      remaining: Math.max(0, WEIGHTED_LIMIT_MAX_CREDITS - nextUsed),
      resetAt: Date.now() + currentWindowTtl,
    }
  } catch (error) {
    markRedisUnavailable(error)
    return { allowed: true, remaining: 999, resetAt: Date.now() + 60000 }
  }
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  }
}
