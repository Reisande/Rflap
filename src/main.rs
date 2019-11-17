mod finite_automaton;
//mod reg_exp;
//mod cfg;
//mod pda;
//mod tm;

use std::collections::HashSet;
use std::collections::HashMap;

fn main() {
	// start out with a test DFA, which recognizes the language of only a* out
	// of the alphabet a,b,c
	
	let mut a_alphabet : HashSet<char> = HashSet::new();
	a_alphabet.insert('a');
	a_alphabet.insert('b');
	
	let a_start_state : String = "q_0".to_owned();

	let mut a_new_states : HashMap<String, bool> = HashMap::new();
	a_new_states.insert("q_0".to_owned(), true);
	a_new_states.insert("q_1".to_owned(), false);
	
	let mut a_transitions : HashMap<(String, Option<char>), String> = HashMap::new();

	a_transitions.insert(("q_0".to_owned(), Some('a')), "q_0".to_owned());
	a_transitions.insert(("q_0".to_owned(), Some('b')), "q_1".to_owned());
	a_transitions.insert(("q_1".to_owned(), Some('a')), "q_1".to_owned());
	a_transitions.insert(("q_1".to_owned(), Some('b')), "q_1".to_owned());	

	let mut test_dfa : finite_automaton::FiniteAutomaton =
		finite_automaton::FiniteAutomaton::new(a_alphabet, a_start_state, a_new_states, a_transitions);
	
    println!("\n{:#?}", test_dfa);
	//println!("\n{:?}", test_dfa.generate_tests(1, 8, true, 8, true));

	// lets check some hand written sample strings
	println!("'' : {:?} \na: {:?} \naa: {:?} \nab: {:?}",
			 test_dfa.validate_string("".to_string()),
			 test_dfa.validate_string("a".to_string()),
			 test_dfa.validate_string("aa".to_string()),
			 test_dfa.validate_string("ab".to_string()));
	
	// now let's change it to accept only the strings which have an ending character of 'a'
	
	println!("Transition deletion: {:?}, {:?}",
			 test_dfa.delete_transition(
				 &("q_1".to_owned(), Some('a'))),("q_1".to_owned(), Some('a')));
	//println!("\n{:#?}", test_dfa);
	
	test_dfa.insert_transition(&"q_1".to_owned(), &(Some('a'), "q_0".to_owned()), true);
	println!("\n{:#?}", test_dfa);

	// lets check some hand written sample strings
	println!("a: {:?} \naa: {:?} \nab: {:?}",
			 test_dfa.validate_string("a".to_string()),
			 test_dfa.validate_string("aa".to_string()),
			 test_dfa.validate_string("ab".to_string()));
	
}
