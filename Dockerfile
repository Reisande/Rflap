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
RUN cargo build --release
COPY src ./src
RUN cargo install --target x86_64-unknown-linux-musl --path .

# Build client
FROM node:12 as build-client

WORKDIR /src
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# Publish Image
FROM scratch as publish

WORKDIR /app
COPY --from=build-backend /usr/local/cargo/bin/automata .
COPY --from=build-client /src/build ./client/build

EXPOSE 8000 8080

CMD ["./automata"]
