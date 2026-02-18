FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

EXPOSE 3000

FROM base AS dev
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

FROM base AS build
ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]

