# Image de base Node.js
FROM node:20-alpine

# Dossier de travail
WORKDIR /app

# Copier les fichiers package.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port 5173
EXPOSE 5173

# Commande pour démarrer Vite (accessible depuis Docker)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


