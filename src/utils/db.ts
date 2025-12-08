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
  max: 20,
  min: 2,
  idleTimeoutMillis: 120000, // 2 minutos - evita cortes inesperados
  connectionTimeoutMillis: 10000, // 10 segundos para conectar
  statement_timeout: 120000, // 2 minutos query timeout
};

if (process.env.NODE_ENV === 'production') {
  // En producción, usar el patrón normal
  pool = new Pool(poolConfig)
  
  pool.on('error', (err) => {
    console.error('[DB] Pool error:', err)
  })
  
  pool.on('connect', () => {
    // Set statement timeout on each connection
    pool.query('SET statement_timeout = 120000')
  })
  
  adapter = new PrismaPg(pool)
  prismaClient = new PrismaClient({ adapter })
} else {
  // En desarrollo, usar singleton global para evitar múltiples instancias con HMR
  if (!(global as any).prisma) {
    pool = new Pool(poolConfig)
    
    pool.on('error', (err) => {
      console.error('[DB] Pool error:', err)
    })
    
    pool.on('connect', () => {
      pool.query('SET statement_timeout = 120000')
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
