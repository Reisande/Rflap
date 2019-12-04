extern crate rocket;
extern crate rocket_contrib;
extern crate rand;

use rand::Rng;

use serde_json::json;
use serde::{Deserialize, Serialize, Serializer};
use serde_json::Result;

use std::convert::TryInto;
use std::collections::*;

use rocket_contrib::json::Json;
use rocket::request::{self, Request, FromRequest};
use rocket::data::{self, FromDataSimple};

#[derive(Debug, Serialize, Deserialize)]
pub struct DeterministicFiniteAutomatonJson {
	alphabet : HashSet<char>,
	start_state : String,
    states : HashMap<String, bool>,
	transition_function : Vec<(String, Option<char>, String)>,
	determinism : bool,
	input_string : String
}

impl DeterministicFiniteAutomatonJson {
	pub fn new(origin : &DeterministicFiniteAutomaton, input_string_arg : &String) -> DeterministicFiniteAutomatonJson {
		let new_transition_function : Vec<(String, Option<char>, String)> =
			origin.transition_function
			.iter()
			.map(|((a, b), c)| (a.to_owned(), b.to_owned(), c.to_owned()))
			.collect();

		DeterministicFiniteAutomatonJson {
			alphabet : origin.alphabet.to_owned(), start_state : origin.start_state.to_owned(),
			states : origin.states.to_owned(), transition_function : new_transition_function,
			determinism : origin.determinism.to_owned(), input_string : input_string_arg.to_owned()
		}
	}
}

#[derive(Debug)]
pub struct DeterministicFiniteAutomaton {
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
	transition_function : HashMap<(String, Option<char>), String>,
	determinism : bool
}

impl DeterministicFiniteAutomaton {
	pub fn new(a_alphabet : HashSet<char>, a_start_state : String,
			   a_new_states : HashMap<String, bool>,
			   a_transitions : HashMap<(String, Option<char>), String>)
			   -> DeterministicFiniteAutomaton {		
		// should probably add a check for validity of automaton, or maybe it
		// should be done client side
		DeterministicFiniteAutomaton {
			alphabet : a_alphabet, start_state : a_start_state,
			states : a_new_states, transition_function : a_transitions,
			determinism : true
		}
	}

	pub fn new_from_json(json_struct : &DeterministicFiniteAutomatonJson) -> (DeterministicFiniteAutomaton, String) {
		let mut new_transition_function : HashMap<(String, Option<char>), String> =
			HashMap::new();

		for element in json_struct.transition_function.iter() {
			new_transition_function
				.insert(((element.0).to_owned(), (element.1).to_owned()),
						(element.2).to_owned());
		}

		(DeterministicFiniteAutomaton {
			alphabet : json_struct.alphabet.to_owned(),
			start_state : json_struct.start_state.to_owned(),
			states : json_struct.states.to_owned(),
			transition_function : new_transition_function,
			determinism : json_struct.determinism.to_owned()
		},
		 json_struct.input_string.to_owned())
	}
	
	pub fn set_new_alphabet(&mut self, new_alphabet : HashSet<char>) {
		self.alphabet = new_alphabet;
	}
	
	pub fn insert_char_in_alphabet(&mut self, new_char : char) {
		self.alphabet.insert(new_char);
	}

	pub fn delete_char_in_alphabet(&mut self, new_char : char) {
		self.alphabet.remove(&new_char);
	}
	
	fn change_start(&mut self, new_start : &String) -> bool {
		// checking to see that the new start is an existing state
		let should_change = match self.states.get(&new_start.to_owned()) {
			None => false,
			Some(_) => true
		};

		if should_change {
			self.start_state = new_start.to_owned();
			true
		}
		else {
			false
		}
	}
	
	pub fn insert_empty_state(&mut self, state_name : &String, is_final : bool,
							  is_start : bool) -> bool {
		if self.states.get(&state_name.to_owned()) == None {
			println!("Inserting New State: {:?}: ",
					 self.states.insert(state_name.to_owned(), is_final));
			if is_start {
				self.change_start(state_name);
			}
			true
		}
		else {
			println!("State already exists, call delete() before replacing");
			false
		}
	}

	pub fn insert_transition(&mut self, state_name : &String,
							 new_transition : &(Option<char>, String),
							 deterministic_insert : bool) {
		// checks to see if the read symbol is either an epsilon or inside
		// of the alphabet if not in the alphabet rejects that specific
		// insertion

		// if an empty symbol/an epsilon is ever inserted, we immediately
		// lose determinism

		// the first bool shows if the new state should be inserted, the
		// second if it is deterministic.

		// insertion occurs if the following checks are made:
		// the transition character is in the alphabet, both states exist,
		// and the insert is either intended to be non-deterministic or the insert is unique
		let should_insert : (bool, bool) = match &new_transition.0 {
			Some(symbol) => (self.alphabet.contains(&symbol) &&
							 self.states.contains_key(&(new_transition.1).to_owned()) &&
							 self.states.contains_key(state_name) &&
							 (!deterministic_insert ||
							  self.transition_function
							  .get(&(state_name.to_owned(), new_transition.0)) == None),
							 true),
			None => (true, false)
		};

		if should_insert.0 {
			self.transition_function.insert(((&state_name).to_string(), new_transition.0),
											(&new_transition.1).to_owned());
			self.check_determinism();
		}
		else {
			println!("Tried to incorrectly insert {:?}, {:?}", state_name, new_transition);
			println!("{:?}, {:?} is either a copy of an existing value, or previous delete failed",
					 state_name, new_transition);
		}		
	}

	pub fn delete_transition(&mut self, transition : &(String, Option<char>))
							 -> bool {
		let return_val : bool = match self.transition_function.remove(transition) {
			Some(_) => true,
			None => false
		};

		self.check_determinism();

		return_val
	}
	
	pub fn insert_new_state(&mut self, state_name : &String, is_final : bool, 
							transitions : HashSet<(Option<char>, String)>,
							is_start : bool, deterministic_insert : bool) {
		if self.insert_empty_state(&state_name.to_owned(), is_final, is_start) {
			for i in transitions.iter() {
				self.insert_transition(state_name, i, deterministic_insert);
			}
		}
	}
	
	pub fn delete_state(&mut self, state_name : &String) -> bool {
		// start by checking to see that the state exists
		let state_exists = match self.states.get(&state_name.to_owned()) {
			None => false,
			Some(_) => true	
        };

		if state_exists {
			// delete state from the states HashSet
			self.states.remove(state_name);

			// find and delete all transitions to and from the state in the
			// transitions HashMap
			self.transition_function.retain
				(|k, v| k.0 != state_name.to_owned() && v != state_name);
			
			true
		}
		else {
			println!("Tried to delete nonexistant state: {:?}", state_name);
			false
		}
	}

	// returns a path of transitions and states, beginning with the start state
	// and ending with a final state if the automaton accepts the string. If
	// the automaton rejects the string returns None. Maybe this should
	// be changed to a Result, though

	// this function assumes that the validation that the string is valid for the
	// alphabet occurs on the client side
	pub fn validate_string(&mut self, validate_string : String)
						   -> (bool, Option<Vec<(char, String)>>) {
		self.check_determinism();

		if self.determinism {
			let mut return_vec : Vec<(char, String)> = [('_', (&self.start_state).to_owned())].to_vec();

			// iterate through the given string, moving from state to state, until
			// the string is empty and the end state is reached or not reached
			for symbol in validate_string.chars() {
				// the current state is the one at the end of the return vec

				let current_state : String = match return_vec.last() {
					Some((_, state)) => state.to_owned(),
					None => "".to_owned()
				};

				let next_state : String =
					match self.transition_function.get(&(current_state, Some(symbol))) {
						Some(new_state) => new_state.to_owned(),
						None => "".to_owned()
					};
				
				return_vec.push((symbol, next_state));
			}

			// check to see that the last state pushed is an accepting state
			let accepted_string : bool = match return_vec.last() {
				Some((_, state)) => match self.states.get(state) {
					Some(return_bool) => *return_bool,
					None => false
				},
				None => false
			};

			(accepted_string, Some(return_vec))
		}
		else {			
			(false, None)
		}
	}

	pub fn validate_string_json(&mut self, validate_string : String) -> Result<String> {
		serde_json::to_string_pretty(&self.validate_string(validate_string))
	}
	
	fn check_determinism(&mut self) -> bool {
		for (state, _) in &self.states {
			for transition in &self.alphabet {
				let return_val : bool =
					self.transition_function.contains_key(
						&(state.to_owned(), Some(*transition)));
				
				if ! return_val {
					println!("{} {} ", state, transition);
					
					self.determinism = false;
					return false;
				}								   
			}
		}

		self.determinism = true;

		self.determinism
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
		serde_json::to_string_pretty(&DeterministicFiniteAutomatonJson::new(self, &"".to_string()))
	} 
	
	fn deserialize_json(self, input_json : serde_json::Value) -> Option<DeterministicFiniteAutomaton> {
		let json_struct_string : String =
			serde_json::to_string(&input_json).unwrap();
		let json_struct : Result<DeterministicFiniteAutomatonJson> =
			serde_json::from_str(&json_struct_string);

		match json_struct {
			Ok(val) => Some(DeterministicFiniteAutomaton::new_from_json(&val).0),
			Err(_) => None
		}
	}
	
	/*
    fn serialize_xml() -> () { }
	
    fn deserialize_xml() -> () { }
	*/
}
