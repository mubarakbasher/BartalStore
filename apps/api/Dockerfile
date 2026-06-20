# syntax=docker/dockerfile:1.7
# Multi-stage production image for the Bartal API.
# Built from the monorepo root: `docker build -f apps/api/Dockerfile .`
#
# Base: node:22-slim (Debian glibc), chosen over alpine because the API has NATIVE deps
# (bcrypt ^5.1.1, sharp) whose prebuilt binaries don't cover musl/alpine — on alpine bcrypt
# compiles from source and fails without a toolchain. glibc also gives Prisma a clean openssl.

# ---- Builder ----
FROM node:22-slim AS builder
WORKDIR /repo

# openssl: Prisma's query engine links libssl. ca-certificates: outbound TLS during install.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

# Lockfile MUST be present for --frozen-lockfile (was the from-clean build blocker).
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/tsconfig.json packages/shared/
COPY packages/shared/src packages/shared/src
COPY apps/api/package.json apps/api/tsconfig.json apps/api/tsconfig.build.json apps/api/nest-cli.json apps/api/
COPY apps/api/prisma apps/api/prisma
COPY apps/api/src apps/api/src

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bartal/shared build
RUN pnpm --filter @bartal/api prisma:generate     # prisma CLI present here (devDeps installed)
RUN pnpm --filter @bartal/api build

# ---- Runtime ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# openssl for Prisma at runtime; wget for the compose healthcheck (Debian slim has neither by default).
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates wget \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

COPY --from=builder /repo/pnpm-lock.yaml /repo/pnpm-workspace.yaml /repo/package.json ./
COPY --from=builder /repo/packages/shared/package.json packages/shared/package.json
COPY --from=builder /repo/packages/shared/dist packages/shared/dist
COPY --from=builder /repo/apps/api/package.json apps/api/package.json
COPY --from=builder /repo/apps/api/dist apps/api/dist
COPY --from=builder /repo/apps/api/prisma apps/api/prisma

# `--prod` drops the prisma devDep CLI, so DON'T run `prisma generate` here. Install prod deps
# (bcrypt/sharp resolve from glibc prebuilts), then copy the already-generated Prisma client
# forward from the builder so the runtime has the engine + generated client.
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /repo/node_modules/.pnpm/@prisma+client* /app/node_modules/.pnpm/
COPY --from=builder /repo/node_modules/.prisma /app/node_modules/.prisma

EXPOSE 3001
WORKDIR /app/apps/api
CMD ["node", "dist/main.js"]
