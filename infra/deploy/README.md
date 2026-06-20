# Bartal — Per-Port Side-by-Side VPS Test Deploy

Run the full stack (API + Web + Admin + Postgres + Redis) on a VPS that already runs another Docker app,
**without disturbing it**. Each surface gets its own published port; Postgres/Redis stay internal.

```
http://VPS_IP:8080  ->  Web   (Next.js storefront)
http://VPS_IP:8081  ->  API   (NestJS)   + Swagger at /api/docs
http://VPS_IP:8082  ->  Admin (React/Vite SPA)
```

Code is delivered by `git pull` on the VPS and **built on the server**. Build images: `apps/api/Dockerfile`
(api + the migrate/seed builder), `infra/docker/web.Dockerfile`, `infra/docker/admin.Dockerfile`.

---

## Coexistence guarantees (don't touch the neighbor)

| Resource | Dev stack | This test stack |
|---|---|---|
| Compose project | `bartalstore` | `bartal-test` (pinned) |
| Containers | `bartal-postgres`, `bartal-redis` | `bartal-*-test` |
| Volumes | `bartal_postgres_data`, `bartal_redis_data` | `bartal-test-pg\|redis\|storage` |
| Published ports | 5433, 6382 | only `WEB_HTTP_PORT`, `API_HTTP_PORT`, `ADMIN_HTTP_PORT` |
| Network | default | dedicated `bartal-test-net` |

**Root `.env` hazard:** the repo-root `.env` points at the *dev* DB and Compose auto-loads `./.env` for
`${...}` interpolation. **Always run prod commands from `infra/`** (no `./.env` there) and `config`-verify
before `up`. Per-service `env_file: [./.env.production]` supplies all app vars.

**NEVER on this shared host:** `docker system prune`, `docker volume/network prune`, unscoped
`docker compose down`, `docker stop $(docker ps -q)`, host nginx/iptables/UFW edits, or touching the dev
`bartal_postgres_data` / `bartal_redis_data` volumes.

---

## Runbook (on the VPS)

```bash
# 0. Prereqs
docker --version && docker compose version            # Compose v2 required

# 1. Code
cd ~ && git clone <repo-url> BartalStore 2>/dev/null || (cd ~/BartalStore && git pull)
cd ~/BartalStore

# 2. Build-context ignore at repo root (build only — do not commit)
cp infra/.dockerignore .dockerignore

# 3. Env — set VPS_IP everywhere, strong POSTGRES_PASSWORD, fresh JWT secrets, SEED_ADMIN_PASSWORD, ports
cp infra/.env.production.example infra/.env.production
#   then edit infra/.env.production

# 4. Port preflight — ABORT if any of the three is taken
cd ~/BartalStore/infra
for V in WEB_HTTP_PORT API_HTTP_PORT ADMIN_HTTP_PORT; do
  P=$(grep -E "^$V=" ./.env.production | cut -d= -f2)
  if sudo ss -ltnp | grep -q ":$P "; then echo "PORT $P ($V) taken — pick a free port, rebuild affected image"; exit 1; fi
done

# 5. Scoped command (run everything from infra/)
C="docker compose -p bartal-test -f docker-compose.prod.yml --env-file ./.env.production"

# 6. CONFIG-VERIFY before building (root-.env guard)
$C config | grep -E 'DATABASE_URL|REDIS_URL|POSTGRES_DB'   # MUST show @postgres:5432/bartal_test, redis://redis:6379
$C config --volumes                                        # MUST be bartal-test-* only
$C config | grep container_name                            # MUST all end in -test

# 7. Build (web/admin bake the absolute API URL from .env.production)
$C build

# 8. Data first, then migrations (watch the one-shot exit 0)
$C up -d postgres redis
$C up migrate                                              # "All migrations have been applied"

# 9. Rest of the stack
$C up -d api web admin
$C ps                                                      # api healthy; migrate Exited(0); web+admin Up

# 10. Seed once (builder image has ts-node; SEED_* injected via env_file)
$C run --rm --no-deps --entrypoint sh migrate -c "pnpm --filter @bartal/api prisma:seed"
```

---

## Verification (run from `infra/`)

```bash
IP=<VPS_IP>
WP=$(grep ^WEB_HTTP_PORT= ./.env.production|cut -d= -f2)
AP=$(grep ^API_HTTP_PORT= ./.env.production|cut -d= -f2)
DP=$(grep ^ADMIN_HTTP_PORT= ./.env.production|cut -d= -f2)

curl -s http://$IP:$AP/api/health                  # {"status":"ok",...}   (open /api/docs for Swagger)

curl -s -I http://$IP:$WP/                          # 307 -> /ar
curl -s "http://$IP:$WP/ar/products" | grep -qi 'product\|منتج' && echo "products rendered"
#   ^ empty => web can't reach the API host port; uncomment `extra_hosts` on `web` (see below)

curl -s -I http://$IP:$DP/                          # 200
curl -s -I http://$IP:$DP/products/new              # 200 (SPA fallback)
#   Admin login: SEED_ADMIN_PHONE / SEED_ADMIN_PASSWORD. DevTools: no CORS errors on /api calls.

docker ps --format '{{.Names}}\t{{.Status}}' | grep -v -- '-test'   # neighbor still Up
```

**Pass:** `/api/health` 200 · `/api/docs` loads · web `/` 307→/ar and `/ar/products` lists products ·
admin `/` + `/products/new` 200, login works, no CORS error · neighbor untouched · only the 3 test ports new.

---

## Troubleshooting

- **API image fails installing `bcrypt`/`sharp`** → the API image is `node:20-slim` (glibc) precisely to
  get prebuilt native binaries. If a prebuild is ever missing for your arch and it tries to compile, add
  `python3 make g++` to the builder's `apt-get install` line in `apps/api/Dockerfile`.
- **API image fails on the prisma client copy** (`@prisma+client*` glob) → fallback: move `prisma` from
  `devDependencies` to `dependencies` in `apps/api/package.json`, drop the two `COPY ... @prisma`/`.prisma`
  lines in `apps/api/Dockerfile`, restore a runtime `RUN pnpm --filter @bartal/api prisma:generate`, then
  `$C build api migrate`.
- **`/ar/products` empty** → SSR can't reach the host's API port. Uncomment on the `web` service:
  ```yaml
  extra_hosts:
    - "${VPS_IP}:host-gateway"
  ```
  then `$C up -d --force-recreate web`.
- **CORS errors in the browser** → `CORS_ORIGINS` must list `http://VPS_IP:8080` and `http://VPS_IP:8082`
  exactly (no trailing slash), then `$C up -d --force-recreate api`.
- **Logged-in web routes bounce to /login over HTTP** → the `apps/web/src/middleware.ts` edit + `COOKIE_SECURE=false`
  must both be in place (rebuild web). Admin is unaffected.
- **Port taken** → change `WEB_HTTP_PORT` / `API_HTTP_PORT` / `ADMIN_HTTP_PORT` in `.env.production`. If you
  change `API_HTTP_PORT`, also update `NEXT_PUBLIC_API_BASE_URL` + `CORS_ORIGINS` and `$C build web admin`
  (the API URL is baked into those images).

## Teardown (scoped — never affects the neighbor)

```bash
cd ~/BartalStore/infra
C="docker compose -p bartal-test -f docker-compose.prod.yml --env-file ./.env.production"
$C down                 # keep data volumes
$C down -v              # also remove bartal-test-* volumes (test data only)
```
