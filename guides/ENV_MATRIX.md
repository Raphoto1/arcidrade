# Environment Variable Matrix

## Usage by environment

| Variable | Dev | Preview | Deploy | Required | Notes |
|---|---|---|---|---|---|
| DATABASE_URL | optional | optional | yes | yes (deploy) | Production runtime URL (Accelerate/direct as configured) |
| DIRECT_DATABASE_URL | yes | optional | optional | yes (dev) | Direct URL for local migrate/dev workflows |
| NEXTAUTH_SECRET | yes | yes | yes | yes | Auth signing secret |
| NEXTAUTH_URL | yes | yes | yes | yes | Public app URL by environment |
| NEXT_PUBLIC_SITE_URL | optional | yes | yes | recommended | Public frontend URL |
| PLAT_URL | optional | yes | yes | recommended | Platform base URL |
| SMTP_SERVER_HOST | optional | optional | yes (if email) | conditional | SMTP provider host |
| SMTP_SERVER_USERNAME | optional | optional | yes (if email) | conditional | SMTP username |
| SMTP_SERVER_PASSWORD | optional | optional | yes (if email) | conditional | SMTP password |
| MAIL_PORT | optional | optional | yes (if email) | conditional | SMTP port |
| NO_REPLY_MAIL | optional | optional | yes (if email) | conditional | Sender address |
| NO_REPLY_MAIL_PASSWORD | optional | optional | yes (if email) | conditional | Sender mailbox password |
| SITE_MAIL_RECIEVER | optional | optional | optional | optional | Internal contact receiver |
| BLOB_READ_WRITE_TOKEN | optional | optional | yes (if uploads) | conditional | Vercel Blob token |
| NEXT_PUBLIC_GA_MEASUREMENT_ID | optional | optional | optional | optional | GA4 id |

## Rules
1. Do not print secret values in chat or logs.
2. Validate env per target before deploy.
3. Use deploy-safe DB commands on shared DB (`migrate status`, `migrate deploy`).
