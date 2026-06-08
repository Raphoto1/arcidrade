# Deploy Checklist (Pre and Post)

## Pre-deploy checklist
- [ ] Correct target branch and environment confirmed.
- [ ] `npm run build` passes locally.
- [ ] DB migration status checked: `npx prisma migrate status`.
- [ ] For deploy/shared DB: no `migrate dev` usage.
- [ ] Required env vars present in Vercel target env.
- [ ] No secrets included in commit or docs.

## Deploy execution
- [ ] Push/trigger deploy.
- [ ] Run `npx prisma migrate deploy` against deploy DB.
- [ ] Confirm no pending migrations.

## Post-deploy checklist
- [ ] Health endpoint responds OK (`/api/health`).
- [ ] Critical flow smoke test (login + one key API path).
- [ ] Runtime logs reviewed (no new critical errors).
- [ ] Email test path validated if release includes email changes.

## Incident fallback
- If migration issues: use [SOLUCION_DEPLOY_DB_RUNBOOK.md](SOLUCION_DEPLOY_DB_RUNBOOK.md).
- If connection issues: use [P1001_QUICK_START_RUNBOOK.md](P1001_QUICK_START_RUNBOOK.md).
- If env/runtime issues: use [VERCEL_SETUP_GUIDE_RUNBOOK.md](VERCEL_SETUP_GUIDE_RUNBOOK.md).
