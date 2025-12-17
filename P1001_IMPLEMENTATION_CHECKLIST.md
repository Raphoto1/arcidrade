# ✅ Solución para Errores Intermitentes P1001 - Checklist de Implementación

## Estado Actual: ✅ COMPLETADO

### Cambios Realizados en el Código

#### 1. ✅ `src/utils/db.ts` - Pool Configuration Optimizada
- **Cambios:**
  - `max`: 20 → 15 conexiones (evita agotamiento)
  - `min`: 2 → 1 conexión (reduce overhead)
  - `connectionTimeoutMillis`: 10s → 20s (permite reconexiones lentas)
  - `idleTimeoutMillis`: 60s → 30s (detecta stale connections más rápido)
  - `statement_timeout`: 60s → 30s (falla rápido en queries lentas)
  - **Nuevo:** `idleErrorTimeout: 5000` (limpia conexiones con errores)

- **Ventajas:**
  - Menos conexiones en pool = menos contención en Vercel
  - Mayor timeout de conexión = recuperación de transients lentos
  - Menor timeout de queries = detecta problemas más rápido
  - Validación automática con `SELECT 1`

#### 2. ✅ `src/utils/retryUtils.ts` - P1001 Detection & Smarter Retry Logic
- **Nuevas Funciones:**
  - `isTransientConnectionError()`: Detecta P1001 y otros errores transitorios
    - P1001: "failed to connect to upstream database"
    - ECONNREFUSED, ETIMEDOUT, socket hang up
    - Connection timeout, EHOSTUNREACH, ENETUNREACH
  
  - `withRetry()`: Mejorado con detección de errores transitorios
    - Falla inmediatamente si el error es permanente (no transiente)
    - Reintenta solo si es transiente (conexión, timeout, etc.)
    - Logging mejorado: muestra si error es transitorio
  
  - `withPrismaRetry()`: Wrapper específico para Prisma
    - 3 intentos, backoff exponencial: 100ms → 200ms → 400ms
    - Máximo 3s entre intentos

#### 3. ✅ Documentación Creada
- **`PRISMA_P1001_FIX.md`:**
  - Explicación detallada de qué causa P1001
  - Instrucciones paso a paso para Vercel
  - Parámetros recomendados: `connect_timeout=30`, `socket_timeout=30`
  - Monitoreo y verificación

- **`scripts/diagnose-p1001.sh`:**
  - Script para verificar configuración actual
  - Chequea presencia de retry logic en endpoints
  - Valida parámetros de timeout

---

## ⚠️ ACCIÓN REQUERIDA EN VERCEL (CRÍTICO)

### Paso 1: Abrir Vercel Dashboard
- Ir a: https://vercel.com/dashboard
- Seleccionar tu proyecto

### Paso 2: Environment Variables
- Click en **Settings** → **Environment Variables**

### Paso 3: Actualizar CONNECTION STRING
**Opción A - Si usas DIRECT_DATABASE_URL:**
```
DIRECT_DATABASE_URL="postgresql://user:password@host:5432/database?schema=public&connect_timeout=30&socket_timeout=30"
```

**Opción B - Si usas DATABASE_URL (Accelerate):**
```
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY"
```
(Los timeouts se configuran en Prisma Data Platform console)

### Paso 4: Redeploy
- Vercel automáticamente redeploya con nuevas variables (puede tomar 1-2 min)
- O hacer click en "Redeploy" manualmente

---

## Verificación Post-Deployment

### Test 1: Health Endpoint (inmediato)
```bash
curl https://tu-dominio.com/api/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "checks": {
    "pool": "OK",
    "basicQuery": "OK",
    "transactionTest": "OK",
    "connectionRetry": "OK"
  }
}
```

### Test 2: Logs de Vercel (durante próximas 2 horas)
Ir a **Deployments** → **Logs**

✅ **Bueno:** Sin menciones de P1001 o "[DB CRITICAL]"

⚠️ **Malo:** Muchos `[Retry] Attempt 1/3 failed` (indica que retry logic está trabajando, pero errores ocurren)

### Test 3: Endpoints Públicos
```bash
# API pública
curl https://tu-dominio.com/api/public/process/active

# Debe retornar array con procesos activos
```

---

## Diagrama de Flujo: Cómo el Sistema Maneja P1001 Ahora

```
Request → Prisma Query
           ↓
       [connection pool]
           ↓
      [withPrismaRetry() wrapper]
           ↓
       ¿Error P1001?
       /          \
    Sí             No
    ↓              ↓
 Retry 1    Success ✓
   (espera 100ms)
   ↓
¿Error?
 /   \
Sí    No
↓     ↓
Retry 2  Success ✓
 (espera 200ms)
 ↓
¿Error?
 /   \
Sí    No
↓     ↓
Retry 3  Success ✓
 (espera 400ms)
 ↓
¿Error?
 ↓
Fail → Error Log [P1001]
```

---

## Monitoreo Recomendado (Próximas 48 Horas)

### Métricas a Observar:
1. **P1001 Frequency**: Debe ↓ significativamente
2. **Response Times**: Pueden ↑ ligeramente (por timeouts aumentados) pero más estables
3. **Retry Success Rate**: Esperar ~90%+ de retries exitosos
4. **Pool Saturation**: Logs mostrando menos conexiones agotadas

### Logs Esperados:
✅ `[Retry] Attempt 1/3 failed` seguido de `[Retry] Attempt 2/3 succeeded` = Normal, transient handled

⚠️ `[Retry] Attempt 3/3 failed` = Problema persistente, revisar DB

### Acciones si Persisten Errores:
1. Aumentar más timeouts: `connect_timeout=60&socket_timeout=60`
2. Revisar DB logs: ¿Demasiadas conexiones? ¿Queries lentas?
3. Considerar cambiar `DIRECT_DATABASE_URL` a una conexión no pooled

---

## Archivos Modificados

```
✅ src/utils/db.ts
   └─ Pool configuration optimizado
   └─ Mejor manejo de errores

✅ src/utils/retryUtils.ts
   └─ P1001 detection function
   └─ Smarter retry logic para transients

✅ PRISMA_P1001_FIX.md (NUEVO)
   └─ Documentación completa

✅ scripts/diagnose-p1001.sh (NUEVO)
   └─ Script diagnóstico
```

---

## Resumen Técnico

| Aspecto | Antes | Después |
|---------|-------|---------|
| Pool Max Connections | 20 | 15 |
| Connection Timeout | 10s | 20s |
| Idle Timeout | 60s | 30s |
| Statement Timeout | 60s | 30s |
| Retry Logic | ✅ Implementado | ✅ Mejorado P1001 detection |
| Endpoints con Retry | 7 | 7 (mejorado) |
| P1001 Detection | Genérica | ✅ Específica y detallada |

---

## Próximos Pasos

- [ ] **HOY**: Actualizar `DIRECT_DATABASE_URL` en Vercel con timeouts
- [ ] **HOY**: Redeploy en Vercel
- [ ] **Próximas 2h**: Monitorear logs para P1001 errors
- [ ] **Próximas 24h**: Verificar que frecuencia de P1001 ↓ 80%+
- [ ] **Próximos 7d**: Si no mejora, considerar cambiar a direct connection o aumentar más timeouts

---

**Fecha de implementación:** 2025-12-17  
**Estado:** ✅ Ready for production deployment
