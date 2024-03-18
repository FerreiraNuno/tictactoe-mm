FROM node:20.11.1 AS builder_fronend

WORKDIR /usr/local/app

COPY ./frontend /usr/local/app/

RUN npm install

RUN npm install -g vite

RUN vite build

FROM node:19.9.0 AS builder_backend

WORKDIR /usr/local/app

COPY ./backend /usr/local/app/

RUN npm install

RUN npm i -g @nestjs/cli

RUN nest build

FROM node:19.9.0 AS server

WORKDIR /usr/src/app

COPY --from=builder_backend /usr/local/app/dist /usr/src/app/dist
COPY --from=builder_fronend /usr/local/app/dist /usr/src/app/dist

COPY ./backend .

EXPOSE 4200

CMD [ "node", "dist/main.js" ]
