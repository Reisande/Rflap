use std::collections::*;

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
	transition_function : HashMap<(String, Option<char>), String>,
	determinism : bool
}

impl FiniteAutomaton {
	pub fn new(a_alphabet : HashSet<char>,
			   a_start_state : String, a_new_states : HashMap<String, bool>,
			   a_transitions : HashMap<(String, Option<char>), String>)
			   -> FiniteAutomaton {
		FiniteAutomaton { alphabet : a_alphabet, start_state : a_start_state,
						  states : a_new_states, transition_function : a_transitions,
						  determinism : true }
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
		let should_change = match self.states.get(&new_start.to_string()) {
			None => false,
			Some(_) => true
		};

		if should_change {
			self.start_state = new_start.to_string();
			true
		}
		else {
			false
		}
	}
	
	pub fn insert_empty_state(&mut self, state_name : &String, is_final : bool,
							  is_start : bool) -> bool {
		if self.states.get(&state_name.to_string()) == None {
			println!("Inserting New State: {:?}: ",
					 self.states.insert(state_name.to_string(), is_final));
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
							 new_transition : &(Option<char>, String)) {
		// checks to see if the read symbol is either an epsilon or inside
		// of the alphabet if not in the alphabet rejects that specific
		// insertion

		// if an empty symbol/an epsilon is ever inserted, we immediately
		// lose determinism

		// the first bool shows if the new state should be inserted, the
		// second if it is deterministic.

		// should also check to see that the end of the transition string exists
		// as well
		let should_insert : (bool, bool) = match &new_transition.0 {
			Some(symbol) => (! (self.alphabet.contains(&symbol) ||
								self.states.contains_key(&(new_transition.1).to_string())),
							 true),
			None => (true, false)
		};

		if should_insert.0 {
			self.determinism = self.determinism && should_insert.1;
			self.transition_function.insert(((&state_name).to_string(), new_transition.0),
											(&new_transition.1).to_string());
		}
		else {
			println!("Tried to incorrectly insert {:?}", state_name);
			println!("{:?} is either a copy of an existing value, or previous delete failed",
					 state_name);
		}		
	}
	
	pub fn insert_new_state(&mut self, state_name : &String, is_final : bool, 
							transitions : HashSet<(Option<char>, String)>,
							is_start : bool) {
		if self.insert_empty_state(&state_name.to_string(), is_final, is_start) {
			for i in transitions.iter() {
				self.insert_transition(state_name, i);
			}
		}
	}
	
	pub fn delete_state(&mut self, state_name : &String) -> bool {
		// start by checking to see that the state exists
		let state_exists = match self.states.get(&state_name.to_string()) {
			None => false,
			Some(_) => true	
        };

		if state_exists {
			// delete state from the states HashSet
			self.states.remove(state_name);

			// find and delete all transitions to and from the state in the
			// transitions HashMap
			self.transition_function.retain
				(|k, v| k.0 != state_name.to_string() && v != state_name);
			
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
	fn validate_string(self, validate_string : String) -> Option<Vec<(char, String)>> {
		if self.determinism {
			let mut return_vec : Vec<(char, String)> = [('_', self.start_state)].to_vec();

			// iterate through the given string, moving from state to state, until
			// the string is empty and the end state is reached or not reached
			for symbol in validate_string.chars() {
				// the current state is the one at the end of the return vec

				// 	transition_function : HashMap<(String, Option<char>), String>,

				let current_state : String = match return_vec.last() {
					Some((_, state)) => state.to_string(),
					None => "".to_string()
				};

				let next_state : String =
					match self.transition_function.get(&(current_state, Some(symbol))) {
						Some(new_state) => new_state.to_string(),
						None => "".to_string()
					};
													   
				return_vec.push((symbol, next_state));
			}

			// check to see that the last state pushed is an accepting state
			let accepted_string : bool = match return_vec.last() {
				Some((_, state)) => match self.states.get(state) {
					Some(return_bool) => true,
					None => false
				},
				None => false
			};

			if accepted_string {
				Some(return_vec)
			}
			else {
				None
			}
		}
		else {
			None
		}
	}
	
	fn check_determinism(self) -> bool {
		if self.determinism {
			for i in self.transition_function.iter() {
				
			}

			true
		}
		else {
			false
		}
	}
	
	/*
	fn trace_string() -> () { }

	fn serialize_json() -> () { }

	fn deserialize_json() -> () { }	
	
	fn serialize_xml() -> () { }

	fn deserialize_xml() -> () { }
	
	fn generate_tests() -> () { }*/
	
}
