#!/bin/bash
# Script para diagnosticar configuración de Prisma P1001 en Vercel

echo "==============================================="
echo "Prisma P1001 Configuration Diagnostic"
echo "==============================================="
echo ""

# Verificar Node version
echo "✓ Node.js version:"
node --version
echo ""

# Verificar variables de entorno configuradas
echo "✓ Environment Variables:"
if [ -z "$DATABASE_URL" ] && [ -z "$DIRECT_DATABASE_URL" ]; then
  echo "  ⚠️  Neither DATABASE_URL nor DIRECT_DATABASE_URL is set!"
else
  if [ ! -z "$DATABASE_URL" ]; then
    echo "  ✓ DATABASE_URL configured (length: ${#DATABASE_URL} chars)"
    # Extraer solo el host y puerto sin exponer credenciales
    if [[ "$DATABASE_URL" =~ "prisma://" ]]; then
      echo "    └─ Type: Prisma Accelerate"
    elif [[ "$DATABASE_URL" =~ "postgresql://" ]]; then
      echo "    └─ Type: Direct PostgreSQL"
    fi
  fi
  if [ ! -z "$DIRECT_DATABASE_URL" ]; then
    echo "  ✓ DIRECT_DATABASE_URL configured (length: ${#DIRECT_DATABASE_URL} chars)"
    if [[ "$DIRECT_DATABASE_URL" =~ "connect_timeout" ]]; then
      echo "    └─ Contains connect_timeout parameter ✓"
    else
      echo "    └─ ⚠️  Missing connect_timeout parameter - add &connect_timeout=30"
    fi
    if [[ "$DIRECT_DATABASE_URL" =~ "socket_timeout" ]]; then
      echo "    └─ Contains socket_timeout parameter ✓"
    else
      echo "    └─ ⚠️  Missing socket_timeout parameter - add &socket_timeout=30"
    fi
  fi
fi
echo ""

# Verificar archivos de configuración
echo "✓ Configuration Files:"
if [ -f "src/utils/db.ts" ]; then
  echo "  ✓ src/utils/db.ts exists"
  # Verificar pool config
  if grep -q "idleTimeoutMillis: 30000" src/utils/db.ts; then
    echo "    └─ Pool idleTimeoutMillis: 30s ✓"
  fi
  if grep -q "connectionTimeoutMillis: 20000" src/utils/db.ts; then
    echo "    └─ Pool connectionTimeoutMillis: 20s ✓"
  fi
fi

if [ -f "src/utils/retryUtils.ts" ]; then
  echo "  ✓ src/utils/retryUtils.ts exists (retry logic)"
  if grep -q "isTransientConnectionError" src/utils/retryUtils.ts; then
    echo "    └─ P1001 detection logic enabled ✓"
  fi
fi
echo ""

# Verificar endpoints con retry
echo "✓ Endpoints with Retry Logic:"
endpoints=(
  "src/app/api/health/route.ts"
  "src/app/api/public/process/active/route.ts"
  "src/app/api/auth/register/route.ts"
  "src/app/api/auth/resend-invitation/route.ts"
  "src/app/api/platform/victor/user-stats/route.ts"
  "src/app/api/platform/victor/remind-pending-invitation/route.ts"
  "src/app/api/platform/campaign/resend-lead/route.ts"
)

for endpoint in "${endpoints[@]}"; do
  if [ -f "$endpoint" ]; then
    if grep -q "withRetry\|withPrismaRetry" "$endpoint"; then
      echo "  ✓ $(basename $endpoint) - has retry logic"
    else
      echo "  ⚠️  $(basename $endpoint) - missing retry logic"
    fi
  fi
done
echo ""

echo "==============================================="
echo "Summary:"
echo "==============================================="
echo ""
echo "To fix intermittent P1001 errors:"
echo "1. In Vercel Dashboard → Environment Variables"
echo ""
echo "2. Update DATABASE_URL or DIRECT_DATABASE_URL with timeouts:"
echo "   DIRECT_DATABASE_URL=\"postgresql://...?connect_timeout=30&socket_timeout=30\""
echo ""
echo "3. Then redeploy from Vercel"
echo ""
echo "4. Monitor health endpoint for next 2 hours:"
echo "   curl https://your-domain.com/api/health"
echo ""
echo "==============================================="
