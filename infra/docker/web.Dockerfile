# syntax=docker/dockerfile:1.7
# Production image for the Bartal web storefront (Next.js standalone).
# Built from the monorepo root: `docker build -f infra/docker/web.Dockerfile .`

# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

# Copy ALL workspace manifests first so `--frozen-lockfile` resolves the full graph and
# the install layer is cached independently of source changes.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/admin/package.json apps/admin/
RUN pnpm install --frozen-lockfile

# Sources needed to build web (+ the shared package it imports).
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web
# This app ships no public/ dir; create an empty one so the runtime stage's COPY always resolves.
RUN mkdir -p apps/web/public
RUN pnpm --filter @bartal/shared build

# Build happens ON the VPS, so VPS_IP is known — bake the absolute, browser-reachable API base.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
RUN pnpm --filter @bartal/web build

# ---- Runtime (standalone) ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000

# standalone bundle is nested under apps/web; static + public sit NEXT TO server.js.
COPY --from=builder /repo/apps/web/.next/standalone ./
COPY --from=builder /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /repo/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
