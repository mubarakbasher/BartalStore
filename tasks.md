# Bartal — Tasks

_Last updated: 2026-05-15T20:38:59Z_

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
- [x] Implement `products` (list / detail / search) + jest unit tests — 2026-05-15
- [x] Implement `categories` (tree / detail / productsIn) + jest unit tests — 2026-05-15
- [x] Implement `delivery` zones + fee calc + jest unit tests — 2026-05-15
- [ ] Implement product reviews (auth-gated, needs orders for verified-purchase)
- [ ] Implement `cart` (Redis-backed)
- [ ] Implement `orders` + receipt upload flow
- [ ] Implement `notifications` (Africa's Talking SMS, Firebase FCM)
- [ ] Implement `storage` (Cloudflare R2 presigned uploads)
- [ ] Implement `admin` (dashboard, products, orders, customers, settings, analytics)
- [ ] e2e tests for each module

## Phase 3 — Database (`apps/api/prisma`)

- [x] Schema mirroring PRD §9 (16 models + 7 enums) — 2026-05-15
- [x] Seed: admin user + 4 delivery zones + categories + sample products — 2026-05-15
- [x] Run `prisma migrate dev --name init` against local Postgres (port 5433) — 2026-05-15
- [x] Run seed against local DB — 2026-05-15

## Phase 4 — Mobile app (`apps/mobile`)

- [ ] Flutter scaffold (Riverpod, go_router, secure storage, dio, l10n)
- [ ] 35 screens per PRD §6 + §7.1
- [ ] AR / EN with Cairo + Poppins
- [ ] FCM integration
- [ ] App Store + Play Store submission

## Phase 5 — Website (`apps/web`)

- [x] Next.js 14 scaffold (App Router, src dir, Tailwind, custom locale routing) — 2026-05-15
- [x] Design tokens materialised from PRD §13 + Claude design `tokens.jsx` (CSS vars + Tailwind preset) — 2026-05-15
- [x] Cairo + Poppins + JetBrains Mono via `next/font/google` — 2026-05-15
- [x] Locale routing `[locale]` with middleware-driven SSR `lang`/`dir` — 2026-05-15
- [x] AR + EN dictionaries (web copy) consuming `@bartal/shared` strings — 2026-05-15
- [x] Core components: `BartalLogo`, `PriceTag`, `ProductPlaceholder`, `AppButton`, `AppCard`, `StatusBadge`, `LoadingSkeleton`, `EmptyState`, `ErrorState`, `OfflineBanner`, `LanguageToggle`, `Header`, `Footer`, `Icons` — 2026-05-15
- [x] Live data: `useProducts` / `useCategories` / `useDeliveryZones` (axios + React Query) — 2026-05-15
- [x] Zustand cart store with localStorage persistence (offline-resilient per PRD §7.1.3) — 2026-05-15
- [x] Pages: home, products list (filter+sort+paginate), product detail (add-to-cart, WhatsApp), category redirect, cart (zone-aware delivery + free-above), checkout (preview), login/register/forgot-password (UI only), account/orders/wishlist (login-required state), search, 404 — 2026-05-15
- [x] Build passes (`pnpm --filter @bartal/web build` → 18 routes) and prod server serves real seed data on both locales — 2026-05-15
- [ ] Translate every remaining page from `docs/design/bartal/project/web-pages.jsx` + `web-extras.jsx` + `final-web-and-styletile.jsx` pixel-perfect (account hub, checkout steps 1-3 + thank-you, write-review, invoice print, brand pages, journal, About/Privacy/ToS/FAQ/Contact, 500/offline pages)
- [ ] SEO metadata per page, sitemap, OG images
- [ ] Lighthouse mobile score > 80
- [ ] Switch to real auth + cart sync when API modules land

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
- **2026-05-15T17:32:00Z** — Phase 3 closed: Postgres + Redis up on ports 5433/6380 (defaults taken by another local project), `prisma migrate dev --name init` applied, seed inserted 1 admin + 4 delivery zones + 7 app settings + 6 categories + 20 sample Sudan-market products.
- **2026-05-15T17:55:00Z** — Phase 2 partial: implemented `products`, `categories`, `delivery` services against Prisma with full unit tests (18 tests, 4 suites). Tightened `SuccessResponseInterceptor` to hoist `{data, meta}` into the PRD §10.2 paginated envelope shape.
- **2026-05-15T20:38:59Z** — Phase 5 website live: pulled the Claude design bundle into `docs/design/bartal/`, translated `tokens.jsx` into Tailwind preset + CSS variables, scaffolded Next.js 14 with `[locale]` routing + middleware-driven SSR `lang`/`dir`, built header/footer/product card/price tag/logo/motif components, wired axios + React Query to fetch real seed data, implemented home/products/product-detail/cart/checkout/login/register/account/orders/wishlist/search/404. `pnpm build` produces 18 routes; `GET /ar` returns RTL Arabic homepage with seeded products, `GET /en` returns LTR English equivalents, `GET /ar/products/karkadeh` returns full PDP with description and add-to-cart.
