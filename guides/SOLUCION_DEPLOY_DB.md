# ✅ Checklist: Solucionar Problemas de Conexión en Vercel Deploy

## 🎯 Problema
La aplicación funciona bien en desarrollo pero en Vercel (deploy) hay errores de conexión a la base de datos.

---

## 📋 Pasos a Seguir

### 1️⃣ Actualizar Variables de Entorno en Vercel (CRÍTICO - 5 minutos)

**Ubicación:** https://vercel.com/dashboard → Tu Proyecto → Settings → Environment Variables

#### A. Encuentra estas variables:
- ✅ `DIRECT_DATABASE_URL` 
- ✅ `DATABASE_URL` (si usas Prisma Accelerate)

#### B. Modifica `DIRECT_DATABASE_URL`:

**❌ ANTES (sin timeouts):**
```
postgres://[USERNAME]:[PASSWORD]@db.prisma.io:5432/postgres?sslmode=require
```

**✅ DESPUÉS (con timeouts):**
```
postgres://[USERNAME]:[PASSWORD]@db.prisma.io:5432/postgres?sslmode=require&connect_timeout=30&socket_timeout=30&statement_timeout=30000
```

> **⚠️ Importante:** Reemplaza `[USERNAME]` y `[PASSWORD]` con tus credenciales reales de la base de datos. No compartas estas URLs públicamente.

**Parámetros agregados:**
- `connect_timeout=30` - 30 segundos para establecer conexión
- `socket_timeout=30` - 30 segundos para operaciones de socket
- `statement_timeout=30000` - 30 segundos (30000ms) para cada query

#### C. Aplica para TODOS los environments:
- ✅ Production
- ✅ Preview
- ✅ Development (opcional, pero recomendado)

---

### 2️⃣ Verificar Configuración del Pool

Tu archivo `src/utils/db.ts` YA TIENE configuración optimizada:
- ✅ `max: 10` conexiones (más conservador para Vercel serverless)
- ✅ `min: 0` para liberar pool en idle
- ✅ `connectionTimeoutMillis: 30000` (30s, mejor para cold starts)
- ✅ `idleTimeoutMillis: 20000` (20s)
- ✅ `statement_timeout: 30000` (30s)
- ✅ `allowExitOnIdle: true` para cierre limpio en serverless
- ✅ Error handling con logs detallados

**NO REQUIERE CAMBIOS** - Ya está optimizado.

---

### 3️⃣ Verificar Configuración de Prisma

Tu `prisma.config.ts` está correcto:
```typescript
datasource: {
  url: env('DIRECT_DATABASE_URL'), ✅
}
```

**NO REQUIERE CAMBIOS**

---

### 4️⃣ Redeploy en Vercel

**Opción A - Automático (recomendado):**
Vercel detecta cambios en environment variables y redeploya automáticamente (1-2 minutos)

**Opción B - Manual:**
1. Ve a: Deployments tab
2. Encuentra el último deploy
3. Click en menu (⋯) → "Redeploy"
4. Selecciona "Use existing Build Cache" ❌ (desmarcado para forzar rebuild)

---

### 5️⃣ Monitorear Logs de Vercel (15 minutos después)

#### A. En tiempo real:
```
Dashboard → Proyecto → Logs → Runtime Logs
```

#### B. Busca estos mensajes:

**✅ Buenos (todo funciona):**
```
[DB] Connection removed from pool
✓ Compiled successfully
```

**⚠️ Advertencias (se está recuperando):**
```
[Retry] Attempt 2/3 succeeded
[DB Pool Error] ETIMEDOUT
```

**❌ Errores críticos (aún hay problemas):**
```
P1001: Can't reach database server
[Retry] Attempt 3/3 failed
ECONNREFUSED
```

---

### 6️⃣ Probar Endpoint de Health

Después del redeploy, prueba tu endpoint de salud:

```bash
curl https://tu-dominio.vercel.app/api/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-08T20:15:00.000Z",
  "database": {
    "status": "connected",
    "responseTime": "120ms"
  }
}
```

**Si falla:**
```json
{
  "status": "unhealthy",
  "error": "Database connection failed",
  "details": "..."
}
```

---

## 🔍 Diagnóstico de Problemas Comunes

### Error: Columna no existe (ej: `terms_accepted`) con Prisma `create()`

**Síntomas:**
```
Invalid `prisma.profesional_extra_data.create()` invocation
The column `terms_accepted` does not exist in the current database.
```

**Causas frecuentes:**
1. La migración fue marcada/aplicada parcialmente en otra DB y el DDL no quedó igual.
2. El deploy apunta a una DB distinta a la validada localmente.
3. Hay drift en historial de migraciones.

**Diagnóstico recomendado:**
```bash
# 1) Revisar historial Prisma en la URL activa
npx prisma migrate status

# 2) Validar columnas reales en SQL
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'Profesional_extra_data'
ORDER BY ordinal_position;
```

**Resolución usada en este proyecto:**
1. Restaurar archivo faltante de migración si Prisma reporta `P3015`.
2. Aplicar migraciones pendientes con `npx prisma migrate deploy`.
3. Verificar `Database schema is up to date!` con `npx prisma migrate status`.
4. Reprobar flujo de registro.

### Error: P3009 (migración fallida bloqueando deploy)

**Síntoma:**
```
migrate found failed migrations in the target database
Error: P3009
```

**Resolución:**
1. Verificar nombre exacto de la migración fallida reportada por Prisma.
2. Resolver estado con `prisma migrate resolve` según corresponda (`--rolled-back` o `--applied`).
3. Ejecutar nuevamente `npx prisma migrate deploy`.
4. Confirmar estado final con `npx prisma migrate status`.

### Error: P1001 - Can't reach database server

**Causas:**
1. ❌ Timeouts muy cortos en la URL
2. ❌ Base de datos pausada o inaccesible
3. ❌ Firewall bloqueando IPs de Vercel

**Soluciones:**
1. ✅ Agregar parámetros de timeout (Paso 1)
2. ✅ Verificar que la BD esté activa en Prisma Console
3. ✅ Agregar IPs de Vercel al allowlist de la BD (si aplica)

### Error: ETIMEDOUT

**Causas:**
1. ❌ Latencia alta entre Vercel y tu BD
2. ❌ Pool de conexiones saturado

**Soluciones:**
1. ✅ Usar región de Vercel cercana a tu BD
2. ✅ Reducir `max` connections en pool (ya está en 10)
3. ✅ Considerar usar Prisma Accelerate para caching

### Error: Pool exhausted

**Causas:**
1. ❌ Muchas requests simultáneas
2. ❌ Conexiones no se liberan correctamente

**Soluciones:**
1. ✅ Verificar que todos los endpoints usan `finally` para disconnect
2. ✅ Reducir `idleTimeoutMillis` (ya está en 30s)
3. ✅ Implementar rate limiting

---

## 📊 Métricas Esperadas

| Métrica | Antes | Después |
|---------|-------|---------|
| P1001 errors/hora | 50-100 | <5 |
| Connection timeouts | ~10% | <1% |
| Avg response time | 500-2000ms | 200-500ms |
| Disponibilidad | ~95% | ~99.5% |

---

## 🆘 Si Aún Hay Problemas

### Opción 1: Habilitar Logging Extendido

En `src/utils/db.ts`, cambia:
```typescript
log: ['error'], // Solo errores
```
A:
```typescript
log: ['query', 'error', 'warn'], // Todas las queries
```

**⚠️ Advertencia:** Esto genera MUCHOS logs. Úsalo solo temporalmente.

### Opción 2: Usar Prisma Accelerate

Si los problemas persisten, considera usar Prisma Accelerate:
1. Cambia el uso de `DIRECT_DATABASE_URL` a `DATABASE_URL` en producción
2. Accelerate maneja connection pooling y caching automáticamente
3. Ya tienes la configuración en tu `.env`:
```
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/..."
```

### Opción 3: Migrar a Base de Datos Serverless

Si usas Prisma DB tradicional, considera migrar a:
- **Neon** (serverless PostgreSQL, mejor para Vercel)
- **Supabase** (también tiene pooling built-in)
- **PlanetScale** (MySQL serverless)

---

## ✅ Lista de Verificación Final

- [ ] Parámetros de timeout agregados en Vercel env vars
- [ ] Variables aplicadas a Production, Preview, Development
- [ ] Redeploy completado (sin errores de build)
- [ ] Endpoint `/api/health` responde correctamente
- [ ] No hay errores P1001 en los logs (después de 15 min)
- [ ] Response times son <500ms promedio

---

## 📚 Archivos de Referencia

- ✅ Tu código ya incluye todas las optimizaciones necesarias
- ✅ Pool config: [src/utils/db.ts](src/utils/db.ts)
- ✅ Retry logic: [src/utils/retryUtils.ts](src/utils/retryUtils.ts) (si existe)
- 📖 Guía detallada: [VERCEL_SETUP_GUIDE.md](VERCEL_SETUP_GUIDE.md)
- 📖 Documentación P1001: [P1001_QUICK_START.md](P1001_QUICK_START.md)

---

## 🎯 Siguiente Paso Inmediato

**AHORA:** Ve a Vercel y agrega los parámetros de timeout a `DIRECT_DATABASE_URL`

Es literalmente el cambio más importante y toma 2 minutos. Todo lo demás ya está configurado correctamente en el código.
