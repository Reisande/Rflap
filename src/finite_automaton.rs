extern crate rocket;
extern crate rocket_contrib;
extern crate rand;

use rand::Rng;

use serde::{Deserialize, Serialize};
use serde_json::Result;

use std::convert::TryInto;
use std::collections::*;

#[derive(Debug, Serialize, Deserialize)]
pub struct FiniteAutomatonJson {
    alphabet : HashSet<char>,
    start_state : String,
    states : HashMap<String, bool>,
    transition_function : Vec<(String, Option<char>, String)>,
    determinism : bool,
    input_string : String
}

impl FiniteAutomatonJson {
    pub fn new(origin : &FiniteAutomaton, input_string_arg : &String) -> FiniteAutomatonJson {
	let new_transition_function : Vec<(String, Option<char>, String)> =
	    origin.transition_function
	    .iter()
	    .map(|x| x.to_owned())
	    .collect();

	FiniteAutomatonJson {
	    alphabet : origin.alphabet.to_owned(), start_state : origin.start_state.to_owned(),
	    states : origin.states.to_owned(), transition_function : new_transition_function,
	    determinism : origin.determinism.to_owned(), input_string : input_string_arg.to_owned()
	}
    }
}

#[derive(Debug)]
pub struct FiniteAutomaton {
    // automata are defined as a 5 tuple of states, alphabet, transition function,
    // final, and start state
    alphabet : HashSet<char>,
    start_state : String,
    // states are defined as a map from strings to bools, which determine if
    // they are accepting states 
    states : HashMap<String, bool>,
    // transition function is a hashMap from the current state, to a hashmap
    // representing all of the transitions for the current state
    // the transition of a current state is a letter and a next state
    transition_function : HashSet<(String, Option<char>, String)>,
    determinism : bool
}

impl FiniteAutomaton {
    pub fn new(a_alphabet : HashSet<char>, a_start_state : String,
	       a_new_states : HashMap<String, bool>,
	       a_transitions : HashSet<(String, Option<char>, String)>)
	       -> FiniteAutomaton {		
	// should probably add a check for validity of automaton, or maybe it
	// should be done client side
	FiniteAutomaton {
	    alphabet : a_alphabet, start_state : a_start_state,
	    states : a_new_states, transition_function : a_transitions,
	    determinism : true
	}
    }

    pub fn new_from_json(json_struct : &FiniteAutomatonJson) -> (FiniteAutomaton, String) {
	let mut new_transition_function : HashSet<(String, Option<char>, String)> =
	    HashSet::new();

	for element in json_struct.transition_function.iter() {
	    new_transition_function.insert(element.to_owned());
	}

	let mut return_finite_automaton = FiniteAutomaton {
	    alphabet : json_struct.alphabet.to_owned(),
	    start_state : json_struct.start_state.to_owned(),
	    states : json_struct.states.to_owned(),
	    transition_function : new_transition_function,
	    determinism : json_struct.determinism.to_owned()
	};

	return_finite_automaton.check_determinism();
	    
	(return_finite_automaton, json_struct.input_string.to_owned())
    }
        
    // returns a path of transitions and states, beginning with the start state
    // and ending with a final state if the automaton accepts the string. If
    // the automaton rejects the string returns None. Maybe this should
    // be changed to a Result, though

    // this function assumes that the validation that the string is valid for the
    // alphabet occurs on the client side
    pub fn validate_string(&mut self, validate_string : String, should_be_deterministic : bool)
			   -> (bool, Option<Vec<(char, String)>>) {
	let mut return_vec : Vec<(char, String)> = [('_', (&self.start_state).to_owned())].to_vec();
	
	if should_be_deterministic {
	    self.check_determinism();

	    if self.determinism {
		// iterate through the given string, moving from state to state, until
		// the string is empty and the end state is reached or not reached
		for symbol in validate_string.chars() {
		    // the current state is the one at the end of the return vec

		    let current_state : String = match return_vec.last() {
			Some((_, state)) => state.to_owned(),
			None => "".to_owned()
		    };

		    for (state, _) in &self.states {
			let check_triple =
			    (current_state.to_owned(), Some(symbol.to_owned()),
			     state.to_owned()); 

			if self.transition_function.contains(&check_triple) {
			    return_vec.push((symbol, state.to_owned()));
			    break;
			}    
		    }
		    
		    self.check_determinism();
		}
		
		(self.determinism, Some(return_vec))
	    }
	    else {
		// should probably change return type to Result<> rather than just a tuple
		(false, None) 
	    }
	}
	else {
	    // non deterministic checking function. I guess I should this recursively?
	    (false, None) // placeholder for now
	}
    }

    pub fn validate_string_json(&mut self, validate_string : String,
				should_be_deterministic : bool) -> Result<String> {
	serde_json::to_string_pretty(&self.validate_string(validate_string, should_be_deterministic))
    }
    
    fn check_determinism(&mut self) {
	for (source_state, _) in &self.states {
	    let mut matching_transitions_count : u32 = 0;

	    for transition in &self.alphabet {
		for target_state in &self.states {
		    if self.transition_function.contains(&(
			source_state.to_owned(), Some(*transition),
			target_state.0.to_owned())) {
			matching_transitions_count += 1;
		    }
		    
		    if matching_transitions_count != 1 || matching_transitions_count != 0 {
			println!("{} {} ", source_state, transition);
			
			self.determinism = false;
			return;
		    }								   
		}
		if matching_transitions_count != 1 {
		    println!("{} {} ", source_state, transition);
		    
		    self.determinism = false;
		    return;
		}
	    }
	}

	self.determinism = true;
    }

    pub fn generate_tests(self, min_length : u8, max_length : u8, include_empty : bool,
			  size : u8, random : bool)
			  -> Vec<String> {
	assert!(min_length <= max_length);
	
	let mut return_vec : Vec<String> = [].to_vec();

	if include_empty {
	    return_vec.push("".to_string());
	}
	
	let alphabet_vec : Vec<char> = self.alphabet.iter().cloned().collect();

	if random {
	    while return_vec.len() < size.try_into().unwrap() {
		let mut rng = rand::thread_rng();

		let string_length : u8 = rng.gen_range(min_length, max_length);

		let new_test_string : String = (0..string_length)
		    .map(|_| {
			let idx : usize =
			    rng.gen_range(0, alphabet_vec.len()).try_into().unwrap();
			alphabet_vec[idx] as char
		    })
		    .collect();

		return_vec.push(new_test_string);
	    }
	}
	else {
	    // implement trie and flattening
	}

	return_vec
    }

    // should probably write a separate api for verifying strings
    pub fn serialize_json(&self) -> Result<String> {
	serde_json::to_string_pretty(&FiniteAutomatonJson::new(self, &"".to_string()))
    } 
    
    fn deserialize_json(self, input_json : serde_json::Value) -> Option<FiniteAutomaton> {
	let json_struct_string : String =
	    serde_json::to_string(&input_json).unwrap();
	let json_struct : Result<FiniteAutomatonJson> =
	    serde_json::from_str(&json_struct_string);

	match json_struct {
	    Ok(val) => Some(FiniteAutomaton::new_from_json(&val).0),
	    Err(_) => None
	}
    }
    
    /*
    fn serialize_xml() -> () { }
    
    fn deserialize_xml() -> () { }
     */
}
