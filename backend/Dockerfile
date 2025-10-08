FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# Dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
# Install all dependencies (including dev deps for build)
RUN npm ci

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client for build context
RUN npx prisma generate
RUN npm run build

# Runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

COPY package.json package-lock.json* ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm prune --omit=dev

# Copy built artifacts and Prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client with production binaries (musl)
RUN npx prisma generate --schema=./prisma/schema.prisma

USER nodejs
EXPOSE 8080

# Use Cloud Run recommended startup command
CMD ["npm", "start"]
