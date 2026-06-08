# Runbook Corto - DATABASE_DIAGNOSTICS

Guia extensa: [DATABASE_DIAGNOSTICS.md](../DATABASE_DIAGNOSTICS.md)

## Objetivo
Confirmar salud DB y detectar fallas de conexion de forma rapida.

## Pasos rapidos
1. Ejecuta health check: GET /api/health.
2. Valida status general y tiempos por check.
3. Corre diagnostico local: npm run test:database.
4. Verifica variables en deploy: DATABASE_URL, DIRECT_DATABASE_URL, NEXTAUTH_URL.
5. Revisa logs de auth para errores de conexion.
6. Si hay timeout, aumenta connect/socket timeout en connection string.

## Comandos utiles
```bash
npm run test:database
npx prisma migrate status
```

## Escalamiento
Si el problema persiste, sigue la guia extensa y documenta timestamps de fallos para correlacionar con logs de deploy.
