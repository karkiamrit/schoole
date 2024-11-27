# Build stage
FROM node:alpine as build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build

# Development stage
FROM node:alpine as development

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install all dependencies including devDependencies
RUN npm install -g pnpm && \
    pnpm install && \
    pnpm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -D

COPY .eslintrc.js .
COPY .prettierrc .
COPY generator.mjs .
COPY generatorrest.mjs .
COPY nest-cli.json .
COPY tsconfig.json .
COPY docker/scripts/docker-entrypoint.sh /

RUN chmod +x /docker-entrypoint.sh

COPY . .

ENTRYPOINT ["/docker-entrypoint.sh"]

# Production stage
FROM node:alpine as production

WORKDIR /app

COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build /app/dist ./dist
COPY docker/scripts/docker-entrypoint.sh /

RUN npm install -g pnpm && pnpm install --prod \
    && chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]