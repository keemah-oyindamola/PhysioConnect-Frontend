import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  // Neon closes idle connections on its side. Dropping ours sooner means the
  // pool shouldn't hand out a connection that's already dead.
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 15_000,
  max: 5,
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}