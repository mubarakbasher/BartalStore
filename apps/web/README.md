# @bartal/web — Customer website *(Phase 5)*

Not yet scaffolded. This folder is a placeholder so the monorepo layout is locked in.

**Planned stack** (per PRD §8.4): Next.js 14 (App Router), TypeScript strict, Tailwind (with logical-property utilities for RTL), next-intl, next/font/google for Cairo + Poppins, @tanstack/react-query, zustand for cart state.

**Phase entry criteria:**
1. `apps/api` is implemented and serving the endpoints the website needs (auth, products, categories, cart, orders).
2. The Claude.ai design artifact URL has been shared by the project owner — used as the visual reference for the 23 pages listed in PRD §6 + §7.1.
3. Logo + brand assets available.

When ready: `pnpm create next-app@latest apps/web --typescript --tailwind --app --import-alias '@/*' --src-dir`, then add this folder to `pnpm-workspace.yaml`.
