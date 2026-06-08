# Incident Decision Tree (Runbook)

Use this tree for fast triage before deep debugging.

## 1) Is this a DB migration or schema incident?
- Symptom: P3009, P3015, column/table missing, migrate errors.
- Action:
  1. Run `npx prisma migrate status`.
  2. If shared/deploy DB: run only `npx prisma migrate deploy`.
  3. Follow [SOLUCION_DEPLOY_DB_RUNBOOK.md](SOLUCION_DEPLOY_DB_RUNBOOK.md).

## 2) Is this a DB connection incident?
- Symptom: P1001, ETIMEDOUT, ECONNREFUSED, random auth failures.
- Action:
  1. Run `npm run test:database`.
  2. Hit `/api/health`.
  3. Verify env vars and timeout params in DB URL.
  4. Follow [P1001_QUICK_START_RUNBOOK.md](P1001_QUICK_START_RUNBOOK.md).

## 3) Is this an email delivery incident?
- Symptom: 5.7.1 reject, mails in spam, low inbox rate.
- Action:
  1. Run `node scripts/test-email-config.js`.
  2. Check SPF/DKIM/DMARC.
  3. Follow [QUICK-FIX-EMAILS_RUNBOOK.md](QUICK-FIX-EMAILS_RUNBOOK.md).

## 4) Is this a Vercel deploy/runtime incident?
- Symptom: works local, fails in deploy.
- Action:
  1. Check Vercel Runtime Logs.
  2. Validate env vars in target env.
  3. Follow [VERCEL_SETUP_GUIDE_RUNBOOK.md](VERCEL_SETUP_GUIDE_RUNBOOK.md).

## 5) Is this UI content rendering incident (Quill)?
- Symptom: broken bullet lists, malformed rich text.
- Action:
  1. Validate processed HTML path.
  2. Follow [QUILL_DESCRIPTIONS_GUIDE_RUNBOOK.md](QUILL_DESCRIPTIONS_GUIDE_RUNBOOK.md).

## Safety rules (always)
- Never run `prisma migrate dev` on shared/deploy DB.
- Never run reset on deploy without explicit approval.
- Prefer non-destructive diagnostics first.
