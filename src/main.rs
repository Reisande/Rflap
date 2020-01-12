#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;

use std::collections::HashMap;
use std::collections::HashSet;
use std::io;

use rocket_contrib::json::{Json, JsonValue};

use rocket::response::NamedFile;
use std::path::{Path, PathBuf};

use multimap::MultiMap;

mod finite_automaton;
mod generate_tests;
//mod cfg;
//mod reg_exp;
//mod pda;
//mod tm;

#[post("/api", format = "application/json", data = "<input_automaton_json>")]
fn api(
    input_automaton_json: Json<finite_automaton::FiniteAutomatonJson>,
) -> Json<(Vec<(bool, bool, Vec<(char, String)>, String)>, String)> {
    let (input_automaton, input_strings, hint) =
        finite_automaton::FiniteAutomaton::new_from_json(&input_automaton_json);

    let mut return_paths = Vec::new();

    for input_string in input_strings {
        return_paths.push(input_automaton.validate_string(input_string.to_owned()));
    }

    Json((return_paths, hint))
}

#[post("/generate_tests", format = "application/json", data = "<tests>")]
fn tests(tests: Json<generate_tests::TestsJson>) -> Json<Vec<String>> {
    let return_vec = generate_tests::generate_tests(tests.into_inner());
    Json((*return_vec).to_owned())
}

#[get("/")]
pub fn index() -> io::Result<NamedFile> {
    NamedFile::open("client/build/index.html")
}

#[get("/<file..>")]
pub fn file(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("client/build/").join(file)).ok()
}

fn main() {
    rocket::ignite()
        .mount("/", routes![api, index, file])
        .launch();
}
