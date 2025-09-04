FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# Install dependencies (all, including dev)
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client at build-time
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

# Install only production deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy prior-built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Ensure Prisma client is generated with prod binaries
RUN npx prisma generate

USER nodejs
EXPOSE 8080

# For prototyping: push schema changes automatically
CMD npx prisma db push && npm start

# For production: push schema changes automatically
# CMD npx prisma migrate deploy && npm start
