# ──────────────────────────────────────────
# Stage base: instala dependencias
# ──────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# ──────────────────────────────────────────
# Stage dev: servidor de desarrollo con HMR
# ──────────────────────────────────────────
FROM base AS dev
ENV NODE_ENV=development
EXPOSE 5173
CMD ["npm", "run", "start"]

# ──────────────────────────────────────────
# Stage build: compila la aplicación
# ──────────────────────────────────────────
FROM base AS build
ENV NODE_ENV=production
RUN npm run build

# ──────────────────────────────────────────
# Stage prod: sirve los estáticos con nginx
# ──────────────────────────────────────────
FROM nginx:stable-alpine AS prod
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
