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
	println!("a: {:?} \naa: {:?} \nab: {:?} \naba: {:?}",
			 test_dfa.validate_string("a".to_string()),
			 test_dfa.validate_string("aa".to_string()),
			 test_dfa.validate_string("ab".to_string()),
			 test_dfa.validate_string("aba".to_string()));

	println!("{:?}", test_dfa.serialize_json());
	
	/*let json_serialization = match test_dfa.serialize_json() {
		Ok(v) => v,
		_ => "".to_string()
	};

	println!("{:#?}", json_serialization);*/
	
	/*println!("alphabet: {:?}\nstart_state: {:?}\nstates: {:?}\ntranstion_function: {:?}\ndeterminism{:?}",
			 json_serialization["alphabet"].to_owned(),
			 json_serialization["start_state"].to_owned(),
			 json_serialization["states"].to_owned(),
			 json_serialization["transition_function"].to_owned(),
			 json_serialization["determinism"].to_owned(),
);*/

	/*println!("{{\n  \"alphabet\": [\n    \"a\",\n    \"b\"\n  ],\n  \"start_state\": \"q_0\",\n  \"states\": {{\n    \"q_1\": false,\n    \"q_0\": true\n  }},\n  \"transition_function\": [\n    [\n      \"q_0\",\n      \"a\",\n      \"q_0\"\n    ],\n    [\n      \"q_1\",\n      \"a\",\n      \"q_0\"\n    ],\n    [\n      \"q_1\",\n      \"b\",\n      \"q_1\"\n    ],\n    [\n      \"q_0\",\n      \"b\",\n      \"q_1\"\n    ]\n  ],\n  \"determinism\": true\n}}");*/

}
