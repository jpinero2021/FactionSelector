# ----------------------------
# Etapa 1: Build
# ----------------------------
FROM node:20-alpine AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del proyecto
COPY . .

# Construir proyecto (opcional si tienes scripts de build, e.g. Vite)
RUN npm run build

# ----------------------------
# Etapa 2: Producción
# ----------------------------
FROM node:20-alpine AS production

WORKDIR /app

# Copiar solo los artefactos necesarios
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/vite.config.ts ./vite.config.ts

# Copiar otros archivos necesarios
COPY --from=builder /app/registros.json ./registros.json

# Exponer puerto (usa variable PORT si está definida, sino 5000)
ENV PORT=5000
EXPOSE $PORT

# Comando para iniciar la app
CMD ["node", "server/index.js"]
