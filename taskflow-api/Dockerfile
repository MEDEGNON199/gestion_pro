FROM node:20-alpine AS builder

WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build l'application (génère /dist)
RUN npm run build

# ===== STAGE 2: Production =====
FROM node:20-alpine

WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer SEULEMENT les dépendances de production
RUN npm ci --only=production

# Copier le build depuis le stage précédent
COPY --from=builder /app/dist ./dist

# Exposer le port
EXPOSE 8000

# ✅ Lancer la version buildée (pas de watch!)
CMD ["node", "dist/main"]