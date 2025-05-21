
FROM node:23.6.0-alpine AS dependencies

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

FROM dependencies AS build

WORKDIR /usr/src/app

COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

RUN npm run build

FROM cgr.dev/chainguard/node:latest AS deploy

USER 1000

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 3333

CMD ["dist/infra/http/server.cjs"]
