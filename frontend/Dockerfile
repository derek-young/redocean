FROM node:20-alpine AS base
WORKDIR /app
# Alpine dependencies needed for Next.js (sharp, gcompat, etc.)
RUN apk add --no-cache libc6-compat gcompat python3 make g++ bash

# Install dependencies
FROM base AS deps
WORKDIR /app

# Copy frontend package.json and lockfile
COPY package.json package-lock.json* ./

# Install all dependencies (including the local types package)
RUN npm ci

# Build app
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy frontend source code
COPY . .

# Build Next.js in standalone mode
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Add non-root user
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
