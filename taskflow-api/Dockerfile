FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# 🔴 Limite mémoire pendant le build
RUN NODE_OPTIONS="--max_old_space_size=256" npm run build

# ===== STAGE 2 =====
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/main.js"]
