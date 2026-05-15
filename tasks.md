# Bartal — Tasks

_Last updated: 2026-05-15T17:24:42Z_

> Living task tracker. Updated every time work starts, completes, blocks, or scope changes.
> Source of truth for "what's done / what's next". See `CLAUDE.md` §"Task Tracking" for the rules.
>
> **Legend:** `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked · `[-]` dropped/deferred

---

## Phase 1 — Shared package (`packages/shared`)

- [x] Scaffold `@bartal/shared` (package.json, tsconfig, src layout) — 2026-05-15
- [x] Enums mirroring PRD §9 — 2026-05-15
- [x] Sudan constants: delivery zones, phone +249 regex, SDG formatter, order-number helper — 2026-05-15
- [x] i18n string bundles (AR + EN) per PRD §14.3 categories — 2026-05-15
- [x] Zod schemas: register, login, verifyOtp, address (landmark required), createOrder — 2026-05-15
- [x] Build produces `dist/` — 2026-05-15

## Phase 2 — Backend API (`apps/api`)

- [x] NestJS skeleton (main, app module, config, validation, Swagger, global pipe/filter/interceptor) — 2026-05-15
- [x] Prisma + Redis modules wired — 2026-05-15
- [x] Common guards/decorators/utils — 2026-05-15
- [x] Modules scaffolded with route signatures + DTOs + Swagger (services throw `NotImplementedException`) — 2026-05-15
- [ ] Implement `auth` module fully (register / OTP / login / refresh / forgot / reset)
- [ ] Implement `users` + addresses
- [ ] Implement `products` + `categories` + reviews
- [ ] Implement `cart` (Redis-backed)
- [ ] Implement `orders` + receipt upload flow
- [ ] Implement `delivery` zones + fee calc
- [ ] Implement `notifications` (Africa's Talking SMS, Firebase FCM)
- [ ] Implement `storage` (Cloudflare R2 presigned uploads)
- [ ] Implement `admin` (dashboard, products, orders, customers, settings, analytics)
- [ ] e2e tests for each module

## Phase 3 — Database (`apps/api/prisma`)

- [x] Schema mirroring PRD §9 (16 models + 7 enums) — 2026-05-15
- [x] Seed: admin user + 4 delivery zones + categories + sample products — 2026-05-15
- [ ] Run `prisma migrate dev --name init` against local Postgres
- [ ] Run seed against local DB

## Phase 4 — Mobile app (`apps/mobile`)

- [ ] Flutter scaffold (Riverpod, go_router, secure storage, dio, l10n)
- [ ] 35 screens per PRD §6 + §7.1
- [ ] AR / EN with Cairo + Poppins
- [ ] FCM integration
- [ ] App Store + Play Store submission

## Phase 5 — Website (`apps/web`)

- [ ] Next.js 14 scaffold (App Router, next-intl, Tailwind logical properties)
- [ ] 23 pages per PRD §6 + §7.1
- [ ] SEO metadata, sitemap, OG images
- [ ] Lighthouse mobile score > 80

## Phase 6 — Admin dashboard (`apps/admin`)

- [ ] React + Vite scaffold (shadcn/ui, Tanstack Table, react-hook-form + zod)
- [ ] 15 pages per PRD §7.2
- [ ] Receipt viewer with zoom-pan
- [ ] Bulk product import (CSV)

## Phase 7 — Infrastructure (`infra/`)

- [ ] Production Docker images for api / web / admin
- [ ] Nginx reverse proxy with SSL termination
- [ ] Hetzner / DO provisioning scripts
- [ ] Cloudflare DNS + R2 bucket setup docs
- [ ] GitHub Actions CI (lint, test, build)
- [ ] Sentry integration

---

## Activity Log

- **2026-05-15T10:14:00Z** — Repo bootstrapped: monorepo scaffold begun.
- **2026-05-15T17:24:42Z** — Phase 1–3 scaffold complete: `@bartal/shared` builds clean, NestJS API compiles to `dist/main.js`, Prisma client generated against the full PRD §9 schema, seed script ready, all PRD §10.3 routes exposed (stubbed with `NotImplementedException`). `pnpm install` succeeded with 692 packages.
