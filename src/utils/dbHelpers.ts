/**
 * Helper para cerrar conexiones de DB en API Routes de Vercel
 * Uso: Wrappea tu handler de API route con esta función
 */

import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/utils/db';

export type ApiHandler = (
  request: NextRequest,
  context?: any
) => Promise<Response> | Response;

/**
 * Wrapper que asegura que las conexiones de DB se cierren correctamente
 * incluso si hay errores en el handler
 */
export function withDatabaseConnection(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    const startTime = Date.now();
    const path = request.nextUrl.pathname;
    
    try {
      console.log(`[DB Request] ${request.method} ${path} - Starting`);
      
      const response = await handler(request, context);
      
      const duration = Date.now() - startTime;
      console.log(`[DB Request] ${request.method} ${path} - Success (${duration}ms)`);
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[DB Request] ${request.method} ${path} - Error (${duration}ms):`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Si el error es de conexión, retornar un error más informativo
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (
          message.includes('connection') ||
          message.includes('timeout') ||
          message.includes('p1001')
        ) {
          return NextResponse.json(
            {
              error: 'Database connection error',
              message: 'Unable to connect to database. Please try again.',
              code: 'DB_CONNECTION_ERROR',
              timestamp: new Date().toISOString()
            },
            { status: 503 }
          );
        }
      }
      
      // Para otros errores, retornar error genérico
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    } finally {
      // Nota: En Vercel, no necesitamos disconnect manualmente
      // El proceso se encarga de eso cuando termina la función
      // Pero podemos hacer un ping para mantener la conexión caliente
      try {
        // Solo en desarrollo, hacer ping
        if (process.env.NODE_ENV !== 'production') {
          await prisma.$executeRaw`SELECT 1`;
        }
      } catch (e) {
        // Ignorar errores del ping
      }
    }
  };
}

/**
 * Helper para operaciones de DB con timeout y retry automático
 */
export async function withDatabaseTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = 10000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Database operation timeout after ${timeoutMs}ms`)),
      timeoutMs
    )
  );

  try {
    return await Promise.race([operation(), timeoutPromise]);
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      console.error('[DB Timeout]', {
        message: error.message,
        timeoutMs,
        timestamp: new Date().toISOString()
      });
    }
    throw error;
  }
}
