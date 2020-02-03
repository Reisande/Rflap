# RFLAP
jflap but in rust

## Functionality


#### Supports creation of state-machines and string generation and testing, for **DFAs**, **NFAs**, **CFGs**, **Push-Down Automata**, **REGEXs** , and **Turing Machines**. 




![sample_1](https://i.ibb.co/R6SyzRC/rflap-github-2.png)


Where triangle denotes a starting state, and grey border denotes an accepting state.


### Testing Strings:



![sample_2](https://i.ibb.co/ZTgtCdH/rflap-github-1.png)


RUST API call occurs during string testing/generation. Exports to JSON and XML!




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
