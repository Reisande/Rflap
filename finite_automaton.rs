use std::collections::*;

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
	fn new(a_alphabet : HashSet<char>,
		   a_start_state : String, a_new_states : HashMap<String, bool>,
		   a_transitions : HashMap<(String, Option<char>), String>)
		   -> FiniteAutomaton {
		FiniteAutomaton { alphabet : a_alphabet, start_state : a_start_state,
						  states : a_new_states, transition_function : a_transitions,
						  determinism : true }
	}

	fn insert_state(&mut self, state_name : &String, is_final : bool, 
					transitions : HashSet<(Option<char>, String)>) {
		if self.states.get(state_name.to_string()) == None {
			println!("Inserting {:?}: ",
					 self.states.insert(state_name.to_string(), is_final));
		}
		else {
			println!("State already exists, delete before replacing");
		}
		
		for i in transitions.iter() {
			// checks to see if the read symbol is either an epsilon or inside
			// of the alphabet if not in the alphabet rejects that specific
			// insertion

			// if an empty symbol/an epsilon is ever inserted, we immediately
			// lose determinism

			// the first bool shows if the new state should be inserted, the
			// second if it is deterministic. 
			let should_insert : (bool, bool) = match &i.0 {
				Some(symbol) => (! self.alphabet.contains(&symbol), true),
				None => (true, false)
			};

			if should_insert.0 {
				self.determinism = self.determinism && should_insert.1;
				self.transition_function.insert((state_name.to_string(), i.0),
												(&i.1).to_string());
			}
			else {
				println!("Tried to incorrectly insert {:?}", i);
				println!("{:?} is either a copy of an exisitng value, or delete failed", i);
			}
		}
	}

	fn delete_state(&mut self, state_name : String) -> () {
		// delete state from the states HashSet
		
		// find and delete all transitions to and from the state in the
		// transitions HashMap
		
	}

	fn insert_transition(&mut self) -> () {
		// should be the same code as in the add state method, should probably 
		// change that to add a call to this method tbh
		
	}

	fn change_start(&mut self) -> () {

	}
	
	fn serialize_xml() -> () { }

	fn deserialize_xml() -> () { }

	fn serialize_json() -> () { }

	fn deserialize_json() -> () { }
	
	fn check_determinism() -> () { }

	fn validate_string() -> () { }

	fn trace_string() -> () { }

	fn generate_tests() -> () { }
	
}
