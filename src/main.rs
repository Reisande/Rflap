mod finite_automaton;
//mod reg_exp;
//mod cfg;
//mod pda;
//mod tm;

use std::collections::HashSet;
use std::collections::HashMap;

fn main() {
	// start out with a test DFA, which recognizes the language of only a's(including empty string)
	// out of the alphabet a,b,c
	
	let mut a_alphabet : HashSet<char> = HashSet::new();
	a_alphabet.insert('a');
	a_alphabet.insert('b');
	a_alphabet.insert('c');
	
	let a_start_state : String = "q_0".to_string();

	let mut a_new_states : HashMap<String, bool> = HashMap::new();
	a_new_states.insert("q_0".to_string(), true);
	a_new_states.insert("q_1".to_string(), false);
	a_new_states.insert("q_accept".to_string(), false);
	
	let mut a_transitions : HashMap<(String, Option<char>), String> = HashMap::new();

	a_transitions.insert(("q_0".to_string(), Some('a')), "q_accept".to_string());
	a_transitions.insert(("q_0".to_string(), Some('b')), "q_1".to_string());
	a_transitions.insert(("q_0".to_string(), Some('c')), "q_1".to_string());

	let test_dfa : finite_automaton::FiniteAutomaton =
		finite_automaton::FiniteAutomaton::new(a_alphabet, a_start_state, a_new_states, a_transitions);
	
    println!("\n{:?}", test_dfa);
}
