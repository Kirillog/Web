FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json .

RUN npm install -g @angular/cli
RUN npm install

COPY . .

RUN ng build --output-path build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build/browser build

CMD ["serve", "-s", "build"]