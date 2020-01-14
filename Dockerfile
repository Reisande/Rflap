# Build backend
FROM rust:latest as build-backend

WORKDIR /src
RUN apt-get update && \
apt-get install -y build-essential musl musl-tools && \
rustup default nightly && \
rustup target add x86_64-unknown-linux-musl --toolchain=nightly
RUN USER=root cargo new automata
WORKDIR /src/automata
COPY Cargo.toml Cargo.lock ./
RUN cargo fetch
COPY src ./src
RUN cargo install --target x86_64-unknown-linux-musl --path .

# Build front
FROM node:12-slim as build-front

WORKDIR /src
COPY front/package*.json ./
RUN npm install
COPY front .
RUN npm run build

# Build API
FROM node:12-slim as build-api

WORKDIR /src
COPY temp-api/package*.json ./
RUN npm install
COPY temp-api .
RUN npm run build

# Publish Image
FROM node:12-slim as publish

ENV NODE_ENV=production

WORKDIR /app
COPY --from=build-backend /usr/local/cargo/bin/automata /usr/local/bin/automata
COPY --from=build-front /src/build ./front/build
COPY --from=build-api /src ./temp-api

WORKDIR /app/temp-api

EXPOSE 8080

CMD ["/usr/local/bin/node", "build/server.js"]
