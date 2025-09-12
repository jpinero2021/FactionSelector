# Dockerfile.dev

FROM node:20

# Crear directorio de trabajo
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

# Copiar todo el código
COPY . .

# Exponer el puerto usado por el server
EXPOSE 5000

# Comando por defecto
CMD ["npm", "run", "dev"]
