FROM node:14.15.0-alpine3.10
ARG NODE_ENV="production"

RUN apk add yarn

ENV NODE_ENV="development"

WORKDIR /app
RUN mkdir gdforms
RUN mkdir gdforms-components

WORKDIR /app/gdforms-components
COPY gdforms-components/package.json .
COPY gdforms-components/yarn.lock .
RUN yarn install

WORKDIR /app/gdforms
COPY gdforms/package.json .
COPY gdforms/yarn.lock .
RUN yarn install

WORKDIR /app/gdforms-components
COPY gdforms-components .
RUN export FASTBUILD=1 && yarn build

WORKDIR /app/gdforms
COPY gdforms .

ENV NODE_ENV=${NODE_ENV}
RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000