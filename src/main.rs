#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate rocket_contrib;

use std::collections::HashSet;
use std::collections::HashMap;

use rocket_contrib::json::{Json, JsonValue};
use rocket_contrib::serve::StaticFiles;

mod finite_automaton;
//mod reg_exp;
//mod cfg;
//mod pda;
//mod tm;

#[post("/", format = "json", data = "<input_automaton>")]
fn api(input_automaton : Json<finite_automaton::FiniteAutomatonJson>) 
		 -> JsonValue {
	let (mut test_dfa, input_string) =
		finite_automaton::FiniteAutomaton::new_from_json(&input_automaton);

	let return_path = test_dfa.validate_string(input_string);
	
	json!(return_path)
}

fn main() {
	rocket::ignite()
	.mount("/api", routes![api])
	.mount("/", StaticFiles::from("client/build"))
	.launch();
}
