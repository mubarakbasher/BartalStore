# @bartal/admin — Admin dashboard

Vite + React 18 + TypeScript strict + Tailwind + Tanstack Table + Recharts + react-router-dom.

## Running

```bash
pnpm install
pnpm db:up                                          # postgres + redis
pnpm --filter @bartal/api start:dev                 # API on :3001
pnpm --filter @bartal/admin dev                     # admin on :5173
```

Open <http://localhost:5173/login>. The seeded admin credentials are
`+249912000001` / `ChangeMe123!`.

## Stack notes

- **Token storage**: in-memory only (Zustand without persist). On hard reload
  the operator re-logs in. Per CLAUDE.md §4.
- **API client**: axios with a 401-refresh interceptor that uses the in-memory
  refresh token to recover from short-term token expiry.
- **State**: TanStack Query for server state, Zustand for client-only state
  (auth, prefs, topbar title).
- **Routing**: `react-router-dom@6` with a `<RequireAuth>` guard around the
  shell layout.
- **Charts**: Recharts is dynamically imported on the dashboard so it never
  enters the login bundle.
- **Tokens**: mirrored from `apps/web/src/design/tokens.ts` (per CLAUDE.md
  each surface re-translates the same tokens). Tailwind config is a near-copy
  of the web's plus `darkMode: 'class'`.

## Scripts

| Script | Purpose |
|---|---|
| `dev` | Vite dev server on :5173, proxies `/api` → :3001 |
| `build` | `tsc -b && vite build` → `dist/` |
| `preview` | Serve the production build locally |
| `typecheck` | `tsc --noEmit` strict |
| `lint` | ESLint |

## Slice 1 routes (current)

- `/login` — split-panel auth
- `/` — dashboard (KPI cards, 14-day revenue chart, status bar chart, top sellers, recent orders)
- `/orders` — paginated list with status tabs + zone/search filters
- `/orders/:id` — detail, status timeline, receipt viewer dialog, payment + status mutations
- `/customers`, `/customers/:id`
- `/zones` — inline-editable per-zone fee + ETA
- `/settings` — general (writeable) + banking (read-only) tabs

Slice 2/3 will add products + categories + marketing + staff + analytics deep pages.
