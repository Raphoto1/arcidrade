# Runbook Corto - P1001_IMPLEMENTATION_CHECKLIST

Guia extensa: [P1001_IMPLEMENTATION_CHECKLIST.md](../P1001_IMPLEMENTATION_CHECKLIST.md)

## Objetivo
Reducir errores intermitentes P1001 en runtime.

## Pasos rapidos
1. Confirma pool actual en db.ts (max 10, min 0, timeouts 30s).
2. Confirma retry util activo para errores transientes.
3. Configura connection string en Vercel con connect/socket timeout.
4. Redeploy.
5. Valida /api/health.
6. Monitorea logs 2 horas para confirmar reduccion de errores.

## Comandos utiles
```bash
npx prisma migrate status
npm run build
```

## Escalamiento
Si persiste P1001, aumentar timeouts y revisar saturacion de conexiones en proveedor DB.
