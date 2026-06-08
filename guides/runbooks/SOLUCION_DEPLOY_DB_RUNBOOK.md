# Runbook Corto - SOLUCION_DEPLOY_DB

Guia extensa: [SOLUCION_DEPLOY_DB.md](../SOLUCION_DEPLOY_DB.md)

## Objetivo
Resolver fallas de deploy relacionadas con migraciones y drift.

## Pasos rapidos
1. Ejecuta migrate status contra la DB real de deploy.
2. Si hay drift, identifica ultima migracion comun.
3. Corrige historial (resolve applied/rolled-back segun caso).
4. Ejecuta migrate deploy.
5. Ejecuta prisma generate.
6. Revalida endpoint afectado y health.

## Comandos utiles
```bash
npx prisma migrate status
npx prisma migrate deploy
npx prisma generate
```

## Escalamiento
Si hay P3015/P3009, seguir estrategia de recuperacion detallada en guia extensa.
