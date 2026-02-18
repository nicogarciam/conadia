FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY index.html vite.config.ts tsconfig.json tsconfig.node.json ./
COPY src ./src

EXPOSE 5173

FROM base AS dev
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

FROM base AS build
ENV NODE_ENV=production
RUN npm run build

FROM nginx:1.25-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

