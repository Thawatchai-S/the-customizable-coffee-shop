# Standalone build — context is this directory (apps/api), not the repo root.
# docker build -t coffee-shop-api apps/api

FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:26-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json .
COPY src src
COPY drizzle.config.js .
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "src/server.js"]
