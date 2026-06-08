# Runbook Corto - PRISMA_P1001_FIX

Guia extensa: [PRISMA_P1001_FIX.md](../PRISMA_P1001_FIX.md)

## Objetivo
Mitigar P1001 con ajustes de pool, retries y timeout de conexion.

## Pasos rapidos
1. Verifica configuracion de pool en src/utils/db.ts.
2. Verifica withRetry/withPrismaRetry en src/utils/retryUtils.ts.
3. Ajusta timeout de URL DB en Vercel.
4. Ejecuta build y deploy.
5. Valida /api/health y endpoints criticos.
6. Revisa logs de transientes vs permanentes.

## Comandos utiles
```bash
npm run build
npx prisma migrate status
```

## Escalamiento
Si persiste, sube timeout, reduce concurrencia, y revisa estado/conexiones de la DB.
