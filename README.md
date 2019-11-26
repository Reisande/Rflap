# RFLAP
jflap but in rust

## Functionality


#### Supports creation of state-machines and string generation and testing, for **DFAs**, **NFAs**, **CFGs**, **Push-Down Automata**, **REGEXs** , and **Turing Machines**. 




![sample_dfa](https://i.ibb.co/R98GBXD/Screenshot-20191126-172155.png)


Where blue denotes a starting state, and black denotes an accepting state.


### Testing Strings:


![Sample_NFA](https://i.ibb.co/zrthVMc/Screenshot-20191126-144158-2.png)

![Sample_NFA2](https://i.ibb.co/vdG4mgf/Screenshot-20191126-150348.png)


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
docker run -it --rm -p 8000:8000 reisande/rflap
```
