// export * from '@prisma/client'

import { PrismaClient } from '@repo/prisma-schema';

declare global {
  var prisma: PrismaClient | undefined;
}

declare const prisma: PrismaClient;

export default prisma;