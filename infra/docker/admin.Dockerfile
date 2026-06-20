# syntax=docker/dockerfile:1.7
# Production image for the Bartal admin dashboard (React + Vite SPA, served by nginx at root).
# Built from the monorepo root: `docker build -f infra/docker/admin.Dockerfile .`

# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

# Copy ALL workspace manifests first so `--frozen-lockfile` resolves the full graph.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/admin/package.json apps/admin/
RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/admin ./apps/admin
RUN pnpm --filter @bartal/shared build

# Absolute API base baked at build (no dev proxy in production). Points at the API's own port.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
# Use `vite build` directly (NOT the package `build` script's `tsc -b`, whose typecheck can
# hard-fail the image). Typecheck runs separately in CI.
RUN pnpm --filter @bartal/admin exec vite build

# ---- Runtime (static, served by nginx at root) ----
FROM nginx:1.27-alpine AS runtime
COPY infra/nginx/admin.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /repo/apps/admin/dist /usr/share/nginx/html
EXPOSE 80
