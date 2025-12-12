# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar pnpm o npm
RUN npm install -g npm

# Copiar archivos de dependencias
COPY apps/backend/package*.json apps/backend/package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY apps/backend ./

# Generar cliente de Prisma
RUN npm run db:generate

# Compilar TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g npm

# Copiar package.json
COPY apps/backend/package*.json apps/backend/package-lock.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el cliente de Prisma generado
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copiar dist compilado
COPY --from=builder /app/dist ./dist

# Copiar migraciones de Prisma
COPY --from=builder /app/prisma ./prisma

# Exponer puerto
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando de inicio con migraciones
CMD ["sh", "-c", "npm run db:migrate:prod && npm run start:prod"]
