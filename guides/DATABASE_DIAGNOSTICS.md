# 🔧 Diagnóstico y Optimización de Conexión a Base de Datos

## Problemas Identificados

### 1. ❌ Health Endpoint Insuficiente
**Ubicación:** [src/app/api/health/route.ts](src/app/api/health/route.ts)

**Problema:** El endpoint solo hacía queries simples (`SELECT 1`) sin:
- Timeout real que simule presión de conexión
- Queries complejas como las de login
- Validación de pool exhaustion

**Solución Implementada:**
```typescript
// Agregados:
✅ withTimeout() wrapper con límite de 10 segundos
✅ Nuevo test: loginSimulation (simula query de login real)
✅ Mejor manejo de errores con detalles de timeout
```

### 2. ❌ Pool de Conexiones Sin Recuperación
**Ubicación:** [src/utils/db.ts](src/utils/db.ts)

**Problema:**
- Configuración de pool no alineada para entorno serverless
- Timeouts de conexión y query no estandarizados
- Falta de claridad entre `DATABASE_URL` (prod) y `DIRECT_DATABASE_URL` (dev/migrate)

**Solución Implementada:**
```typescript
✅ Pool actual: max=10, min=0, idleTimeoutMillis=20000, connectionTimeoutMillis=30000, statement_timeout=30000
✅ En producción usa `DATABASE_URL` (con soporte Accelerate)
✅ En desarrollo usa `DIRECT_DATABASE_URL` y singleton global para HMR
```

### 3. ❌ Logs de Autenticación Insuficientes
**Ubicación:** [src/utils/authOptions.ts](src/utils/authOptions.ts)

**Problema:** El catch block no diferenciaba entre:
- Credenciales inválidas
- Errores de conexión a BD
- Timeouts

**Solución Implementada:**
```typescript
✅ Log detallado con:
  - message, code, email, timestamp
  - connectionError: bool (detecta ECONNREFUSED, timeout, etc)
  - Facilita debugging en producción
```

## 🧪 Cómo Probar

### Test 1: Health Check
```bash
# Desde terminal, curl el endpoint
curl https://tu-dominio.com/api/health | jq

# Resultado esperado:
{
  "status": "healthy",
  "totalResponseTime": "42ms",
  "checks": {
    "database": { "status": "healthy", "responseTime": 5 },
    "prismaQuery": { "status": "healthy", "responseTime": 3 },
    "authCount": { "status": "healthy", "responseTime": 4 },
    "loginSimulation": { "status": "healthy", "responseTime": 6 }
  }
}
```

### Test 2: Script de Diagnóstico (Nuevo)
```bash
# Ejecutar script de testing
npm run test:database

# Prueba 5 escenarios:
# 1. Pool Connection - Conexión al pool
# 2. Prisma Client - Inicialización del cliente
# 3. Simple Query - SELECT 1
# 4. Login Query - findUnique como en autenticación
# 5. Count Query - Query sobre tabla real
```

### Test 3: Login Directo
```bash
# Desde navegador o curl
# Intenta hacer login en /auth/login
# Revisa logs en producción por mensajes:
# [AUTH] Authorization error con detalles
```

## 📋 Variables de Entorno Críticas

Este repositorio no incluye un `.env.production.example` versionado. Configura variables directamente en tu proveedor de deploy (Vercel).

**Cambios requeridos en Vercel/Deploy:**

```bash
# 1. NEXTAUTH_URL DEBE ser tu dominio de producción, NO localhost
NEXTAUTH_URL="https://plataforma.company.com"
NEXTAUTH_SECRET="secure-random-string"

# 2. PLAT_URL DEBE coincider con NEXTAUTH_URL
PLAT_URL="https://plataforma.company.com/"

# 3. DATABASE_URL - Elige UNA opción:
# Opción A: Prisma Accelerate (recomendado para Vercel)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"

# Opción B: Conexión directa (si la BD está en Prisma Postgres)
DIRECT_DATABASE_URL="postgres://user:pass@host:5432/db?sslmode=require"
```

## 🎯 Checklist de Deploy

- [ ] Configurar variables directamente en Vercel (sin `.env.production.example`)
- [ ] Reemplazar `your-production-domain.com` con dominio real
- [ ] Verificar que NEXTAUTH_URL coincida exactamente con dominio de deploy
- [ ] Probar `/api/health` desde navegador de producción
- [ ] Hacer login en producción y revisar logs
- [ ] Si falla, ejecutar `npm run test:database` localmente con datos de producción

## 📊 Métricas de Monitoreo

Después de deploy, monitorear:

```bash
# Tiempo de respuesta de queries
curl -w "@curl-format.txt" https://tu-dominio/api/health

# Logs de error en función authorize()
tail -f logs/production.log | grep AUTH

# Estado del pool
# Revisar en logs: "Connection removed from pool" = rotación normal
# Revisar en logs: "Pool error" = problema de conexión
```

## 🔍 Investigación Adicional (si sigue fallando)

1. **Verificar API key de Prisma Accelerate:**
   ```bash
   curl https://accelerate.prisma-data.net/health
   # Debe responder 200 OK
   ```

2. **Verificar whitelist IP de BD:**
   - Si usas DIRECT_DATABASE_URL, revisa firewall en BD
   - IP de Vercel cambia, por eso se prefiere DATABASE_URL

3. **Revisar logs de Prisma:**
   ```bash
   # Habilitar logs detallados en src/utils/db.ts
   log: ['query', 'error', 'warn']
   ```

4. **Aumentar connectionTimeoutMillis si es muy lento:**
   ```typescript
   // En src/utils/db.ts
   connectionTimeoutMillis: 30000 // aumentar de 15000
   ```

## ✅ Cambios Realizados

| Archivo | Cambio |
|---------|--------|
| `src/app/api/health/route.ts` | ✅ Agregado: timeout wrapper, loginSimulation test |
| `src/utils/db.ts` | ✅ Pool y estrategia de conexión ajustados para serverless + Accelerate |
| `src/utils/authOptions.ts` | ✅ Mejorado: logs detallados de error con connectionError flag |
| Variables de entorno (Vercel) | ✅ Documentadas para configuración manual en deploy |
| `scripts/test-database.ts` | ✅ Creado: script de diagnóstico |
| `package.json` | ✅ Agregado: script `npm run test:database` |

