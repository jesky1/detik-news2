import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
  return new PrismaClient({
    log: ['error', 'warn'],
  });
}

declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined;
}

export const db = globalThis.__db ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.__db = db;
