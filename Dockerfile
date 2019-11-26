## Build client
FROM node:12 as build-client

WORKDIR /src
COPY . .

RUN cd client && \
npm install && \
npm run build

## Build backend
FROM rust:latest as build-backend

WORKDIR /src

COPY --from=build-client /src .

RUN rustup default nightly && \
cargo build

EXPOSE 8000/tcp

CMD ["cargo", "run"]
