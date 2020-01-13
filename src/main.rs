#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;

use std::collections::HashMap;
use std::collections::HashSet;
use std::env;
use std::io;

use rocket_contrib::json::{Json, JsonValue};

use multimap::MultiMap;

mod finite_automaton;
mod generate_tests;

fn api(input_automaton_json: finite_automaton::FiniteAutomatonJson) -> JsonValue {
    let (input_automaton, input_strings, hint) =
        finite_automaton::FiniteAutomaton::new_from_json(&input_automaton_json);

    let mut return_paths = Vec::new();

    for input_string in input_strings {
        return_paths.push(input_automaton.validate_string(input_string.to_owned()));
    }

    json!((return_paths, hint))
}

fn main() -> io::Result<()> {
    use std::io::Read;

    let mut buffer = String::new();
    io::stdin().read_to_string(&mut buffer)?;

    println!(
        "{:?}",
        api(serde_json::de::from_str::<finite_automaton::FiniteAutomatonJson>(&buffer).unwrap())
    );

    Ok(())
}
