FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY ./Backend .

ARG SENTRY_AUTH_TOKEN
ARG ENVIRONMENT

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
