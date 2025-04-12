# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependencias nativas para Prisma (requerido en Alpine)
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Genera el cliente de Prisma primero
RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Asegura el acceso al cliente de Prisma
# Copia el cliente de Prisma y el motor de PostgreSQL
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/node_modules/@prisma/engines ./node_modules/@prisma/engines

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]