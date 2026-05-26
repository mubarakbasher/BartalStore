# CLAUDE.md — Bartal Project Guide

This file gives Claude Code the durable context needed to work on **Bartal** (برتال), a bilingual (Arabic-first / English-secondary) single-vendor e-commerce platform for Sudan, launching in Khartoum.

The authoritative spec is **`docs/Bartal_PRD_Final_v2.0.md`**. When this file and the PRD disagree, the PRD wins — update this file to match.

---

## 1. What Bartal Is

A four-surface product with one shared backend:

| Surface | Stack | Purpose |
|---|---|---|
| Mobile app | Flutter 3.x + Riverpod + go_router | Primary customer interface (Android-first, iOS supported) |
| Website | Next.js 14 App Router + TS + Tailwind + next-intl | Customer storefront + SEO |
| Admin dashboard | React 18 + Vite + shadcn/ui + Tanstack Table | Internal store management |
| Backend API | NestJS 10 (strict) + Prisma 5 + PostgreSQL 15 + Redis 7 | Shared REST API |

Build follows PRD §18.4 phase order: **shared → backend → DB → flutter → web → admin → infra**. Don't scaffold a client before the API it depends on exists.

---

## 2. Sudan Constraints — Read Before Touching Any Feature

These are not preferences; they shape the entire product. If a default Western pattern conflicts with one of these, the Sudan-adapted pattern wins.

| Constraint | Implication |
|---|---|
| **No international payment gateways** (Stripe/PayPal don't work in Sudan) | Bank Transfer (manual receipt upload + admin verification) and Cash on Delivery only. There is no card flow. |
| **No postal codes** | `Address.landmark` is **required**. Address forms are landmark-based: district + street (optional) + landmark + delivery phone. |
| **2G/3G internet, frequent power outages** | Cart + checkout must survive offline drops and resume. Images are WebP, ≤200KB, ≤1200px, with blur placeholders. Target <3s TTI on 3G, Lighthouse mobile >80, LCP <2.5s. |
| **SDG hyperinflation** | Admin can update prices instantly. Optional USD reference is admin-only — never shown to customers. |
| **Arabic primary, English secondary** | Both languages are mandatory for all product names, descriptions, and category names (the schema has `name_ar`/`name_en` pairs). RTL is first-class, not retrofitted. |
| **WhatsApp is the dominant comms channel** | First-class `wa.me` deep links on order pages, support, and share-product. SMS via Africa's Talking is the secondary fallback. |
| **Trust is low for online shopping** | Real product photos (not stock), visible policies, COD option, verified-purchase review badge, clear status timelines. |
| **Android ~80% market share** | Test on low-end Android first. iOS is supported but lower priority. |

---

## 3. Repository Layout (pnpm workspaces)

```
Bartal/
├── apps/
│   ├── api/          NestJS 10 backend + Prisma
│   ├── web/          Next.js 14 customer site
│   ├── admin/        React + Vite admin dashboard
│   └── mobile/       Flutter app (outside the pnpm workspace)
├── packages/
│   └── shared/       @bartal/shared — types, enums, i18n keys, zod schemas, constants
├── infra/            Docker Compose, Nginx, deployment scripts
├── docs/             PRD lives here
└── docker-compose.yml  postgres:15 + redis:7 for local dev
```

The Flutter app sits inside the repo for convenience but is **not** a pnpm workspace member.

---

## 4. Conventions

### TypeScript (api / web / admin / shared)
- **Strict mode on**, no implicit any.
- Domain types live in `@bartal/shared`. API DTOs may extend them; never duplicate enums.
- All API responses use the bilingual envelope: `{ success: true, data }` or `{ success: false, error: { code, message_en, message_ar, status } }`. Wire this once in the API as a global interceptor + filter.
- Zod schemas in `@bartal/shared/schemas` are the source of truth for request validation. Backend uses `class-validator` for Nest DTOs and may mirror the zod shapes.

### Database
- Prisma schema is at `apps/api/prisma/schema.prisma`. Use snake_case for column names (`@@map`, `@map`) — TS-side fields stay camelCase via Prisma's mapping if needed; the PRD uses snake_case for both, follow the PRD.
- Money is `Decimal(12,2)`, never `Float`.
- IDs are `cuid()`.
- Order numbers are `BRT-YYYY-NNNNN` (e.g. `BRT-2026-00001`) — sequential per year, generated in the order service.
- Soft-delete uses `is_active = false`, not row removal.

### i18n
- AR is the default. Both `ar` and `en` strings are required for every translatable field.
- **RTL rules — non-negotiable:**
  - Tailwind: use logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`). Never `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right`.
  - Flutter: use `EdgeInsetsDirectional`, `AlignmentDirectional`. Never `EdgeInsets.only(left:)` / `Alignment.centerLeft`.
- Fonts: **Cairo** for Arabic, **Poppins** for English. Load both via `next/font/google` (web) and the Flutter `pubspec` assets (mobile).

### Auth
- Phone `+249` + 9 digits. OTP via SMS (Africa's Talking).
- JWT: 15-min access + 30-day refresh, with refresh rotation. Refresh-token hashes stored in DB.
- Token storage: mobile → `flutter_secure_storage`; admin → in-memory; web → httpOnly + Secure cookies.
- bcrypt 12 rounds.

### Files & Images
- Storage: Cloudflare R2 (S3-compatible). Use `@aws-sdk/client-s3`.
- All uploads go through `sharp` → WebP, max 1200px, quality 80 (drop to 60 if >200KB).
- Receipt images are **private** R2 bucket, served via signed URLs with 1-hour expiry.
- Product images are public via CDN.

### Notifications
- SMS: Africa's Talking (Sudan coverage confirmed). All sends logged to `sms_logs`.
- Push: Firebase Cloud Messaging. FCM token stored on `User.fcm_token`.
- Both have a status-change template per `OrderStatus`. WhatsApp is human-driven, not API-driven, in Phase 1.

---

## 5. Design System — `docs/design/bartal/` is the ONLY source of truth

**The design system is fixed.** Every visual decision — colors, fonts, spacing, radii, icons, motif, logo, components, layouts — comes from the Claude design bundle at **`docs/design/bartal/`**. Do not invent tokens. Do not introduce new colors, gradients, fonts, shadows, or layout primitives that aren't in the bundle. Do not deviate "for clarity" or "for a quick fix." If you cannot find an answer in the bundle, stop and ask.

### Where things live in the bundle

| Question | Open this file |
|---|---|
| Color palette + dark mode pair | `docs/design/bartal/project/tokens.jsx` (`BARTAL` object) |
| Sudanese geometric motif (SVG) | `docs/design/bartal/project/tokens.jsx` (`MotifTile`, `MotifBg`) |
| Logo (wordmark + mark) | `docs/design/bartal/project/tokens.jsx` (`BartalLogo`, `LogoMark`) + `Bartal Logo.html`, `Bartal Logo v1.html`, `logo-concepts.jsx`, `logo-system.jsx` |
| Type scale + Cairo/Poppins/JetBrains Mono | `tokens.jsx` (`typeStyle`) |
| Striped placeholder swatches | `tokens.jsx` (`ProductPlaceholder`) |
| `PriceTag` (SDG, AR-Indic numerals) | `tokens.jsx` (`PriceTag`, `fmtSDG`) |
| i18n string seed | `tokens.jsx` (`STR`, `t`) — extend in `packages/shared` |
| Component library (buttons, cards, badges, inputs, modals…) | `system-kit.jsx` |
| Web page layouts | `web-pages.jsx`, `web-extras.jsx`, `web-checkout-steps.jsx`, `web-auth.jsx`, `web-admin.jsx` (homepage `WebOverview`), `final-web-and-styletile.jsx` (journal + brand pages + style tile), `order-thanks-and-reviews.jsx`, `invoice-and-templates.jsx` |
| Mobile screens (Marketplace Classic / Editorial Bazaar / Souq Kiosk) | `mobile-v1.jsx`, `mobile-v2.jsx`, `mobile-v3.jsx`, `mobile-extras.jsx`, `secondary-screens.jsx`, `auth-screens.jsx`, `auth-gaps.jsx`, `checkout-flow.jsx`, `receipt-flow.jsx`, `profile-flow.jsx`, `final-additions.jsx` |
| Mobile device frames | `ios-frame.jsx`, `android-frame.jsx` |
| Admin dashboard | `admin-pages.jsx`, `admin-extras.jsx`, `admin-extras2.jsx`, `admin-reviews.jsx` |
| Design entry point (wires all .jsx files) | `Bartal Design.html` |
| Chat history showing what the user accepted | `docs/design/bartal/chats/chat1.md` … `chat5.md` (read `chat5.md` first — it's the final state audit) |

### Implementation rules

1. **Tokens come from one place.** `apps/web/src/design/tokens.ts` is the canonical TS export, mirroring `BARTAL` in `tokens.jsx`. Tailwind preset (`apps/web/tailwind.config.ts`) consumes it. When porting to mobile (Flutter) or admin (React+Vite), each surface re-translates *the same* tokens — never a new palette.
2. **Components mirror `system-kit.jsx`.** Names, variants, sizes, states must match. If `system-kit.jsx` shows three button sizes, your `AppButton` exposes three sizes — no more, no less.
3. **The motif is a backdrop.** Use `MotifBg` style backgrounds on hero / receipt-upload / order-confirmation / order-thanks / brand pages. Never as a full-bleed pattern on listing pages.
4. **Logo:** the 8-point star with amber center is the only mark. Use `BartalLogo` (wordmark) in headers, `LogoMark` (icon only) in compact slots. Never recolor outside the navy/amber pair from `BARTAL`.
5. **Numerals:** Arabic locale renders AR-Indic numerals (`٠-٩`) via `fmtSDG` from `@bartal/shared`. English uses Western. Never mix.
6. **Three mobile variations exist in the design, only ONE ships.** Default to `mobile-v1.jsx` (Marketplace Classic — dense grid + bottom tabs) for production unless the user explicitly picks another. Document the chosen variation in `tasks.md` Phase 4.
7. **RTL rules from CLAUDE.md §4 still apply** — `ms-*`/`me-*` not `ml-*`/`mr-*`. The design files use inline-styles with `direction: rtl` for the AR canvas; you translate that to Tailwind logical utilities.
8. **When the design and PRD disagree on numbers (color hex, font weight, page count), the design wins.** When they disagree on rules (e.g. landmark required, bank-transfer-only payment), the PRD wins. If unsure, ask.

### Page budget (read this before scoping a session)

Counting from `chat5.md` final audit + the additions in chat4 and chat5:

| Surface | Pages | Status |
|---|---:|---|
| **Web** (`apps/web`) | **~34** | 14 done (home, products list, PDP, category redirect, cart, checkout preview, login, register, forgot-password, account/orders/wishlist gated, search, 404) · ~20 remaining |
| **Mobile** (`apps/mobile`, single variation) | **~45** | 0 done · Phase 4 |
| **Admin** (`apps/admin`) | **~24** | 0 done · Phase 6 |
| **Design system reference page** | **1** | 0 done — port `final-web-and-styletile.jsx` style tile when web is otherwise complete |
| **TOTAL** | **~104** | 14 done · ~90 remaining |

(The mobile design explores 3 variations × iOS+Android, but only one variation ships in production — that's ~45 unique screens, not 45 × 6.)

### "Don't deviate" checklist (apply before every component/page)

- [ ] Did I import from `apps/web/src/design/tokens.ts`, not hardcode hex?
- [ ] Are the fonts Cairo (AR) / Poppins (EN) / JetBrains Mono (numerals/SKUs) — and nothing else?
- [ ] Are spacing values on the 4px grid?
- [ ] Are corner radii one of `rounded-bartal` (12) or `rounded-bartal-lg` (16) or `rounded-full` (pill)?
- [ ] If I'm building a component, is its visual identical to the matching block in `system-kit.jsx` or the relevant page file?
- [ ] If I'm building a page, did I open every JSX file listed for that page above and compare layout, spacing, copy, and component variants?
- [ ] Did I check `chat5.md` to confirm the user's final-state choices?
- [ ] Did I avoid adding any "nice-to-have" element that isn't in the design? (No "while I'm here, I added a hero badge.")

---

## 6. Development Workflow

### Local setup
```bash
pnpm install
pnpm db:up                 # postgres + redis via docker compose
pnpm --filter @bartal/api prisma:migrate
pnpm --filter @bartal/api prisma:seed
pnpm dev:api               # starts NestJS on :3001
```

API docs: `http://localhost:3001/api/docs` (Swagger).

### Environment variables
Copy `.env.example` → `.env` at the repo root and inside each app. Required for the API to boot: `DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`. External services (Africa's Talking, FCM, R2) fail gracefully when keys are absent in dev.

### Testing
- Backend: Jest unit + supertest e2e. Run with `pnpm --filter @bartal/api test`.
- Web/admin: Vitest + Playwright (added in their phases).
- Mobile: Flutter widget + integration tests (added in Phase 4).

### Commits
- Conventional Commits style: `feat(api): …`, `fix(web): …`, `chore: …`, `docs: …`.
- One concern per commit. Don't bundle a refactor into a feature commit.

---

## 7. Things Not to Do

- Don't integrate Stripe, PayPal, or any non-Sudan payment gateway.
- Don't use postal codes anywhere in the address flow.
- Don't put English-only or Arabic-only text in product/category names — both are required.
- Don't store raw passwords or unhashed refresh tokens.
- Don't serve receipt images publicly.
- Don't use directional Tailwind utilities (`ml-`, `mr-`, etc.) or directional Flutter `EdgeInsets`.
- Don't ship images that aren't WebP-converted and size-capped.
- Don't claim a task is complete before the relevant tests pass and the API endpoint actually returns the documented response shape.

---

## 8. Where to Look

| Need | File |
|---|---|
| Full requirements | `docs/Bartal_PRD_Final_v2.0.md` |
| Database schema | `apps/api/prisma/schema.prisma` (mirrors PRD §9) |
| API surface | `apps/api/src/modules/**` + Swagger at `/api/docs` |
| Shared enums / i18n / zod | `packages/shared/src/**` |
| Design tokens | this file §5 + (TBD) `packages/shared/src/design/tokens.ts` |
| Sudan constants (zones, districts, phone regex) | `packages/shared/src/constants/**` |
| **Project progress / what's done / what's next** | `tasks.md` (see §9 below) |

---

## 9. Task Tracking

`tasks.md` at the repo root is the **living source of truth for project progress**. Keep it updated.

**When to update `tasks.md`:**
- Starting a task → mark it `[ ] → [~]` (in progress) and add an Activity Log entry.
- Completing a task → mark it `[~] → [x]` with the completion date.
- Discovering a new sub-task → add it under the right phase as `[ ]`.
- Blocking on something → mark `[!]` and note the blocker.
- Changing scope (deferring, dropping, re-prioritizing) → reflect it and log why with `[-]`.

**Every change to `tasks.md` MUST:**
1. Bump the `_Last updated: <ISO 8601 UTC>_` line at the top to the current time (format `YYYY-MM-DDTHH:mm:ssZ`).
2. Append a one-line entry to the `## Activity Log` section at the bottom, dated, describing what changed.
3. Use the harness clock for timestamps — **never invent a date**:
   - PowerShell: `Get-Date -ToUniversalTime -Format "yyyy-MM-ddTHH:mm:ssZ"` (or run `Get-Date` and convert).
   - Bash: `date -u +"%Y-%m-%dT%H:%M:%SZ"`.

**Reading `tasks.md`:** When the user asks where things stand, read `tasks.md` first, then verify against the actual repo state — a `[x]` is a *claim*; confirm the file / route / test actually exists before reporting it as done.

`tasks.md` and the harness `TaskCreate`/`TaskList` tools are separate. `tasks.md` is durable across sessions and visible to humans; harness tasks are session-scoped scratch space. Both should agree, but `tasks.md` wins on disputes.
