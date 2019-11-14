struct Pda {
	// PDAs can be defined as a 6-tuple: Stack language, Input language, a set
	// of states, a transition function, a start state, and a set of accepting
	// states. Also, behind the scenes, is a a stack the machine controls
	stack : std::vec::Vec<String>,
	stack_language : std::vec::Vec<String>,
	input_language : std::vec::Vec<String>,
	start : String,
	final_states : std::vec::Vec<String>,
	// the transition function is defined as a hashmap from an original state, to
	// another hashmap which accepts a pair of strings, a read string and a pop symbol,
	// and returns a new state and a push symbol
	transition_function : std::collections::HashMap
		<String, std::collections::HashMap<(String, String), (String, String)>>
}

impl Pda {

}
		 
