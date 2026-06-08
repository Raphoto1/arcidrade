# AGENTS - Quick Operating Rules

## Scope
Short checklist for any AI/agent working in this repository.

## 10-step startup checklist
1. Read [CONTEXTO_IA.md](CONTEXTO_IA.md) first.
2. Use [guides/runbooks/README.md](guides/runbooks/README.md) for operational flow.
3. Confirm target environment before DB actions (dev vs deploy).
4. For shared/deploy DB, run only `npx prisma migrate status` and `npx prisma migrate deploy`.
5. Never run `prisma migrate dev` against deploy/shared DB.
6. Never run schema reset on deploy without explicit user approval.
7. Prefer non-destructive diagnostics first (`npm run test:database`, `/api/health`).
8. Keep docs in sync when commands, env vars, or workflows change.
9. Update short runbook first, then extended guide.
10. Summarize changes with file paths and risks before finishing.

## Security and secrets
- Do not print or store secret values in docs, logs, or chat.
- If a command needs a secret, user must type it directly in terminal.

## Canonical references
- Quick start: [START_HERE_IA.md](START_HERE_IA.md)
- Main context: [CONTEXTO_IA.md](CONTEXTO_IA.md)
- Docs index: [README.md](README.md)
- Runbooks index: [guides/runbooks/README.md](guides/runbooks/README.md)
- DB deploy guide: [guides/SOLUCION_DEPLOY_DB.md](guides/SOLUCION_DEPLOY_DB.md)
- Troubleshooting index: [guides/TROUBLESHOOTING_INDEX.md](guides/TROUBLESHOOTING_INDEX.md)
- Env matrix: [guides/ENV_MATRIX.md](guides/ENV_MATRIX.md)
