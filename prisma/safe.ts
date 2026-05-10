import { Prisma } from "@prisma/client"

const prismaConnectivityMessages = [
  "tenant or user not found",
  "can't reach database server",
  "authentication failed",
  "database does not exist",
  "error querying the database",
  "server has closed the connection",
  "max clients reached",
]

const PRISMA_COOLDOWN_MS = 60_000

let prismaUnavailableUntil = 0
let lastPrismaNotice = ""

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function normalizeNoticeKey(context: string, error: unknown): string {
  return `${context}:${getErrorMessage(error).toLowerCase()}`
}

function isPlaceholderDatabaseUrl(value: string | undefined): boolean {
  if (!value) return true

  return (
    value.includes("USER:PASSWORD@HOST") ||
    value.includes("postgresql://USER:PASSWORD@HOST") ||
    value.includes("postgres://USER:PASSWORD@HOST")
  )
}

export const isPrismaConnectivityError = (error: unknown) => {
  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    const message = error.message.toLowerCase()
    return prismaConnectivityMessages.some((candidate) =>
      message.includes(candidate)
    )
  }

  return false
}

export function isPrismaConfigured(): boolean {
  return !isPlaceholderDatabaseUrl(process.env.DATABASE_URL)
}

export function isPrismaTemporarilyUnavailable(): boolean {
  return Date.now() < prismaUnavailableUntil
}

export function shouldBypassPrisma(): boolean {
  return !isPrismaConfigured() || isPrismaTemporarilyUnavailable()
}

export function markPrismaHealthy() {
  prismaUnavailableUntil = 0
}

export function markPrismaUnavailable(context: string, error: unknown) {
  prismaUnavailableUntil = Date.now() + PRISMA_COOLDOWN_MS

  const noticeKey = normalizeNoticeKey(context, error)
  if (noticeKey === lastPrismaNotice) return

  lastPrismaNotice = noticeKey
  console.warn(`[prisma] ${context}; bypassing DB for 60s: ${getErrorMessage(error)}`)
}

export function getPrismaBypassReason(): string {
  if (!isPrismaConfigured()) {
    return "DATABASE_URL is missing or still using the placeholder value"
  }

  return "database connection is temporarily unavailable"
}

export async function withPrismaFallback<T>(
  action: () => Promise<T>,
  fallback: T,
  context: string
) {
  try {
    const result = await action()
    markPrismaHealthy()
    return result
  } catch (error) {
    if (isPrismaConnectivityError(error)) {
      markPrismaUnavailable(context, error)
      return fallback
    }

    throw error
  }
}
