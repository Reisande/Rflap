# RFLAP
jflap but in rust

## Build client
```
cd client
npm install
npm run build
```

## Build server
```
cargo build
```

## Run server
The server should serve static files from `client/build`
```
cargo run
```

## Docker
### Build Docker Container
```
docker build -t Reisande/RFLAP .
```

### Run Docker Container
```
docker run -it --rm -p 8000:8000 Reisande/RFLAP
```
