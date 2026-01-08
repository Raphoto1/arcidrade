import { NextResponse } from 'next/server';
import prisma from '@/utils/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Test 1: Query simple
    const testQuery = await prisma.$queryRaw`SELECT 1 as test`;
    const queryTime = Date.now() - startTime;
    
    // Test 2: Count de usuarios
    const countStart = Date.now();
    const userCount = await prisma.auth.count();
    const countTime = Date.now() - countStart;
    
    // Información del entorno
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasDirectUrl: !!process.env.DIRECT_DATABASE_URL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      directUrlPrefix: process.env.DIRECT_DATABASE_URL?.substring(0, 30) + '...',
    };
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      tests: {
        rawQuery: { success: true, time: `${queryTime}ms` },
        countQuery: { success: true, time: `${countTime}ms`, count: userCount }
      },
      environment: envInfo,
      totalTime: `${Date.now() - startTime}ms`
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('[DB Status] Error:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        code: error.code,
        name: error.name,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDirectUrl: !!process.env.DIRECT_DATABASE_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      },
      totalTime: `${Date.now() - startTime}ms`
    }, { status: 503 });
  }
}
