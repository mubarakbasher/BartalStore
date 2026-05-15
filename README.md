# Bartal (برتال)

Bilingual (Arabic / English) single-vendor e-commerce platform for Sudan, launching in Khartoum.

> **برتال** means *portal* — a gateway to trusted online shopping in Sudan.

## Surfaces

| Surface | Stack | Location |
|---|---|---|
| Backend API | NestJS 10 + Prisma 5 + PostgreSQL 15 + Redis 7 | `apps/api` |
| Customer website | Next.js 14 + TypeScript + Tailwind + next-intl | `apps/web` *(Phase 5)* |
| Admin dashboard | React 18 + Vite + shadcn/ui | `apps/admin` *(Phase 6)* |
| Mobile app | Flutter 3.x + Riverpod | `apps/mobile` *(Phase 4)* |
| Shared package | TypeScript — types, enums, zod, i18n, Sudan constants | `packages/shared` |

## Quick start (local development)

```bash
# 1. Install deps
pnpm install

# 2. Bring up Postgres + Redis
pnpm db:up

# 3. Apply schema + seed data
pnpm db:migrate
pnpm db:seed

# 4. Start the API (http://localhost:3001)
pnpm dev:api
```

API docs (Swagger UI): http://localhost:3001/api/docs

## Project documents

- **Requirements:** [`docs/Bartal_PRD_Final_v2.0.md`](docs/Bartal_PRD_Final_v2.0.md) — full PRD, source of truth.
- **Claude Code guide:** [`CLAUDE.md`](CLAUDE.md) — Sudan constraints, conventions, design tokens, "do not" list.
- **Task tracker:** [`tasks.md`](tasks.md) — living progress board, updated on every change.

## Sudan-specific constraints (what makes Bartal different)

- **No international payment gateways** — Bank Transfer (manual receipt upload + admin verification) and Cash on Delivery only.
- **No postal codes** — addresses are landmark-based; `Address.landmark` is required.
- **Arabic-first RTL** — both AR and EN are required for every product/category name.
- **Slow & flaky networks** — offline-first cart, resume-anywhere checkout, WebP images ≤200KB.
- **WhatsApp-native support** — first-class `wa.me` deep links on orders.

See `CLAUDE.md` and PRD §3 for the full list and the *why*.
