FROM node:lts-alpine

WORKDIR /app

CMD [ "yarn", "start" ]

RUN apk add --update --no-cache bash nano python build-base

COPY ./package.json .

ENV NODE_ENV=production

RUN yarn && mv ./node_modules ./node_modules_prod && export NODE_ENV=development && yarn && npm cache clean --force && yarn cache clean

ENV NODE_ENV=production

COPY . .

RUN export NODE_ENV=production && yarn build && rm -rf ./node_modules && mv ./node_modules_prod ./node_modules
