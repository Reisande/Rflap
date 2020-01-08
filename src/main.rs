#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate rocket_contrib;

use std::collections::HashSet;
use std::collections::HashMap;
use std::io;

use rocket_contrib::json::{Json, JsonValue};

use std::path::{Path, PathBuf};
use rocket::response::NamedFile;

use multimap::MultiMap;

mod finite_automaton;
//mod cfg;
//mod reg_exp;
//mod pda;
//mod tm;

#[post("/api", format = "json", data = "<input_automaton_json>")]
fn api(input_automaton_json : Json<finite_automaton::FiniteAutomatonJson>) 
       -> JsonValue {
    let (input_automaton, input_string) =
	finite_automaton::FiniteAutomaton::new_from_json(&input_automaton_json);

    let return_path =
	input_automaton.validate_string(
	    input_string, input_automaton_json.should_be_deterministic);
    
    json!(return_path)
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
