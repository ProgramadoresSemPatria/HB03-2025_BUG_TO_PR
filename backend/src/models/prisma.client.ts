import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(env.NODE_ENV === 'development'
      ? { log: ['query', 'error', 'warn'] }
      : { log: ['error'] }),
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}