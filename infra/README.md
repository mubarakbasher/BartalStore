# infra — Production infrastructure *(Phase 7)*

Partially scaffolded. The first artifacts here are a **per-port, side-by-side TEST deployment** that runs
the full stack on a VPS alongside another Docker app without disturbing it. See
[`deploy/README.md`](deploy/README.md) for the runbook, verification, and troubleshooting.

## What exists now (test deploy)

| File | Purpose |
|---|---|
| `docker-compose.prod.yml` | Project `bartal-test`; api + web + admin + postgres + redis + one-shot migrate. Each app publishes its own host port (`8080`/`8081`/`8082` by default); DB/Redis internal-only; dedicated `bartal-test-net`; `mem_limit` caps. |
| `docker/web.Dockerfile` | Next.js standalone build (node:20-alpine), bakes `NEXT_PUBLIC_*`. |
| `docker/admin.Dockerfile` | Vite SPA build → served at root by `nginx:alpine`; bakes `VITE_API_BASE_URL`. |
| `nginx/admin.conf` | Static + SPA history fallback for the admin container. |
| `.env.production.example` | Copy to `.env.production`, fill `VPS_IP` + secrets. |
| `.dockerignore` | Build-context trim; copied to repo root at deploy time. |
| `deploy/README.md` | Runbook + verification + troubleshooting + teardown. |

The API image lives at [`../apps/api/Dockerfile`](../apps/api/Dockerfile) (node:20-slim — native deps
`bcrypt`/`sharp` + Prisma need glibc prebuilts). The migrate/seed one-shot reuses its `builder` stage.

## Still planned (full production — PRD §8.1 + §19.2)

- TLS via Let's Encrypt + a domain (`bartal.sd`, `api.`, `admin.` subdomains) — removes the HTTP cookie caveat.
- Real Cloudflare R2 / Africa's Talking / FCM credentials + secret rotation.
- Provisioning scripts (Hetzner / DigitalOcean), DB backup cron, Postgres tuning.
- CI image build + registry push + SSH deploy with health-check rollback.
- Sentry + structured logs + uptime monitoring.

**Phase entry criteria:**
1. All client phases (4, 5, 6) at least functional. ✅
2. Domain `bartal.sd` registered. *(deferred — test deploy uses IP:port)*
3. Hetzner / DO + Cloudflare accounts ready. *(deferred for the test)*
