FROM node:22-alpine AS builder

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder build build

CMD ["serve", "-s", "build"]