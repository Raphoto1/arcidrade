import { PrismaClient } from "@/generated/prisma"
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// En producción (Vercel), usar DATABASE_URL (Prisma Accelerate)
// En desarrollo, usar DIRECT_DATABASE_URL para conexión directa
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = isProduction 
  ? process.env.DATABASE_URL 
  : (process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL);

if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_DATABASE_URL must be defined')
}

const useAccelerate = connectionString.includes('accelerate.prisma-data.net');

// Crear el pool fuera del check global
let pool: Pool;
let adapter: PrismaPg;
let prismaClient: PrismaClient;

const poolConfig = {
  connectionString,
  max: 10, // Reducido a 10 para Vercel serverless (más conservador)
  min: 0, // 0 para permitir que el pool se vacíe en funciones serverless
  idleTimeoutMillis: 20000, // 20 segundos - más agresivo para liberar conexiones
  connectionTimeoutMillis: 30000, // 30s para dar más tiempo en cold starts
  statement_timeout: 30000, // 30s timeout para queries
  // Permitir que el pool cierre conexiones más rápido
  allowExitOnIdle: true,
};

function setupPoolErrorHandling(pool: Pool) {
  pool.on('error', (err) => {
    console.error('[DB Pool Error]', {
      message: err.message,
      code: (err as any).code,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV
    });
    
    // Log critical errors separately for monitoring
    if ((err as any).code === 'ECONNREFUSED' || (err as any).code === 'ETIMEDOUT') {
      console.error('[DB CRITICAL] Connection pool failure - may need restart:', err.message);
    }
  });

  pool.on('connect', (client) => {
    console.log('[DB] New connection established');
    // Set statement timeout on each connection
    client.query('SET statement_timeout = 30000').catch(err => {
      console.error('[DB] Error setting statement_timeout:', err.message)
    });
  });

  pool.on('remove', () => {
    console.log('[DB] Connection removed from pool')
  });
}

if (process.env.NODE_ENV === 'production') {
  // En producción usar Prisma Accelerate (más confiable para Vercel)
  console.log('[DB] Initializing production database connection...');
  console.log('[DB] Environment:', process.env.NODE_ENV);
  console.log('[DB] Connection string prefix:', connectionString?.substring(0, 30));
  console.log('[DB] Using Accelerate:', useAccelerate);
  console.log('[DB] Has DATABASE_URL:', !!process.env.DATABASE_URL);
  console.log('[DB] Has DIRECT_DATABASE_URL:', !!process.env.DIRECT_DATABASE_URL);
  
  if (useAccelerate) {
    // Con Prisma Accelerate, pasar la URL como accelerateUrl
    console.log('[DB] Creating PrismaClient with Accelerate');
    const { withAccelerate } = require('@prisma/extension-accelerate');
    prismaClient = new PrismaClient({
      // @ts-ignore - accelerateUrl es válido pero puede no estar en tipos
      accelerateUrl: connectionString,
      log: [
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    }).$extends(withAccelerate()) as any;
  } else {
    console.log('[DB] Creating PrismaClient with Pool adapter (direct connection)');

    // Fallback a conexión directa (menos recomendado para Vercel)
    pool = new Pool(poolConfig);
    setupPoolErrorHandling(pool);
    adapter = new PrismaPg(pool);
    prismaClient = new PrismaClient({ 
      adapter,
      log: [
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });
  }
  
  // En Vercel, cerrar conexiones cuando la función termina
  if (typeof process !== 'undefined' && process.on) {
    process.on('beforeExit', async () => {
      console.log('[DB] Closing database connections before exit...');
      await prismaClient.$disconnect();
      if (pool) await pool.end();
    });
  }
} else {
  // En desarrollo, usar singleton global para evitar múltiples instancias con HMR
  if (!(global as any).prisma) {
    console.log('[DB] Initializing development database connection...');
    
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
    console.log('[DB] Reusing existing database connection (HMR)');
  }
}

const prisma = prismaClient

export default prisma
