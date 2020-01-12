#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;

use std::collections::HashMap;
use std::collections::HashSet;
use std::io;

use rocket::http::Method;
use rocket::response::NamedFile;
use rocket::{get, options, post, routes};
use rocket_contrib::json::{Json, JsonValue};
use rocket_cors::{AllowedHeaders, AllowedOrigins, Cors, CorsOptions, Error, Guard, Responder};
use std::path::{Path, PathBuf};

use multimap::MultiMap;

mod finite_automaton;
mod generate_tests;
//mod cfg;
//mod reg_exp;
//mod pda;
//mod tm;

#[post("/api", data = "<input_automaton_json>")]
fn api(input_automaton_json: Json<finite_automaton::FiniteAutomatonJson>) -> JsonValue {
    let (input_automaton, input_strings, hint) =
        finite_automaton::FiniteAutomaton::new_from_json(&input_automaton_json);

    let mut return_paths = Vec::new();

    for input_string in input_strings {
        return_paths.push(input_automaton.validate_string(input_string.to_owned()));
    }

    json!((return_paths, hint))
}

#[get("/")]
pub fn index() -> io::Result<NamedFile> {
    NamedFile::open("client/build/index.html")
}

#[get("/<file..>")]
pub fn file(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("client/build/").join(file)).ok()
}

fn main() -> () {
    let default = rocket_cors::CorsOptions::default();
    let allowed_origins = AllowedOrigins::all(); //some_exact(&["https://developer.mozilla.org"]);

    // You can also deserialize this
    let cors = rocket_cors::CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Post].into_iter().map(From::from).collect(),
        allowed_headers: AllowedHeaders::some(&["Authorization", "Accept"]),
        allow_credentials: true,
        ..Default::default()
    }
    .to_cors();

    rocket::ignite()
        .mount("/", routes![api, index, file])
        // Mount the routes to catch all the OPTIONS pre-flight requests
        .mount("/", rocket_cors::catch_all_options_routes())
        .manage(default)
        .launch();
}
