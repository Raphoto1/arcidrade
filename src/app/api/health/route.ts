import { NextResponse } from 'next/server';
import prisma from '@/utils/db';

// Marcar esta ruta como pública (sin caché)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Timeout global para health check (10 segundos)
const HEALTH_CHECK_TIMEOUT = 10000;

function createTimeoutPromise<T>(ms: number): Promise<T> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Health check timeout after ${ms}ms`)), ms)
  );
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([promise, createTimeoutPromise<T>(ms)]);
}

export async function GET() {
  const startTime = Date.now();
  const checks = {
    database: { status: 'unknown', responseTime: 0, error: null as string | null },
    prismaQuery: { status: 'unknown', responseTime: 0, error: null as string | null },
    authCount: { status: 'unknown', responseTime: 0, error: null as string | null, count: 0 },
    loginSimulation: { status: 'unknown', responseTime: 0, error: null as string | null }
  };
  
  try {
    // Test 1: Query simple con $queryRaw
    const dbStart = Date.now();
    await withTimeout(prisma.$queryRaw`SELECT 1`, HEALTH_CHECK_TIMEOUT);
    checks.database.responseTime = Date.now() - dbStart;
    checks.database.status = 'healthy';
  } catch (error) {
    checks.database.responseTime = Date.now() - startTime;
    checks.database.status = 'unhealthy';
    checks.database.error = error instanceof Error ? error.message : 'Unknown error';
  }

  try {
    // Test 2: Query con Prisma ORM
    const prismaStart = Date.now();
    const result = await withTimeout(
      prisma.$queryRaw<Array<{ result: number }>>`SELECT 1 as result`,
      HEALTH_CHECK_TIMEOUT
    );
    checks.prismaQuery.responseTime = Date.now() - prismaStart;
    checks.prismaQuery.status = 'healthy';
  } catch (error) {
    checks.prismaQuery.responseTime = Date.now() - startTime;
    checks.prismaQuery.status = 'unhealthy';
    checks.prismaQuery.error = error instanceof Error ? error.message : 'Unknown error';
  }

  try {
    // Test 3: Query a una tabla real (simula login)
    const authStart = Date.now();
    const auth = await withTimeout(
      prisma.auth.findFirst({
        select: { referCode: true },
        where: { status: { not: 'desactivated' } }
      }),
      HEALTH_CHECK_TIMEOUT
    );
    checks.authCount.responseTime = Date.now() - authStart;
    checks.authCount.status = 'healthy';
    checks.authCount.count = auth ? 1 : 0;
  } catch (error) {
    checks.authCount.responseTime = Date.now() - startTime;
    checks.authCount.status = 'unhealthy';
    checks.authCount.error = error instanceof Error ? error.message : 'Unknown error';
  }

  try {
    // Test 4: Simular query de login (findUnique con select)
    const loginStart = Date.now();
    await withTimeout(
      prisma.auth.findUnique({
        where: { email: 'health-check@test.invalid' },
        select: { referCode: true, email: true, password: true, area: true, status: true }
      }),
      HEALTH_CHECK_TIMEOUT
    );
    checks.loginSimulation.responseTime = Date.now() - loginStart;
    checks.loginSimulation.status = 'healthy';
  } catch (error) {
    checks.loginSimulation.responseTime = Date.now() - startTime;
    checks.loginSimulation.status = 'unhealthy';
    checks.loginSimulation.error = error instanceof Error ? error.message : 'Unknown error';
  }

  const overallStatus = 
    checks.database.status === 'healthy' && 
    checks.prismaQuery.status === 'healthy' && 
    checks.authCount.status === 'healthy' &&
    checks.loginSimulation.status === 'healthy'
      ? 'healthy' 
      : 'unhealthy';

  const totalResponseTime = Date.now() - startTime;

  const response = NextResponse.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    totalResponseTime: `${totalResponseTime}ms`,
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DIRECT_DATABASE_URL ? 'DIRECT_DATABASE_URL (configured)' : 'DATABASE_URL (configured)',
    checks
  }, { 
    status: overallStatus === 'healthy' ? 200 : 503 
  });

  // Headers para permitir acceso público
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET');
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  
  return response;
}
