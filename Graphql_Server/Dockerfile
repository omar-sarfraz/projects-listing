FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY ./Graphql_Server .

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
