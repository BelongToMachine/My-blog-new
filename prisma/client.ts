import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
  prismaDatabaseUrl: string | undefined;
};

const currentDatabaseUrl = process.env.DATABASE_URL;
const prisma = globalForPrisma.prisma && globalForPrisma.prismaDatabaseUrl === currentDatabaseUrl
  ? globalForPrisma.prisma
  : prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaDatabaseUrl = currentDatabaseUrl;
}
