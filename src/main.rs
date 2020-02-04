#![feature(proc_macro_hygiene, decl_macro)]

use std::collections::HashMap;
use std::collections::HashSet;
use std::env;
use std::fs;
use std::io;
use std::io::{BufRead, BufReader, Error, Write};
use std::path::Path;

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

// return is a tuple of number of passed test cases vs total cases
fn grade(
    source: finite_automaton::FiniteAutomatonJson,
    target: finite_automaton::FiniteAutomatonJson,
    num_tests: u16,
) -> (u16, u16, Vec<String>, Vec<u8>, Vec<String>, Vec<u8>, bool) {
    // generate TestsJson array

    let test_strings_deterministic = generate_tests::generate_tests(generate_tests::TestsJson {
        alphabet: target.alphabet.to_owned(),
        size: num_tests / 2, // how many strings for non deterministic, ignored for deterministic
        length: 10,          // longest string
        random: false,
    })
    .return_vec;
    // then take out the first num_tests/2 elements from the vector

    let test_strings_nondeterministic = generate_tests::generate_tests(generate_tests::TestsJson {
        alphabet: target.alphabet.to_owned(),
        size: num_tests / 2, // how many strings for non deterministic, ignored for deterministic
        length: 10,          // longest string
        random: true,
    })
    .return_vec;
    // run tests on source and target, check that the result is equal

    let source: finite_automaton::FiniteAutomaton =
        finite_automaton::FiniteAutomaton::new_from_json(&source).0;
    let target: finite_automaton::FiniteAutomaton =
        finite_automaton::FiniteAutomaton::new_from_json(&target).0;

    let mut deterministic_scores: Vec<u8> = Vec::new();
    let mut nondeterministic_scores: Vec<u8> = Vec::new();

    let mut passed: u16 = 0;

    for test in &test_strings_deterministic {
        let (_, accepted_source, _, _) = source.validate_string(test.to_string());
        let (_, accepted_target, _, _) = target.validate_string(test.to_string());

        if accepted_source == accepted_target {
            passed += 1;
        }

        deterministic_scores.push((accepted_source == accepted_target) as u8);
    }

    for test in &test_strings_nondeterministic {
        let (_, accepted_source, _, _) = source.validate_string(test.to_string());
        let (_, accepted_target, _, _) = target.validate_string(test.to_string());

        if accepted_source == accepted_target {
            passed += 1;
        }

        nondeterministic_scores.push((accepted_source == accepted_target) as u8);
    }

    (
        passed,
        num_tests,
        test_strings_deterministic,
        deterministic_scores,
        test_strings_nondeterministic,
        nondeterministic_scores,
        source.is_deterministic() || !target.is_deterministic(),
    )
}

#[derive(Serialize, Deserialize)]
struct Tests {
    score: f32,
    name: String,
    number: (u8, u8),
    visibility: String,
}

#[derive(Serialize, Deserialize)]
struct GradingResults {
    score: f32,
    tests: Vec<Tests>,
}

impl GradingResults {
    pub fn new(
        public_tests: (u16, u16, Vec<String>, Vec<u8>, Vec<String>, Vec<u8>),
        private_tests: (u16, u16, Vec<String>, Vec<u8>, Vec<String>, Vec<u8>),
    ) -> GradingResults {
        let final_score: f32 = ((public_tests.0 + private_tests.0) as f32)
            / ((public_tests.1 + private_tests.1) as f32);

        let mut tests: Vec<Tests> = Vec::new();

        for test in 0..public_tests.2.len() {
            tests.push(Tests {
                score: public_tests.3[test] as f32,
                name: public_tests.2[test].to_owned(),
                number: (0, 0),
                visibility: "visible".to_string(),
            });
        }

        for test in 0..private_tests.4.len() {
            tests.push(Tests {
                score: public_tests.3[test] as f32,
                name: public_tests.2[test].to_owned(),
                number: (0, 0),
                visibility: "hidden".to_string(),
            });
        }

        GradingResults {
            score: final_score,
            tests: tests,
        }
    }

    pub fn write_results(self) {}
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
    } else if &args[1] == "grading" {
        // answer file will be passed in the second command line argument
        let path = Path::new(&args[2]);
        let buffer_answer = fs::read_to_string(path)?;

        // for the actual grading, we should show like 20 shorter strings and hide 80,
        let public_tests = grade(
            serde_json::de::from_str::<finite_automaton::FiniteAutomatonJson>(&buffer).unwrap(),
            serde_json::de::from_str::<finite_automaton::FiniteAutomatonJson>(&buffer_answer)
                .unwrap(),
            10,
        );
        let hidden_tests = grade(
            serde_json::de::from_str::<finite_automaton::FiniteAutomatonJson>(&buffer).unwrap(),
            serde_json::de::from_str::<finite_automaton::FiniteAutomatonJson>(&buffer_answer)
                .unwrap(),
            90,
        );

        // then initialize a data structure which follows the output of results.json
        // the only members out of results.json which matter are score and tests
        // the only members of tests which we care about are

        // then serialize and write to a buffer file, which is then consolidated into a larger
        // file by run_autograder
    }

    Ok(())
}
