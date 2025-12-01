import { PrismaClient } from "@/generated/prisma"
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Use DIRECT_DATABASE_URL for direct connection, fallback to DATABASE_URL
const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_DATABASE_URL must be defined')
}

// Crear el pool fuera del check global
let pool: Pool;
let adapter: PrismaPg;
let prismaClient: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // En producción, usar el patrón normal
  pool = new Pool({ 
    connectionString,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })
  
  adapter = new PrismaPg(pool)
  prismaClient = new PrismaClient({ adapter })
} else {
  // En desarrollo, usar singleton global para evitar múltiples instancias con HMR
  if (!(global as any).prisma) {
    pool = new Pool({ 
      connectionString,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
    
    pool.on('error', (err) => {
      console.error('[DB] Pool error:', err)
    })
    
    adapter = new PrismaPg(pool)
    
    prismaClient = new PrismaClient({
      adapter,
      log: ['error', 'warn'],
    })
    
    ;(global as any).prisma = prismaClient
    ;(global as any).pgPool = pool
  } else {
    prismaClient = (global as any).prisma
  }
}

const prisma = prismaClient

export default prisma
