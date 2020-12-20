FROM node:14.15.0-alpine3.10
ARG NODE_ENV="production"

RUN apk add yarn

ENV NODE_ENV="development"

WORKDIR /app
RUN mkdir crownforms
RUN mkdir crownforms-components

WORKDIR /app/crownforms-components
COPY crownforms-components/package.json .
COPY crownforms-components/yarn.lock .
RUN yarn install

WORKDIR /app/crownforms
COPY crownforms/package.json .
COPY crownforms/yarn.lock .
RUN yarn install

WORKDIR /app/crownforms-components
COPY crownforms-components .
RUN export FASTBUILD=1 && yarn build

WORKDIR /app/crownforms
COPY crownforms .

ENV NODE_ENV=${NODE_ENV}
RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000