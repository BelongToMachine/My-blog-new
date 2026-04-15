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

export async function withPrismaFallback<T>(
  action: () => Promise<T>,
  fallback: T,
  context: string
) {
  try {
    return await action()
  } catch (error) {
    if (isPrismaConnectivityError(error)) {
      console.error(`[prisma] ${context}`, error)
      return fallback
    }

    throw error
  }
}
