# Solución para Errores Intermitentes P1001 en Prisma

## Problema
Errores intermitentes "failed to connect to upstream database" (P1001) que aparecen y desaparecen aleatoriamente, especialmente bajo carga o con múltiples requests simultáneos.

## Causa Raíz
Los errores P1001 en Prisma generalmente NO son causados por lógica defectuosa, sino por problemas transitorios en la ruta entre Prisma y la base de datos:
- Timeouts de conexión insuficientes
- Saturación del pooler de conexiones
- Problemas de red intermitentes
- Base de datos temporalmente lenta para aceptar conexiones

## Soluciones Implementadas

### 1. ✅ Configuración de Pool Optimizada en `src/utils/db.ts`
- Reducido `max` de 20 a 15 conexiones (evita agotamiento en Vercel)
- Reducido `min` de 2 a 1 (menos overhead)
- Aumentado `connectionTimeoutMillis` de 10s a 20s (permite reconexiones lentas)
- Reducido `idleTimeoutMillis` de 60s a 30s (descartar conexiones inactivas más rápido)
- Reducido `statement_timeout` a 30s (fallar rápido en queries lentas)
- Agregado `idleErrorTimeout: 5000` (detectar conexiones rotas rápido)
- Agregado event listener para P1001 (logging detallado)

### 2. ✅ Retry Logic Automático
Ya implementado en `src/utils/retryUtils.ts`:
- `withRetry()`: reintentos genéricos con backoff exponencial
- `withPrismaRetry()`: reintentos específicos para Prisma (maneja P1001)
- 3 intentos, delays: 100ms → 200ms → 400ms
- Integrado en 7 endpoints críticos

## ⚠️ ACCIÓN REQUERIDA: Actualizar Variables de Entorno en Vercel

La mejora más importante es aumentar `connect_timeout` y `socket_timeout` en tu connection string. 

### Para Vercel Dashboard:

1. Ve a tu proyecto en **vercel.com**
2. **Settings** → **Environment Variables**
3. Actualiza o crea estas variables:

**Opción A: Si usas DATABASE_URL (con Accelerate/pooler):**
```
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
```
(Los timeouts se configuran en el console de Prisma Data Platform)

**Opción B: Si usas DIRECT_DATABASE_URL (conexión directa a PostgreSQL):**
```
DIRECT_DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public&connect_timeout=30&socket_timeout=30&statement_timeout=30000"
```

### Parámetros Explicados:
- `connect_timeout=30`: Espera hasta 30 segundos para establecer conexión (default: 5s)
- `socket_timeout=30`: Espera 30 segundos para respuestas de la DB (default: sin límite)
- `statement_timeout=30000`: Timeout en ms para cada query individual (30 segundos)

### Después de cambiar las variables:
1. Haz click en "Save"
2. Redeploy la aplicación en Vercel (puede ser automático)
3. Monitorea los logs durante 1-2 horas para verificar que P1001 se reduce

## Verificación

### Local (Development):
```bash
npm run dev
# El app debería levantar sin errores de conexión
```

### Health Check en Producción:
```bash
curl https://tu-dominio.com/api/health
```

Respuesta esperada (si está healthy):
```json
{
  "status": "healthy",
  "timestamp": "2025-12-17T...",
  "checks": {
    "pool": "OK",
    "basicQuery": "OK",
    "transactionTest": "OK",
    "connectionRetry": "OK"
  },
  "poolStatus": {
    "totalCount": 8,
    "idleCount": 5,
    "waitingCount": 0
  }
}
```

## Monitoreo Recomendado

1. **Logs de Vercel**: Busca `[P1001 Connection Error]` o `[DB CRITICAL]`
2. **Health Endpoint**: Monitorealo cada 60s para detectar deterioro
3. **Prisma Data Platform**: Si usas Accelerate, revisa el dashboard para:
   - Connection pool saturation
   - Query latency trends
   - Error rates

## Si Aún Persisten los Errores

### 1. Aumentar más los timeouts:
```
connect_timeout=60&socket_timeout=60
```

### 2. Reducir concurrencia del app (si es posible):
- Implementar rate limiting en endpoints críticos
- Agregar Suspense boundaries para reducir requests simultáneos

### 3. Revisar base de datos:
```sql
-- Conectar a tu BD PostgreSQL
SELECT * FROM pg_stat_activity WHERE state != 'idle';
-- Ver connections activas
SELECT count(*) FROM pg_stat_activity;
```

### 4. Contactar a Prisma:
- Si la DB tiene muchas conexiones inactivas, el pooler puede estar saturado
- Considerar cambiar a `DIRECT_DATABASE_URL` si usas pooler compartido (Supabase, Neon)

## Referencias
- [Prisma P1001 Issues - GitHub](https://github.com/prisma/prisma/issues?q=P1001)
- [PostgreSQL Connection Timeout - PgBouncer Docs](https://www.pgbouncer.org/)
- [Prisma Adapter PG Docs](https://github.com/prisma/prisma/tree/main/packages/adapter-pg)
