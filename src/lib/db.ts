import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
  return new PrismaClient({
    log: ['error', 'warn'],
  });
}

declare global {
   
  var __db: PrismaClient | undefined;
}

export const db = globalThis.__db ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.__db = db;
