# @bartal/admin — Admin dashboard *(Phase 6)*

Not yet scaffolded. Placeholder so the monorepo layout is locked in.

**Planned stack** (per PRD §8.5): React 18 + Vite, TypeScript strict, shadcn/ui + Radix primitives, @tanstack/react-table, react-hook-form + zod, recharts, react-router-dom v6, axios + @tanstack/react-query, react-zoom-pan-pinch for receipt image inspection.

**Phase entry criteria:**
1. `apps/api` admin endpoints (`/admin/*` in PRD §10.3) implemented.
2. Design system tokens (PRD §13) materialised in `packages/shared/src/design/tokens.ts`.
3. Admin seed user exists in DB (`admin@bartal.sd` from `prisma:seed`).

When ready: `pnpm create vite@latest apps/admin -- --template react-ts`, then add to `pnpm-workspace.yaml`.
