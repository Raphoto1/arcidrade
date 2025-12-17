# 🚀 Vercel Environment Variables - Paso a Paso

## 🎯 Objetivo
Agregar `connect_timeout=30&socket_timeout=30` a tu connection string para evitar P1001 errors.

---

## 📋 Instrucciones (5 minutos)

### Paso 1️⃣: Acceder a Vercel Dashboard
```
1. Abre https://vercel.com/dashboard
2. Selecciona tu proyecto "arcidrade" (o similar)
```

### Paso 2️⃣: Ir a Environment Variables
```
Dashboard → Proyecto → [Settings]
                    └── [Environment Variables]
```

**O directamente:**
```
https://vercel.com/projects/[PROJECT-ID]/settings/environment-variables
```

### Paso 3️⃣: Encontrar tu Connection String
Busca una de estas variables:
- ✅ `DIRECT_DATABASE_URL` (si existe, ESTA es la que debes modificar)
- ✅ `DATABASE_URL` (si no existe DIRECT_DATABASE_URL)
- ❌ `POSTGRES_URL` (no es la correcta, mira las arriba)

### Paso 4️⃣: Copiar el Valor Actual
Haz click en la variable → Ve a "Edit" (lápiz) → Copia el valor actual en un editor de texto (lo necesitarás)

**Ejemplo antes:**
```
postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require
```

### Paso 5️⃣: Agregar Parámetros de Timeout
Pegá el valor en este formato:

**Si termina sin parámetros:**
```
postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require&connect_timeout=30&socket_timeout=30
```

**Si ya tiene parámetros (termina con `?...`):**
```
postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require&other=value&connect_timeout=30&socket_timeout=30
```

**Si ya tiene `schema=public`:**
```
postgresql://user:password@host.neon.tech:5432/dbname?schema=public&sslmode=require&connect_timeout=30&socket_timeout=30
```

### Paso 6️⃣: Pegar en Vercel
```
1. En Vercel Dashboard, haz click en "Edit"
2. Reemplaza TODO el valor (Ctrl+A → Delete)
3. Pega el valor NUEVO con los parámetros agregados
4. Click en "Save"
```

### Paso 7️⃣: Redeploy
**Opción A - Automático (recomendado):**
```
Vercel automáticamente redeploya
(puede tomar 1-2 minutos)
```

**Opción B - Manual:**
```
Dashboard → [Deployments] → [Latest] → [Menu ⋯] → [Redeploy]
```

### Paso 8️⃣: Verificar Cambios (10 minutos después)
```bash
# En tu terminal
curl https://tu-dominio.com/api/health

# Debe responder con "healthy"
```

---

## ⚠️ IMPORTANTE: Parámetros Explicados

| Parámetro | Valor Recomendado | Significado |
|-----------|-------------------|------------|
| `connect_timeout` | 30 | Segundos para establecer conexión (default: 5s) |
| `socket_timeout` | 30 | Segundos para respuestas de DB (default: sin límite) |
| `statement_timeout` | 30000 | Milisegundos por query (default: sin límite) |

**Por qué estos valores?**
- **30 segundos** es más que el default (5s) → permite que Vercel se reconecte si la DB está lenta
- **Pero no infinito** → evita que requests esperen forever si la DB está down

---

## 🔍 Verificación: ¿Cuál es mi Connection String?

### Si tienes Supabase:
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
                                     └─ Este es Supabase Pooler, ve arriba
```

### Si tienes Neon:
```
postgresql://[USER]:[PASSWORD]@[HOST].neon.tech/[DBNAME]
```

### Si tienes PlanetScale (MySQL):
```
mysql://[USER]:[PASSWORD]@[HOST]/[DBNAME]
```
⚠️ MySQL no soporta `connect_timeout` de la misma forma. Ver docs de PlanetScale.

### Si tienes AWS RDS:
```
postgresql://[USER]:[PASSWORD]@[ENDPOINT].rds.amazonaws.com:5432/[DBNAME]
```

---

## ❓ Preguntas Frecuentes

### P: ¿Y si no veo ninguna variable de entorno?
R: Probablemente está en `.env.local` local pero no desplegada en Vercel. Crea la variable manualmente:
```
Variable: DIRECT_DATABASE_URL
Value: postgresql://... (con timeouts)
```

### P: ¿Mi connection string es muy larga, ¿qué hago?
R: Es normal, especialmente con Neon o Supabase. Solo agregá `&connect_timeout=30&socket_timeout=30` al final.

### P: ¿Cambio en DATABASE_URL o DIRECT_DATABASE_URL?
R: 
- Si existe `DIRECT_DATABASE_URL` → modifica esa ✓
- Si solo existe `DATABASE_URL` → modifica esa ✓
- Si tienes ambas → modifica `DIRECT_DATABASE_URL` (tiene prioridad)

### P: ¿Cuánto tiempo tarda el cambio?
R:
- Guardar en Vercel: inmediato
- Redeploy: 1-2 minutos
- Nuevo comportamiento visible: inmediato después del redeploy

### P: ¿Mejorará inmediatamente?
R: Probablemente en los próximos 10-15 minutos los errores disminuyan 80%. Los transients no desaparecerán 100% (eso es imposible), pero serán raros.

---

## 📊 Después de Cambiar: Monitoreo

### Logs de Vercel - Qué Buscar

**✅ BUENO:**
```
[Retry] Attempt 2/3 succeeded
```
(Significa que un transient error fue recuperado automáticamente)

**⚠️ NORMAL pero con Retries:**
```
[Retry] Attempt 1/3 failed: failed to connect to upstream database
[Retry] Attempt 2/3 succeeded
```
(El primer intento falló, pero el segundo funcionó - perfecto)

**❌ MALO (varias veces por hora):**
```
[Retry] Attempt 3/3 failed after 3 attempts: failed to connect to upstream database
```
(Significa que incluso después de 3 intentos falló - problema persistente)

### Cómo Monitorear:

1. **Vercel Deployments → Logs**
   ```
   https://vercel.com/projects/[PROJECT]/deployments
   ```

2. **Busca por "P1001" o "Connection Error"**

3. **Compara con antes:**
   - Antes: 50+ errores por hora
   - Después: <5 errores por hora (o ninguno)

---

## 🎉 ¡Listo!

Una vez hayas hecho estos cambios, tu plataforma:
- ✅ Tendrá menos interrupciones
- ✅ Recuperará automáticamente de transients
- ✅ Mostrará mejores logs para diagnóstico
- ✅ Será más estable bajo carga

**Tiempo estimado de implementación:** 5 minutos  
**Tiempo de efecto:** 10-15 minutos después del redeploy  
**Mejora esperada:** 80%+ reducción de P1001 errors

---

## 📞 Si Algo No Funciona

1. **Verifica que guardaste correctamente:**
   - Haz click en "Save" en Vercel (debe mostrar checkmark verde)

2. **Verifica que redeploy está completo:**
   - Ir a Deployments → el deployment más reciente debe tener status "READY"

3. **Borra caché del navegador:**
   ```
   Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows)
   ```

4. **Si aún no funciona:**
   - Revisa que los timeouts se agregaron al final (después de otros `?param=value`)
   - Revisa que no hay espacios ni caracteres raros
   - Copia-pega del documento, no escribas manualmente

---

**Última actualización:** 2025-12-17  
**Versión:** P1001 Fix v2.1
