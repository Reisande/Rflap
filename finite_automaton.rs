pub struct FiniteAutomaton {
	// automata are defined as a 5 tuple of states, alphabet, transition function,
	// final, and start state

	// states are defined as a map from strings to bools, which determine if
	// they are accepting states
    states : std::collections::HashMap<String, bool>,
	// transition function is a hashMap from the current state, to a hashmap
	// representing all of the transitions for the current state
	// the transition of a current state is a letter and a next state
	transition_function : std::collections::HashMap<String, std::collections::HashMap<String, String>>,
	// an alphabet is just a collection of strings
	alphabet : std::vec::Vec<String>,
	start_state : String
}

impl FiniteAutomaton {
	
}
