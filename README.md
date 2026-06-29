# Invoix AI

AI-powered invoicing and payment chasing for freelancers and small agencies.

## What it does

- **Create invoices** in seconds — paste rough notes and let the AI draft professional line items
- **Chase late payments** — one click generates a polite-but-firm payment reminder email
- **Track cash flow** — see outstanding amounts, overdue invoices, and client history at a glance
- **Subscription billing** — Free tier (3 clients, 5 invoices/month) and Pro tier via Stripe

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS**
- **Prisma** (SQLite in dev, swap `DATABASE_URL` to Postgres for production)
- **NextAuth.js** (credentials-based auth)
- **Stripe** (subscription billing)
- **Anthropic Claude** (AI invoice drafting and payment reminders)

## Getting started

```bash
cp .env.example .env
# fill in NEXTAUTH_SECRET (any random string) — other keys are optional for local dev

npm install --ignore-scripts   # prisma's binary download may need manual steps on restricted networks
npx prisma generate            # or: PRISMA_QUERY_ENGINE_LIBRARY=… PRISMA_SCHEMA_ENGINE_BINARY=… npx prisma generate
npx prisma migrate dev --name init --skip-generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See `.env.example`. Key vars:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | SQLite: `file:./dev.db`, Postgres: `postgresql://…` |
| `NEXTAUTH_SECRET` | Yes | Random string, used to sign JWT sessions |
| `NEXTAUTH_URL` | Yes (prod) | Your deployment URL |
| `ANTHROPIC_API_KEY` | No | AI drafting. Falls back to a template mock if unset |
| `STRIPE_SECRET_KEY` | No | Billing. Checkout returns 503 if unset |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook verification |
| `STRIPE_PRICE_ID_PRO` | No | Stripe price ID for the Pro monthly plan |

## Deploying

1. Create a Postgres database (e.g. Neon, Supabase, Railway)
2. Set all env vars on your hosting provider
3. Run `prisma migrate deploy` as part of your deploy script
4. `npm run build && npm start`
