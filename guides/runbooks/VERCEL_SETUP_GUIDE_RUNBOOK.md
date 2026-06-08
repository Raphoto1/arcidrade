# Runbook Corto - VERCEL_SETUP_GUIDE

Guia extensa: [VERCEL_SETUP_GUIDE.md](../VERCEL_SETUP_GUIDE.md)

## Objetivo
Configurar variables de entorno de Vercel para estabilidad de conexion DB.

## Pasos rapidos
1. Abre proyecto en Vercel.
2. Ve a Settings > Environment Variables.
3. Edita DIRECT_DATABASE_URL (o DATABASE_URL).
4. Agrega parametros de timeout en URL DB directa.
5. Guarda cambios y redeploy.
6. Valida /api/health y logs runtime.

## Escalamiento
Si el error sigue, revisar region DB, saturacion de conexiones y estrategia de pooling.
