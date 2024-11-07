FROM node:alpine as development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build


FROM node:alpine as production

ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./ 
COPY pnpm.lock ./

RUN npm install -g pnpm

RUN pnpm add @nestjs/cli 

RUN pnpm install --prod

RUN pnpm add @nestjs/cli

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist"]