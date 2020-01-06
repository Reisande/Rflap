extern crate rocket;
extern crate rocket_contrib;
extern crate rand;
extern crate multimap;

use rand::Rng;

use serde::{Deserialize, Serialize};
use serde_json::Result;

use std::convert::TryInto;
use std::collections::*;

use multimap::MultiMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct FiniteAutomatonJson {
    alphabet : HashSet<char>,
    start_state : String,
    states : HashMap<String, bool>,
    transition_function : Vec<(String, Option<char>, String)>,
    determinism : bool,
    input_string : String
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
    transition_function : MultiMap<(String, Option<char>), String>,
    determinism : bool
}

impl FiniteAutomaton {
    pub fn new(a_alphabet : HashSet<char>, a_start_state : String,
	       a_new_states : HashMap<String, bool>,
	       a_transitions : MultiMap<(String, Option<char>), String>)
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
	let mut new_transition_function : MultiMap<(String, Option<char>), String> =
	    MultiMap::new();

	for element in json_struct.transition_function.iter() {
	    new_transition_function
		.insert((element.0.to_owned(), element.1.to_owned()),
			element.2.to_owned());
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

    // convert the original string by using string.chars().collect()
    pub fn validate_string_nfa(&self, validate_string : &Vec<char>, position : usize,
			       mut current_path : Vec<(char, String)>, current_state : String)
			       -> Option<Vec<(char, String)>> {
	if position == validate_string.len() {
	    let is_final : bool = match self.states.get(&current_state) {
		Some(b) => *b,
		None => false
	    }; 
	    if is_final {
		Some(current_path.to_vec())
	    }
	    else {
		// after the current symbol has been checked should check for epsilon transitions
		let target_vec_epsilon_transitions =
		    match self.transition_function.get_vec(&(current_state.to_owned(), None)) {
			Some(v) => v.to_owned(),
			None => Vec::new(),
		    };

		// check for epsilon transitions here
		current_path.push(('Ɛ'.to_owned(), current_state.to_owned()));
		for target_state in target_vec_epsilon_transitions {
		    match self.validate_string_nfa(validate_string, position, current_path.to_owned(), target_state) {
			Some(r) => return Some(r),
			None => continue,
		    };
		}
		
		
		None
	    }
	}
	else {
	    let search_tuple = (current_state.to_owned(), Some(validate_string[position]));
	    let target_states_vec =
		match self.transition_function.get_vec(&search_tuple.to_owned()) {
		    Some(v) => v.to_owned(),
		    None => Vec::new(),
		};

	    for target_state in target_states_vec {
		current_path.to_owned()
		    .push((validate_string[position], current_state.to_owned()));
		match
		    self.validate_string_nfa(
			validate_string, position + 1, current_path.to_owned(),
			(*target_state).to_owned()) {
			Some(r) => return Some(r),
			None => current_path.pop(),
		    };
	    }
	    	    
	    // after the current symbol has been checked should check for epsilon transitions
	    let target_vec_epsilon_transitions =
		match self.transition_function.get_vec(&(current_state.to_owned(), None)) {
		    Some(v) => v.to_owned(),
		    None => Vec::new(),
		};

	    current_path.push(('Ɛ'.to_owned(), current_state));
	    for target_state in target_vec_epsilon_transitions {
		match self.
		    validate_string_nfa(validate_string, position, current_path.to_owned(), target_state) {
			Some(r) => return Some(r),
			None => continue,
		    };
	    }
	    current_path.pop();
	    
	    
	    None
	}
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

		    let next_state =
			match self.transition_function.get(&(current_state, Some(symbol))) {
			    Some(s) => s.to_owned(),
			    None => "".to_owned()
			};

		    if next_state != "".to_owned() {
			return_vec.push((symbol, next_state.to_owned()));
		    }		    
		}
		
		(self.determinism, Some(return_vec))		    
	    }
	    else {
		// should probably change return type to Result<> rather than just a tuple
		(false, None) 
	    }
	}
	else {
	    let validate_vec : Vec<char> = validate_string.chars().collect();
	    let return_vec =
		self.validate_string_nfa(&validate_vec, 0, return_vec, self.start_state.to_owned());

	    (false, return_vec)
	}
    }

    pub fn validate_string_json(&mut self, validate_string : String,
				should_be_deterministic : bool) -> Result<String> {
	serde_json::to_string_pretty(&self.validate_string(validate_string, should_be_deterministic))
    }
    
    fn check_determinism(&mut self) {
	let mut determinism_check : bool = true;
	for (source_state, _) in &self.states {
	    //checks to make sure that there are no epsilon transitions
	    determinism_check &=
		self.transition_function.get(&(source_state.to_owned(), None)) == None;

	    // checks to make sure that there is exactly one target state for each
	    // transition character
	    for transition in &self.alphabet {
		let check_vec =
		    self.transition_function.get_vec(
			&(source_state.to_owned(), Some(transition.to_owned()))).to_owned();
		determinism_check &= match check_vec {
		    Some(v) => (v.len() == 1),
		    None => false,
		};

		// makes this check to break out early from the loop in order to not
		// waste time
		if ! determinism_check {
		    self.determinism = determinism_check;
		    return;
		}
	    }
	}

	self.determinism = determinism_check;
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
    /* pub fn serialize_json(&self) -> Result<String> {
	serde_json::to_string_pretty(&FiniteAutomatonJson::new(self, &"".to_string()))
    } */
    
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
