use std::vec::Vec;
use std::collections::*;

struct Pda {
	// PDAs can be defined as a 6-tuple: Stack language, Input language, a set
	// of states, a transition function, a start state, and a set of accepting
	// states. Also, behind the scenes, is a a stack the machine controls
	stack : <String>,
	stack_language : <String>,
	input_language : <String>,
	start : String,
	final_states : <String>,
	// the transition function is defined as a hashmap from an original state, to
	// another hashmap which accepts a pair of strings, a read string and a pop symbol,
	// and returns a new state and a push symbol
	transition_function : HashMap
		<String, HashMap<(String, String), (String, String)>>
}


impl Pda {

}
		 
