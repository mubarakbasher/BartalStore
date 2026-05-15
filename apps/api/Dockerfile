# syntax=docker/dockerfile:1.7
# Multi-stage production image for the Bartal API.
# Built from the monorepo root: `docker build -f apps/api/Dockerfile .`

# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/tsconfig.json packages/shared/
COPY packages/shared/src packages/shared/src
COPY apps/api/package.json apps/api/tsconfig.json apps/api/tsconfig.build.json apps/api/nest-cli.json apps/api/
COPY apps/api/prisma apps/api/prisma
COPY apps/api/src apps/api/src

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bartal/shared build
RUN pnpm --filter @bartal/api prisma:generate
RUN pnpm --filter @bartal/api build

# ---- Runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

COPY --from=builder /repo/pnpm-workspace.yaml /repo/package.json ./
COPY --from=builder /repo/packages/shared/package.json packages/shared/package.json
COPY --from=builder /repo/packages/shared/dist packages/shared/dist
COPY --from=builder /repo/apps/api/package.json apps/api/package.json
COPY --from=builder /repo/apps/api/dist apps/api/dist
COPY --from=builder /repo/apps/api/prisma apps/api/prisma

RUN pnpm install --prod --frozen-lockfile
RUN pnpm --filter @bartal/api prisma:generate

EXPOSE 3001
WORKDIR /app/apps/api
CMD ["node", "dist/main.js"]
