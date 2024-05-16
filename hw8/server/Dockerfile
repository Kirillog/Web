FROM rust:1.77-alpine as builder

RUN apk add --no-cache pcc-libs-dev musl-dev pkgconfig openssl-dev

COPY . .

RUN cargo build --release

FROM alpine:latest

WORKDIR /app

COPY --from=builder ./Rocket.toml Rocket.toml
COPY --from=builder ./target/release/serv serv

CMD ["./serv"]