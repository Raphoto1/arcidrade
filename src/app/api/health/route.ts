import { NextResponse } from 'next/server';
import prisma from '@/utils/db';

// Marcar esta ruta como pública (sin caché)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();
  const checks = {
    database: { status: 'unknown', responseTime: 0, error: null as string | null },
    prismaQuery: { status: 'unknown', responseTime: 0, error: null as string | null },
    authCount: { status: 'unknown', responseTime: 0, error: null as string | null, count: 0 }
  };
  
  try {
    // Test 1: Query simple con $queryRaw
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
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
    const result = await prisma.$queryRaw<Array<{ result: number }>>`SELECT 1 as result`;
    checks.prismaQuery.responseTime = Date.now() - prismaStart;
    checks.prismaQuery.status = 'healthy';
  } catch (error) {
    checks.prismaQuery.responseTime = Date.now() - startTime;
    checks.prismaQuery.status = 'unhealthy';
    checks.prismaQuery.error = error instanceof Error ? error.message : 'Unknown error';
  }

  try {
    // Test 3: Query a una tabla real
    const authStart = Date.now();
    const count = await prisma.auth.count();
    checks.authCount.responseTime = Date.now() - authStart;
    checks.authCount.status = 'healthy';
    checks.authCount.count = count;
  } catch (error) {
    checks.authCount.responseTime = Date.now() - startTime;
    checks.authCount.status = 'unhealthy';
    checks.authCount.error = error instanceof Error ? error.message : 'Unknown error';
  }

  const overallStatus = 
    checks.database.status === 'healthy' && 
    checks.prismaQuery.status === 'healthy' && 
    checks.authCount.status === 'healthy'
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
