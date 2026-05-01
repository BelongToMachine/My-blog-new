import { randomUUID } from "crypto"
import { Redis } from "@upstash/redis"

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    throw new Error(
      "Upstash Redis is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
    )
  }

  return new Redis({ url, token })
}

function getIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() ?? "unknown"
}

/* ─── Thread-level concurrency lock (1 in-flight per thread) ─── */

const THREAD_LOCK_TTL_MS = 45_000 // match maxDuration

export async function acquireThreadLock(
  threadId: string,
): Promise<{ release: () => Promise<void> } | null> {
  try {
    const redis = getRedis()
    const key = `lock:thread:${threadId}`
    const token = randomUUID()
    const acquired = await redis.set(key, token, {
      nx: true,
      px: THREAD_LOCK_TTL_MS,
    })

    if (acquired !== "OK") return null

    return {
      release: async () => {
        await redis.eval(
          `
          if redis.call("GET", KEYS[1]) == ARGV[1] then
            return redis.call("DEL", KEYS[1])
          end
          return 0
          `,
          [key],
          [token],
        )
      },
    }
  } catch {
    // Fail open if Redis is down
    return {
      release: async () => {},
    }
  }
}

/* ─── IP-level concurrency lock (max 2 in-flight per IP) ─── */

const IP_LOCK_TTL_MS = 45_000
const MAX_IP_CONCURRENT = 2

export async function acquireIpLock(
  req: Request,
): Promise<{ release: () => Promise<void> } | null> {
  try {
    const redis = getRedis()
    const ip = getIp(req)
    const key = `lock:ip:${ip}`
    const result = await redis.eval<[number, number]>(
      `
      local current = tonumber(redis.call("GET", KEYS[1]) or "0")
      local maxConcurrent = tonumber(ARGV[1])
      local ttlMs = tonumber(ARGV[2])

      if current >= maxConcurrent then
        return {0, current}
      end

      local nextValue = redis.call("INCR", KEYS[1])
      redis.call("PEXPIRE", KEYS[1], ttlMs)

      return {1, nextValue}
      `,
      [key],
      [MAX_IP_CONCURRENT, IP_LOCK_TTL_MS],
    )

    if (!Array.isArray(result) || result[0] !== 1) {
      return null
    }

    return {
      release: async () => {
        await redis.eval(
          `
          local current = tonumber(redis.call("GET", KEYS[1]) or "0")
          local ttlMs = tonumber(ARGV[1])

          if current <= 1 then
            return redis.call("DEL", KEYS[1])
          end

          local nextValue = redis.call("DECR", KEYS[1])
          redis.call("PEXPIRE", KEYS[1], ttlMs)
          return nextValue
          `,
          [key],
          [IP_LOCK_TTL_MS],
        )
      },
    }
  } catch {
    return {
      release: async () => {},
    }
  }
}
