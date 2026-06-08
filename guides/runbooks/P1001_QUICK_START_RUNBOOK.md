# Runbook Corto - P1001_QUICK_START

Guia extensa: [P1001_QUICK_START.md](../P1001_QUICK_START.md)

## Objetivo
Aplicar fix rapido para P1001 con impacto inmediato.

## Pasos rapidos
1. Abre Vercel > Settings > Environment Variables.
2. Edita DIRECT_DATABASE_URL (o DATABASE_URL si aplica).
3. Agrega connect_timeout y socket_timeout.
4. Guarda y redeploy.
5. Prueba /api/health.
6. Monitorea logs para retries y errores persistentes.

## Escalamiento
Si no mejora, continua con [PRISMA_P1001_FIX_RUNBOOK.md](PRISMA_P1001_FIX_RUNBOOK.md).
