# ── Stage 1: Install dependencies ──
FROM oven/bun:1-alpine AS deps

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ── Stage 2: Build Next.js ──
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build Next.js (standalone output)
RUN bun run build

# ── Stage 3: Production runtime ──
FROM oven/bun:1-alpine AS runner

# Security: run as non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Set production env
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Copy standalone output and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema (needed for db push at runtime)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Ensure data directory exists and is owned by nextjs
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Expose port
EXPOSE 3000

# Health check using busybox wget against /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

USER nextjs

# Startup script: sync database schema with visible logging then start server
CMD ["sh", "-c", "echo '==> Initializing SQLite schema...' && bunx prisma db push --skip-generate && echo '==> Starting K-ToolBox server...' && bun server.js"]


