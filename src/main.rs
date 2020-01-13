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

fn api(
    input_automaton_json: finite_automaton::FiniteAutomatonJson,
) -> Json<(Vec<(bool, bool, Vec<(char, String)>, String)>, String)> {
    let (input_automaton, input_strings, hint) =
        finite_automaton::FiniteAutomaton::new_from_json(&input_automaton_json);

    let mut return_paths = Vec::new();

    for input_string in input_strings {
        return_paths.push(input_automaton.validate_string(input_string.to_owned()));
    }
    println!("{:?}", Json((return_paths.to_owned(),hint.to_owned())));

    Json((return_paths, hint))
}

fn tests(tests: generate_tests::TestsJson) -> Json<Vec<String>> {
    let return_vec = generate_tests::generate_tests(tests);
    Json(return_vec.to_owned())
}

fn main() -> io::Result<()> {
    use std::io::Read;

    let mut buffer = String::new();
    io::stdin().read_to_string(&mut buffer)?;

    let args: Vec<String> = env::args().collect();
    
<<<<<<< HEAD
    for string in args {
        println("{}", string);
=======
    for string in &args {
        println!("{}\n", string);
>>>>>>> import/export merge conflict resolves and prep to PING API
    }

    if &args[1] == "automata" {
        println!(
            "{:?}",
            api(
                serde_json::de::from_str::<finite_automaton::FiniteAutomatonJson>(&buffer).unwrap()
            )
        );
    } else if &args[1] == "tests" {
        println!(
            "{:?}",
            tests(serde_json::de::from_str::<generate_tests::TestsJson>(&buffer).unwrap())
        );
    }

    Ok(())
}
