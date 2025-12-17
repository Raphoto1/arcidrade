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
  max: 20, // Reducido de 30 para evitar agotamiento en Vercel
  min: 2, // Reducido de 5 para evitar overhead
  idleTimeoutMillis: 60000, // 60 segundos - tiempo razonable para que pool se mantenga
  connectionTimeoutMillis: 10000, // Reducido de 15000 - falla rápido si no conecta
  statement_timeout: 60000, // Reducido de 120000 - timeout más corto
  // Validar conexiones antes de usarlas
  validationQuery: 'SELECT 1',
};

function setupPoolErrorHandling(pool: Pool) {
  pool.on('error', (err) => {
    console.error('[DB Pool Error]', {
      message: err.message,
      code: (err as any).code,
      timestamp: new Date().toISOString()
    });
    
    // Log critical errors separately for monitoring
    if ((err as any).code === 'ECONNREFUSED' || (err as any).code === 'ETIMEDOUT') {
      console.error('[DB CRITICAL] Connection pool failure - may need restart:', err.message);
    }
  });

  pool.on('connect', () => {
    // Set statement timeout on each connection
    pool.query('SET statement_timeout = 60000').catch(err => {
      console.error('[DB] Error setting statement_timeout:', err.message)
    });
  });

  pool.on('remove', () => {
    console.debug('[DB] Connection removed from pool')
  });
}

if (process.env.NODE_ENV === 'production') {
  // En producción, usar el patrón normal
  pool = new Pool(poolConfig)
  
  setupPoolErrorHandling(pool)
  
  adapter = new PrismaPg(pool)
  prismaClient = new PrismaClient({ 
    adapter,
    // Log solo errores en producción
    log: ['error'],
  })
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
