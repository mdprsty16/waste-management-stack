# =========================================================================
# STAGE 1: Install Dependencies menggunakan Bun
# =========================================================================
FROM oven/bun:1-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Salin berkas manifes untuk instalasi paket
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# =========================================================================
# STAGE 2: Build Aplikasi
# =========================================================================
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Salin node_modules yang sudah terinstal dari stage sebelumnya
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client ke folder kustom sebelum melakukan build Next.js
RUN bunx prisma generate

# Jalankan proses build Next.js
RUN bun run build

# =========================================================================
# STAGE 3: Production Runner menggunakan Node.js (Ringan & Stabil)
# =========================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Salin hasil build standalone, aset statis, dan folder publik
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# Jalankan server Next.js melalui file server.js hasil kompilasi standalone
CMD ["node", "server.js"]