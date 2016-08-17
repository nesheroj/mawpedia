FROM node:6-slim

# Shut up meg
ENV NPM_CONFIG_LOGLEVEL warn

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
RUN npm install -g typings
COPY package.json /usr/src/app/
COPY node_modules /usr/src/app/
RUN npm install; exit 0

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
