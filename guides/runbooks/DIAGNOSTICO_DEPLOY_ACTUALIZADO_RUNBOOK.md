# Runbook Corto - DIAGNOSTICO_DEPLOY_ACTUALIZADO

Guia extensa: [DIAGNOSTICO_DEPLOY_ACTUALIZADO.md](../DIAGNOSTICO_DEPLOY_ACTUALIZADO.md)

## Objetivo
Resolver incidentes de deploy relacionados con DB en Vercel.

## Pasos rapidos
1. Verifica variables en Vercel (Production/Preview): DIRECT_DATABASE_URL o DATABASE_URL.
2. Asegura parametros de timeout en URL directa.
3. Redeploy del ultimo commit.
4. Revisa Runtime Logs en Vercel.
5. Prueba GET /api/health.
6. Si falla, clasifica por error: timeout, pool exhausted, P1001, auth failed.

## Comandos utiles
```bash
npm run build
npx prisma migrate status
```

## Escalamiento
Si hay drift/migration errors, usar runbook de [SOLUCION_DEPLOY_DB_RUNBOOK.md](SOLUCION_DEPLOY_DB_RUNBOOK.md).
