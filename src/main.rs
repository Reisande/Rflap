#![feature(proc_macro_hygiene, decl_macro)]

use std::collections::HashMap;
use std::collections::HashSet;
use std::env;
use std::io;

use serde::{Deserialize, Serialize};
use serde_json::Result;

use multimap::MultiMap;

mod finite_automaton;
mod generate_tests;

fn api(input_automaton_json: finite_automaton::FiniteAutomatonJson) -> Result<String> {
    let (input_automaton, input_strings, hint) =
        finite_automaton::FiniteAutomaton::new_from_json(&input_automaton_json);

    let mut return_paths = Vec::new();

    for input_string in input_strings {
        return_paths.push(input_automaton.validate_string(input_string.to_owned()));
    }

    let callback = finite_automaton::FiniteAutomatonCallback {
        list_of_strings: return_paths.to_owned(),
        hint: hint.to_owned(),
    };

    let callback_string = serde_json::to_string(&callback)?;
    println!("{}", callback_string);
    Ok("".to_string())
}

fn tests(tests: generate_tests::TestsJson) -> Result<String> {
    let callback = generate_tests::generate_tests(tests);
    let t = serde_json::to_string(&callback)?;
    println!("{}", t);
    Ok("".to_string())
}

fn main() -> io::Result<()> {
    use std::io::Read;

    let mut buffer = String::new();
    // student input
    io::stdin().read_to_string(&mut buffer)?;

    let args: Vec<String> = env::args().collect();

    if &args[1] == "automata" {
        api(serde_json::de::from_str::<finite_automaton::FiniteAutomatonJson>(&buffer).unwrap());
    } else if &args[1] == "tests" {
        tests(serde_json::de::from_str::<generate_tests::TestsJson>(&buffer).unwrap());
    }

    Ok(())
}
