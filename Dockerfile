ARG NODE_VERSION=22.13.0

FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app

# Build
FROM base AS build

COPY --link package.json package-lock.json ./
RUN npm install

COPY --link . .

RUN npm run build

# Run
FROM base

ENV NODE_ENV=production

COPY --from=build /app/.output /app/.output

CMD [ "node", ".output/server/index.mjs" ]
