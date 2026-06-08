# Contexto para IAs Futuras - ARCIDRADE

## Objetivo
Este documento resume el contexto operativo minimo para que cualquier IA pueda trabajar en este repositorio con bajo riesgo y alta velocidad.

Checklist rapido para agentes: [AGENTS.md](AGENTS.md)
Entrada de 60 segundos: [START_HERE_IA.md](START_HERE_IA.md)

## Stack y arquitectura
- Next.js App Router (src/app)
- TypeScript + React
- Prisma ORM + PostgreSQL
- NextAuth (credenciales)
- Tailwind + DaisyUI
- Testing con Vitest

## Estructura clave
- src/app/api: endpoints
- src/components: UI
- src/controller: logica de negocio
- src/service: servicios
- src/utils: utilidades (db, auth, retry)
- prisma/schema.prisma: modelo de datos
- prisma/migrations: historial de migraciones
- guides: documentacion extensa
- guides/runbooks: runbooks cortos operativos

## Reglas criticas de base de datos
1. En bases compartidas o de deploy usar solo:
   - npx prisma migrate status
   - npx prisma migrate deploy
2. No usar prisma migrate dev contra deploy/shared DB.
3. Si hay drift o errores P3009/P3015, seguir runbook de deploy DB antes de cualquier cambio destructivo.
4. Nunca hacer reset de schema en deploy sin aprobacion explicita.

## Variables de entorno esperadas (nombres)
- DATABASE_URL
- DIRECT_DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- NEXT_PUBLIC_SITE_URL
- PLAT_URL
- SMTP_SERVER_HOST
- SMTP_SERVER_USERNAME
- SMTP_SERVER_PASSWORD
- MAIL_PORT
- NO_REPLY_MAIL
- NO_REPLY_MAIL_PASSWORD
- SITE_MAIL_RECIEVER
- BLOB_READ_WRITE_TOKEN
- NEXT_PUBLIC_GA_MEASUREMENT_ID

## Comandos operativos frecuentes
- npm run dev
- npm run build
- npm run test
- npm run test:coverage
- npm run test:database
- npx prisma migrate status
- npx prisma migrate deploy
- npx prisma generate

## Diagnostico rapido recomendado
1. Validar migraciones: npx prisma migrate status
2. Validar conexion/query: npm run test:database
3. Validar health endpoint: GET /api/health
4. Si es deploy: revisar Runtime Logs y variables en Vercel

## Documentacion de referencia
- README principal: README.md
- Indice runbooks cortos: guides/runbooks/README.md
- Deploy DB (extensa): guides/SOLUCION_DEPLOY_DB.md
- P1001 quick start: guides/P1001_QUICK_START.md
- Email quick fix: guides/QUICK-FIX-EMAILS.md

## Convencion de documentacion
- Cada guia extensa en guides debe tener su version corta en guides/runbooks con sufijo _RUNBOOK.md.
- Si se cambia flujo operativo, actualizar primero runbook y luego guia extensa.

## Ultima validacion conocida (2026-06-08)
- Desarrollo: migrate status al dia.
- Deploy: migrate status al dia, migrate deploy sin pendientes.
- Diagnostico DB en deploy: 5/5 pruebas aprobadas (npm run test:database).
