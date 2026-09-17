# Standalone build — context is this directory (apps/web), not the repo root.
# docker build -t coffee-shop-web apps/web

FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
ENV API_HOST=api API_PORT=3000
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1:80/ || exit 1
