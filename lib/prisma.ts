import { PrismaClient } from "@/app/generated/prisma/client";

//globalForPrisma grabs Node's global object (the one thing that survives hot reloads).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

//globalForPrisma.prisma ?? new PrismaClient() reuses the existing client if one's already on the global, otherwise makes one.
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

//The if block stores it on the global only in development. 
// In production there's no hot reload, so I want a clean single instance without touching globals.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}