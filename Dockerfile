FROM node:20.9.0-alpine AS builder_frontend

WORKDIR /usr/local/app

COPY ./frontend /usr/local/app/

RUN npm install

RUN npm install -g vite

RUN vite build

FROM node:20.9.0-alpine AS builder_backend

WORKDIR /usr/local/app

COPY ./backend /usr/local/app/

RUN npm install

RUN npm i -g @nestjs/cli

RUN nest build

FROM node:20.9.0-alpine AS server

WORKDIR /usr/src/app

COPY --from=builder_backend /usr/local/app/dist /usr/src/app/dist
COPY --from=builder_backend /usr/local/app/node_modules /usr/src/app/node_modules
COPY --from=builder_frontend /usr/local/app/node_modules /usr/src/app/node_modules
#COPY --from=builder_frontend /usr/local/app/dist /usr/src/app/dist

EXPOSE 3000

CMD [ "node", "/usr/src/app/dist/main.js" ]
