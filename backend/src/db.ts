import { Prisma, PrismaClient } from "@prisma/client";

const logLevel: Prisma.LogLevel[] =
  process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"];

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaReadOnly: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: logLevel,
    datasourceUrl: process.env.DATABASE_URL,
  });

export const prismaReadOnly =
  globalForPrisma.prismaReadOnly ??
  new PrismaClient({
    log: logLevel,
    datasourceUrl: process.env.DATABASE_URL_READONLY,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaReadOnly = prismaReadOnly;
}
