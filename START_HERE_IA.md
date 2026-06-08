# START HERE - IA Quick Start

Read this first if you are an AI/agent entering this repository.

## 60-second startup
1. Read [AGENTS.md](AGENTS.md).
2. Read [CONTEXTO_IA.md](CONTEXTO_IA.md).
3. Open [guides/runbooks/README.md](guides/runbooks/README.md).
4. Confirm target environment before any DB command.

## Safe command set for deploy/shared DB
- `npx prisma migrate status`
- `npx prisma migrate deploy`
- `npm run test:database`
- `GET /api/health`

## Forbidden by default on deploy/shared DB
- `npx prisma migrate dev`
- `npx prisma migrate reset`
- Any destructive reset/drop without explicit user approval.

## Secret handling
- Never print secret values.
- If secret input is required, user types directly in terminal.

## Fast links
- Incident tree: [guides/runbooks/INCIDENT_DECISION_TREE.md](guides/runbooks/INCIDENT_DECISION_TREE.md)
- Troubleshooting index: [guides/TROUBLESHOOTING_INDEX.md](guides/TROUBLESHOOTING_INDEX.md)
- Deploy checklist: [guides/runbooks/DEPLOY_CHECKLIST.md](guides/runbooks/DEPLOY_CHECKLIST.md)
