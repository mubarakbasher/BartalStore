# infra — Production infrastructure *(Phase 7)*

Not yet scaffolded. Placeholder.

**Planned contents** (per PRD §8.1 + §19.2):
- Production `Dockerfile`s for api / web / admin (api Dockerfile already exists at `apps/api/Dockerfile`).
- `docker-compose.production.yml` orchestrating api + web + admin + nginx + postgres + redis.
- Nginx reverse proxy with SSL (Cloudflare Full Strict).
- Hetzner / DigitalOcean provisioning scripts (Terraform or shell).
- Cloudflare DNS + R2 bucket setup docs.
- GitHub Actions CI (lint, test, build for every PR; deploy on tag).
- Sentry integration docs.

**Phase entry criteria:**
1. All client phases (4, 5, 6) are at least functional.
2. Domain `bartal.sd` registered.
3. Hetzner / DO account ready, Cloudflare account ready.
