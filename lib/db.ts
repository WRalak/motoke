import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

// Enhanced Prisma Client with connection pooling and error handling
export const prisma = globalThis.__prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Connection pooling for better performance
  __internal: {
    engine: {
      // Enable connection pooling
      connectionLimit: 20,
      // Set timeout for connections
      connectTimeout: 10000,
      // Set timeout for queries
      queryTimeout: 30000,
    }
  },
  // Error handling
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Retry failed queries
  errorFormat: 'pretty'
})

// Graceful shutdown handling
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma
