# [Rflap](https://rflap.acmuic.app/)

[Jflap](http://www.jflap.org/)  but in Rust

Supports creation of state-machines, string generation and testing, for **DFAs**, **NFAs**, **CFGs**, **Push-Down Automata**, **REGEXs** , and **Turing Machines**. 

Imports and exports student work for autograding in Languages and Automata courses.

Currently used in Unviersity of Illinois at Chicago's CS 301: Finite Languages and Automata.

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
docker build -t reisande/rflap .
```

### Run Docker Container
```
docker run -it --rm -p 8080:8080 reisande/rflap
```
