FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer TOUTES les dépendances (dev incluses pour le build)
RUN npm ci

# Copier le code source
COPY . .

# Build avec limite mémoire adaptée à Koyeb
RUN NODE_OPTIONS="--max_old_space_size=512" npm run build

# ===== STAGE 2 : Production =====
FROM node:20-alpine

WORKDIR /app

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=8000

# Copier uniquement package*.json
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev && npm cache clean --force

# Copier le build depuis le stage builder
COPY --from=builder /app/dist ./dist

# Exposer le port
EXPOSE 8000

# Lancer l'application
CMD ["node", "dist/main.js"]