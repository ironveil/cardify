# --- Docker Build File ---

# Use NodeJS 18
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install NodeJS dependencies
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

# Copy files
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build app
RUN yarn gendb
RUN yarn build

# Setup production environment
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create separate user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy files
COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Run the app
USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD [ "node", "server.js" ]