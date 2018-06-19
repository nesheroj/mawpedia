FROM node:10 AS build

# Shut up meg
ENV NPM_CONFIG_LOGLEVEL warn \
    NODE_ENV=production

# Create app directory
RUN mkdir /app
WORKDIR /app

# Copy source
COPY . ./

# Install all dependencies
RUN npm install --production=false

RUN npm test && npm run lint

RUN npm run build:prod

RUN npm prune --production

FROM node:10-alpine as run

ENV NODE_ENV=production

# Create app directory
RUN mkdir /app
WORKDIR /app

COPY --from=build --chown=node:node ["/app/bin", "./bin"]
COPY --from=build --chown=node:node ["/app/dist", "./dist"]
COPY --from=build --chown=node:node ["/app/node_modules", "./node_modules"]
COPY --from=build --chown=node:node ["/app/package.json", "./"]

USER node

EXPOSE 8080

CMD [ "npm", "start" ]
