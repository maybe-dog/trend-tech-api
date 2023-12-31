FROM node:18.18-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY . .

CMD ["yarn", "start"]
