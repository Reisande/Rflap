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
//mod reg_exp;
//mod cfg;
//mod pda;
//mod tm;

// should change this to use the #[test] ast macro
fn test_dfas() -> () {
    // start out with a test DFA, which recognizes the language of only a* out
    // of the alphabet a,b,c
    
    let mut a_alphabet : HashSet<char> = HashSet::new();
    a_alphabet.insert('a');
    a_alphabet.insert('b');
    
    let a_start_state : String = "q_0".to_owned();

    let mut a_new_states : HashMap<String, bool> = HashMap::new();
    a_new_states.insert("q_0".to_owned(), true);
    a_new_states.insert("q_1".to_owned(), false);
    
    let mut a_transitions : MultiMap<(String, Option<char>), String> = MultiMap::new();

    a_transitions.insert(("q_0".to_owned(), Some('a')), "q_0".to_owned());
    a_transitions.insert(("q_0".to_owned(), Some('b')), "q_1".to_owned());
    a_transitions.insert(("q_1".to_owned(), Some('a')), "q_1".to_owned());
    a_transitions.insert(("q_1".to_owned(), Some('b')), "q_1".to_owned());	

    let mut test_dfa : finite_automaton::FiniteAutomaton =
	finite_automaton::FiniteAutomaton::new(a_alphabet, a_start_state, a_new_states, a_transitions, true);
    
    println!("\n{:#?}", test_dfa);
    //println!("\n{:?}", test_dfa.generate_tests(1, 8, true, 8, true));

    // lets check some hand written sample strings
    println!("'' : {:?} \na: {:?} \naa: {:?} \nab: {:?}",
	     test_dfa.validate_string("".to_string(), true),
	     test_dfa.validate_string("a".to_string(), true),
	     test_dfa.validate_string("aa".to_string(), true),
	     test_dfa.validate_string("ab".to_string(), true));

}

fn test_nfas() -> () {
    // simplified solution to 2a from hw1 f19
    // multiple transitions with the same character but different end states
    // however there are no epsilon transitions
    let mut a_alphabet : HashSet<char> = HashSet::new();
    a_alphabet.insert('a');
    a_alphabet.insert('b');
    
    let a_start_state : String = "q_0".to_owned();

    let mut a_new_states : HashMap<String, bool> = HashMap::new();
    a_new_states.insert("q_0".to_owned(), false);
    a_new_states.insert("q_1".to_owned(), false);
    a_new_states.insert("q_2".to_owned(), false);
    a_new_states.insert("q_3".to_owned(), true);
    
    let mut a_transitions : MultiMap<(String, Option<char>), String> = MultiMap::new();

    a_transitions.insert(("q_0".to_owned(), Some('a')), "q_1".to_owned());
    a_transitions.insert(("q_0".to_owned(), Some('b')), "q_2".to_owned());

    a_transitions.insert(("q_1".to_owned(), Some('a')), "q_1".to_owned()); 
    a_transitions.insert(("q_1".to_owned(), Some('b')), "q_1".to_owned());
    a_transitions.insert(("q_1".to_owned(), Some('b')), "q_3".to_owned());

    a_transitions.insert(("q_2".to_owned(), Some('b')), "q_2".to_owned());
    a_transitions.insert(("q_2".to_owned(), Some('a')), "q_2".to_owned());
    a_transitions.insert(("q_2".to_owned(), Some('a')), "q_3".to_owned());

    let mut test_nfa_a : finite_automaton::FiniteAutomaton =
	finite_automaton::FiniteAutomaton::new(a_alphabet, a_start_state, a_new_states, a_transitions, false);

    //println!("\n{:#?}", test_nfa_a);
    //println!("\n{:?}", test_dfa.generate_tests(1, 8, true, 8, true));

    // lets check some hand written sample strings
    println!("'' : {:?} \na: {:?} \naa: {:?} \nab: {:?} \naba: {:?} \nbab: {:?} \nabb: {:?} \nab: {:?}",
	     test_nfa_a.validate_string("".to_string(), false),
	     test_nfa_a.validate_string("a".to_string(), false),
	     test_nfa_a.validate_string("aa".to_string(), false),
	     test_nfa_a.validate_string("ab".to_string(), false),
	     test_nfa_a.validate_string("aba".to_string(), false),
	     test_nfa_a.validate_string("bab".to_string(), false),
	     test_nfa_a.validate_string("abb".to_string(), false),
	     test_nfa_a.validate_string("baa".to_string(), false));
    
    // simplified solution to 2b from hw1 f19
    // this one has epsilon transitions, and accepts any string with a caridanility of 2 or less

    let mut b_alphabet : HashSet<char> = HashSet::new();
    b_alphabet.insert('0');
    b_alphabet.insert('1');
    
    let b_start_state : String = "q_0".to_owned();

    let mut b_new_states : HashMap<String, bool> = HashMap::new();
    b_new_states.insert("q_0".to_owned(), false);
    b_new_states.insert("q_1".to_owned(), false);
    b_new_states.insert("q_2".to_owned(), false);
    b_new_states.insert("q_3".to_owned(), true);
    
    let mut b_transitions : MultiMap<(String, Option<char>), String> = MultiMap::new();

    b_transitions.insert(("q_0".to_owned(), Some('0')), "q_1".to_owned());
    b_transitions.insert(("q_0".to_owned(), Some('1')), "q_1".to_owned());
    b_transitions.insert(("q_0".to_owned(), None), "q_3".to_owned());

    b_transitions.insert(("q_1".to_owned(), Some('0')), "q_2".to_owned());
    b_transitions.insert(("q_1".to_owned(), Some('1')), "q_2".to_owned());
    b_transitions.insert(("q_1".to_owned(), None), "q_3".to_owned());

    b_transitions.insert(("q_2".to_owned(), None), "q_3".to_owned());

    let mut test_nfa_b : finite_automaton::FiniteAutomaton =
	finite_automaton::FiniteAutomaton::new(b_alphabet, b_start_state, b_new_states, b_transitions, false);
    
    // lets check some hand written sample strings
    println!("'' : {:?} \n0: {:?} \n00: {:?} \n01: {:?} \n010: {:?} \n101: {:?} \n011: {:?} \n100: {:?}",
	     test_nfa_b.validate_string("".to_string(), false),
	     test_nfa_b.validate_string("0".to_string(), false),
	     test_nfa_b.validate_string("00".to_string(), false),
	     test_nfa_b.validate_string("01".to_string(), false),
	     test_nfa_b.validate_string("010".to_string(), false),
	     test_nfa_b.validate_string("101".to_string(), false),
	     test_nfa_b.validate_string("011".to_string(), false),
	     test_nfa_b.validate_string("100".to_string(), false));
}

#[post("/api", format = "json", data = "<input_automaton>")]
fn api(input_automaton : Json<finite_automaton::FiniteAutomatonJson>) 
       -> JsonValue {
    let (mut test_dfa, input_string) =
	finite_automaton::FiniteAutomaton::new_from_json(&input_automaton);

    let return_path = test_dfa.validate_string(input_string, true);
    
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
