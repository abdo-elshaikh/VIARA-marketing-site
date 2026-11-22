# =============================================================================
# VIARA Marketing Site — Dockerfile for Cloudflare Workers Deployment
# =============================================================================
# Build: viara-marketing-worker:latest
# Runs: Node.js app with Cloudflare Miniflare + Vinext framework
# =============================================================================

# ─── Base Image ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS base

# Create non-root user (matching VIARA conventions)
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=1000

RUN addgroup --gid ${USER_GID} ${USERNAME} && \
    adduser --uid ${USER_UID} --ingroup ${USERNAME} -s /bin/sh ${USERNAME}

# ─── Install Dependencies ────────────────────────────────────────────────────
FROM base AS deps

# Install tzdata for consistent timezone handling, and other build deps
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install pnpm (matching host environment)
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10

# Install node dependencies (production only for lean image)
RUN --mount=type=cache pnpm install --frozen-lockfile --prod

# ─── Build Application ───────────────────────────────────────────────────────
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application with Vinext/Next.js
RUN --mount=type=cache pnpm build

# ─── Production Runners ──────────────────────────────────────────────────────
FROM base AS release

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/scripts ./scripts

# Set correct ownership for non-root user
RUN chown -R ${USERNAME}:${USERNAME} /app

# Switch to non-root user
USER ${USERNAME}

# Expose the Vine dev server / preview port
# Port 8080: internal Vine server (matches default Vite port)
# Port 8787: Miniflare inspector (for local dev only)
EXPOSE 8080 8787

# ─── Development Runner ──────────────────────────────────────────────────────
FROM base AS dev

WORKDIR /app

# Copy all source for hot-reload
COPY . .

# Install dev dependencies
RUN --mount=type=cache pnpm install --frozen-lockfile
RUN chown -R ${USERNAME}:${USERNAME} /app

USER ${USERNAME}

# Development command: run Vine dev server
# Default: pnpm dev (Vite dev server + Miniflare)
CMD ["pnpm", "dev"]

# ─── Production Runner ──────────────────────────────────────────────────────
FROM release AS production

# Production command: start via wrangler (Cloudflare deployment)
# Uses the wrangler.json that was copied from dist/server/
CMD ["node", "--import", "./scripts/sites-env.mjs", "./node_modules/wrangler/bin/wrangler.js", "dev", \
     "--config", "dist/server/wrangler.json", "--local", \
     "--persist-to", ".wrangler/state", "--ip", "127.0.0.1", "--inspector-port", "0"]