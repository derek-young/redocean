# ----------------------
# 1. Base image
# ----------------------
  FROM node:20-alpine AS base
  WORKDIR /app
  # Some libraries needed for Alpine + Next.js (like sharp)
  RUN apk add --no-cache libc6-compat gcompat python3 make g++ bash
  
  # ----------------------
  # 2. Install dependencies
  # ----------------------
  FROM base AS deps
  COPY package.json package-lock.json* ./
  RUN npm ci
  
  # ----------------------
  # 3. Build app
  # ----------------------
  FROM base AS builder
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  
  # Build Next.js app in standalone mode
  RUN npm run build
  
  # ----------------------
  # 4. Production image
  # ----------------------
  FROM node:20-alpine AS runner
  WORKDIR /app
  ENV NODE_ENV=production
  ENV PORT=8080
  
  # Non-root user
  RUN addgroup --system --gid 1001 nodejs && \
      adduser --system --uid 1001 nodejs
  
  # Copy standalone build output
  COPY --from=builder /app/.next/standalone ./
  COPY --from=builder /app/.next/static ./.next/static
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/package.json ./package.json
  
  # Switch to non-root user
  USER nodejs
  
  EXPOSE 8080
  
  # Start the app using the standalone server
  CMD ["node", "server.js"]
