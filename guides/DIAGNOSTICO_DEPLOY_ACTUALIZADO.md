# 🔧 Diagnóstico de Errores en Deploy (Vercel)

> Este documento es una guía rápida de diagnóstico en runtime.
> La guía canónica de resolución y checklist integral está en [SOLUCION_DEPLOY_DB.md](./SOLUCION_DEPLOY_DB.md).
> Para errores de migraciones Prisma (P3009, P3015, columnas faltantes) seguir primero [SOLUCION_DEPLOY_DB.md](./SOLUCION_DEPLOY_DB.md).

## Problema Actual
Errores de conexión a la base de datos en Vercel después de actualizar las variables de entorno.

---

## ✅ Cambios Realizados (Actualización)

### 1. Optimización del Pool de Conexiones (`src/utils/db.ts`)
- ✅ **max: 10** (reducido de 15) - Más conservador para serverless
- ✅ **min: 0** (reducido de 1) - Permite que el pool se vacíe completamente
- ✅ **allowExitOnIdle: true** - Permite que las funciones terminen sin conexiones activas
- ✅ **connectionTimeoutMillis: 30000** - 30s para cold starts
- ✅ **idleTimeoutMillis: 20000** - Libera conexiones más rápido
- ✅ **Logging mejorado** - Más información sobre conexiones y errores
- ✅ **beforeExit handler** - Cierra conexiones limpiamente en Vercel

### 2. Nuevos Helpers (`src/utils/dbHelpers.ts`)
- ✅ `withDatabaseConnection()` - Wrapper para API routes
- ✅ `withDatabaseTimeout()` - Timeout configurable para operaciones
- ✅ Manejo automático de errores con códigos HTTP apropiados

---

## 🔍 Pasos de Diagnóstico

### Paso 1: Verificar Variables de Entorno en Vercel

```bash
# En tu dashboard de Vercel:
# Settings → Environment Variables

# Verifica que DIRECT_DATABASE_URL tenga estos parámetros:
?sslmode=require&connect_timeout=30&socket_timeout=30&statement_timeout=30000
```

**Estructura correcta:**
```
postgres://[USER]:[PASSWORD]@db.prisma.io:5432/postgres?sslmode=require&connect_timeout=30&socket_timeout=30&statement_timeout=30000
```

### Paso 2: Revisar Logs en Vercel

```bash
# En Vercel Dashboard:
# Tu Proyecto → Logs → Runtime Logs (o Functions)

# Busca estos patrones:
```

**🟢 Logs buenos (funcionando):**
```
[DB] Initializing production database connection...
[DB] New connection established
[DB Request] GET /api/health - Success (250ms)
```

**🟡 Logs de advertencia (recuperándose):**
```
[Retry] Attempt 2/3 failed: { isTransient: 'YES (will retry)' }
[DB Pool Error] ETIMEDOUT
[DB] Connection removed from pool
```

**🔴 Logs de error crítico (problema serio):**
```
[DB CRITICAL] Connection pool failure - may need restart
P1001: Can't reach database server
Error: Database connection error
[Retry] Attempt 3/3 failed
```

### Paso 3: Probar el Endpoint de Health

```bash
# Desde tu terminal local:
curl https://TU-DOMINIO.vercel.app/api/health

# O desde el navegador:
https://TU-DOMINIO.vercel.app/api/health
```

**Respuesta esperada (✅ funcionando):**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-08T20:30:00.000Z",
  "totalResponseTime": "350ms",
  "environment": "production",
  "databaseUrl": "DIRECT_DATABASE_URL (configured)",
  "checks": {
    "database": { "status": "healthy", "responseTime": 120 },
    "prismaQuery": { "status": "healthy", "responseTime": 85 },
    "authCount": { "status": "healthy", "responseTime": 95, "count": 138 },
    "loginSimulation": { "status": "healthy", "responseTime": 50 }
  }
}
```

**Respuesta con errores (❌ problema):**
```json
{
  "status": "unhealthy",
  "checks": {
    "database": {
      "status": "unhealthy",
      "responseTime": 10050,
      "error": "Health check timeout after 10000ms"
    }
  }
}
```

---

## 🛠️ Soluciones Específicas por Tipo de Error

### Error A: "Connection Timeout" o "ETIMEDOUT"

**Síntomas:**
```
Error: connect ETIMEDOUT
Error: Connection timeout after 30000ms
```

**Causas posibles:**
1. La BD está demasiado lejos de la región de Vercel
2. Firewall bloqueando conexiones desde IPs de Vercel
3. La BD está temporalmente saturada

**Soluciones:**
```bash
1. Verifica la región de tu BD en Prisma Console
   - Debe ser la misma o cercana a tu región de Vercel
   
2. Agrega las IPs de Vercel a la allowlist (si aplica)
   - Ve a la configuración de tu BD
   - Busca "Network Access" o "IP Allowlist"
   - Agrega las IPs de Vercel (busca en docs de Vercel)

3. Aumenta los timeouts aún más (solo si es necesario):
   &connect_timeout=60&socket_timeout=60&statement_timeout=60000
```

### Error B: "Too many connections" o "Pool exhausted"

**Síntomas:**
```
Error: sorry, too many clients already
Error: Connection pool exhausted
```

**Causas posibles:**
1. Muchas funciones serverless creando pools simultáneamente
2. Conexiones no se están cerrando correctamente
3. La BD tiene un límite bajo de conexiones

**Soluciones:**
```typescript
// En src/utils/db.ts, reduce más el pool:
const poolConfig = {
  connectionString,
  max: 5, // Reducir a 5 conexiones
  min: 0,
  // ... resto igual
};

// O usa Prisma Accelerate para connection pooling centralizado
```

### Error C: "P1001: Can't reach database server"

**Síntomas:**
```
PrismaClientInitializationError: P1001
failed to connect to upstream database
```

**Causas posibles:**
1. Variable de entorno no está configurada en Vercel
2. URL de conexión incorrecta o malformada
3. La BD está pausada o inaccesible

**Soluciones:**
```bash
1. Verifica que DIRECT_DATABASE_URL esté en Vercel:
   - Settings → Environment Variables
   - Debe estar en Production, Preview, Development

2. Verifica que la URL sea correcta:
   - Copia la URL desde Prisma Console
   - Pégala en Vercel
   - Agrega los parámetros de timeout

3. Verifica el estado de tu BD:
   - Ve a Prisma Console (https://console.prisma.io)
   - Busca tu proyecto
   - Verifica que esté "Active" (no "Paused")
```

### Error D: "Authentication failed"

**Síntomas:**
```
Error: password authentication failed
Error: invalid credentials
```

**Causas posibles:**
1. Usuario/password incorrectos en la URL
2. La BD requiere autenticación diferente
3. Credenciales expiradas

**Soluciones:**
```bash
1. Regenera las credenciales en Prisma Console
2. Actualiza DIRECT_DATABASE_URL en Vercel con las nuevas credenciales
3. Redeploy
```

---

## 🚀 Checklist de Deployment

Después de hacer cambios, sigue estos pasos:

- [ ] **1. Build local exitoso**
  ```bash
  npm run build
  # Debe completar sin errores
  ```

- [ ] **2. Commit y push**
  ```bash
  git add .
  git commit -m "fix: optimize db connections for Vercel"
  git push origin main
  ```

- [ ] **3. Esperar deploy automático** (2-3 min)
  - Ve a Vercel Dashboard
  - Espera que el build termine con ✓

- [ ] **4. Verificar logs inmediatamente**
  - Runtime Logs tab
  - Busca mensajes de [DB]

- [ ] **5. Probar health endpoint** (después de 1 min)
  ```bash
  curl https://tu-dominio.vercel.app/api/health
  ```

- [ ] **6. Probar funcionalidad real**
  - Intenta hacer login
  - Carga algunas páginas
  - Verifica que no hay errores

- [ ] **7. Monitorear por 10-15 minutos**
  - Mantén los logs abiertos
  - Verifica que no aparezcan errores P1001
  - Confirma que los retry son exitosos

---

## 📊 Métricas de Éxito

| Métrica | Objetivo | Cómo Medir |
|---------|----------|------------|
| Health check | <500ms | `/api/health` response time |
| P1001 errors | <2 por hora | Logs de Vercel |
| Successful retries | >95% | [Retry] logs con "succeeded" |
| Disponibilidad | >99% | Uptime monitoring |

---

## 🆘 Si Nada Funciona

### Opción 1: Usar Prisma Accelerate

Prisma Accelerate maneja el connection pooling por ti:

```typescript
// En Vercel, configura DATABASE_URL en lugar de DIRECT_DATABASE_URL:
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."

// En src/utils/db.ts, elimina el adaptador pg:
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()
export default prisma
```

**Ventajas:**
- Connection pooling automático
- Caching de queries
- Mejor performance global
- Sin necesidad de configurar Pool manualmente

### Opción 2: Migrar a Base de Datos Serverless

Considera migrar a una BD optimizada para serverless:

**Neon (Recomendado para Vercel):**
- Serverless PostgreSQL
- Auto-scaling
- Integración nativa con Vercel
- Plan gratuito generoso

**Supabase:**
- PostgreSQL con pooling built-in
- Dashboard visual
- Auth y Storage incluidos

**PlanetScale:**
- MySQL serverless
- Branching de BD
- Sin migraciones necesarias

### Opción 3: Contactar Soporte

Si los errores persisten:

1. **Prisma Support:** https://www.prisma.io/support
2. **Vercel Support:** https://vercel.com/support
3. **Proporciona:**
   - Screenshots de logs
   - Variables de entorno (sin credenciales)
   - Respuesta del `/api/health`
   - Este documento de diagnóstico

---

## 📝 Próximos Pasos

1. **Inmediato:** Hacer commit y push de los cambios
2. **5 minutos:** Verificar que el deploy fue exitoso
3. **15 minutos:** Monitorear logs y probar health check
4. **1 hora:** Confirmar que no hay errores recurrentes
5. **24 horas:** Revisar métricas de disponibilidad

---

## ✅ Resumen de Mejoras Aplicadas

- ✅ Pool optimizado para Vercel serverless (max: 10, min: 0)
- ✅ Timeouts aumentados para cold starts (30s)
- ✅ Cleanup automático de conexiones (allowExitOnIdle)
- ✅ Logging detallado para debugging
- ✅ Helpers para mejor manejo de errores
- ✅ Health check con retry automático

**Estado:** Listo para deploy. Las configuraciones están optimizadas para entornos serverless de Vercel.
