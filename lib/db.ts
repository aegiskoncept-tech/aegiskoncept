import { PrismaClient } from '@prisma/client';

// Ensure consistent SQLite path resolution between Next.js server runtime and Prisma CLI
if (typeof window === 'undefined' && process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:')) {
  try {
    const fs = require('fs');
    const path = require('path');
    const rawPath = process.env.DATABASE_URL.replace('file:', '');
    if (!path.isAbsolute(rawPath)) {
      const cleanRel = rawPath.replace(/^\.\//, '');
      const inPrisma = path.resolve(process.cwd(), 'prisma', cleanRel);
      const inRoot = path.resolve(process.cwd(), cleanRel);

      if (fs.existsSync(inPrisma)) {
        process.env.DATABASE_URL = `file:${inPrisma}`;
      } else if (fs.existsSync(inRoot)) {
        process.env.DATABASE_URL = `file:${inRoot}`;
      }
    }
  } catch {}
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
