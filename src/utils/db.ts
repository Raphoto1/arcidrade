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

const poolConfig = {
  connectionString,
  max: 30,
  min: 5,
  idleTimeoutMillis: 120000, // 2 minutos - evita cortes inesperados
  connectionTimeoutMillis: 15000, // 15 segundos para conectar
  statement_timeout: 120000, // 2 minutos query timeout
  // Validar conexiones antes de usarlas
  validationQuery: 'SELECT 1',
};

function setupPoolErrorHandling(pool: Pool) {
  pool.on('error', (err) => {
    console.error('[DB Pool Error]', {
      message: err.message,
      code: (err as any).code,
      timestamp: new Date().toISOString()
    })
  })

  pool.on('connect', () => {
    // Set statement timeout on each connection
    pool.query('SET statement_timeout = 120000').catch(err => {
      console.error('[DB] Error setting statement_timeout:', err.message)
    })
  })

  pool.on('remove', () => {
    console.debug('[DB] Connection removed from pool')
  })
}

if (process.env.NODE_ENV === 'production') {
  // En producción, usar el patrón normal
  pool = new Pool(poolConfig)
  
  setupPoolErrorHandling(pool)
  
  adapter = new PrismaPg(pool)
  prismaClient = new PrismaClient({ adapter })
} else {
  // En desarrollo, usar singleton global para evitar múltiples instancias con HMR
  if (!(global as any).prisma) {
    pool = new Pool(poolConfig)
    
    setupPoolErrorHandling(pool)
    
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
