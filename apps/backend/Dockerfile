### Multi-stage Dockerfile for EcoMarket backend (production)
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# Install pnpm globally in the builder image using npm (builder runs as root so this is safe)
# Avoid using `corepack prepare --activate` here because in some CI/container runtimes
# corepack tries to unlink or replace /usr/local/bin/pnpm and can fail with EACCES.
RUN npm install -g pnpm@10.18.2

COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json

# Install workspace deps but focus on backend
RUN pnpm install --no-frozen-lockfile --filter ./apps/backend...

COPY . .

WORKDIR /app/apps/backend
# Build TypeScript (if you have a build step)
RUN pnpm build || echo "no build script"

FROM node:20-bullseye-slim AS runtime
WORKDIR /app

# Create non-root user
RUN useradd --user-group --create-home --shell /bin/false appuser

# Copy built output and node_modules for backend
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend ./apps/backend

WORKDIR /app/apps/backend

ENV NODE_ENV=production
EXPOSE 3002

USER appuser
CMD ["node", "dist/main.js"]
