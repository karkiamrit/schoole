# Build stage
FROM node:alpine as build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY .. .
RUN pnpm build

# Production stage
FROM node:alpine as production
WORKDIR /app

COPY --from=build /app/package.json .
COPY --from=build /app/pnpm-lock.yaml .
COPY --from=build /app/dist ./dist

RUN npm install -g pnpm && pnpm install --prod