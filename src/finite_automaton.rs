extern crate multimap;
extern crate rand;
extern crate rocket;
extern crate rocket_contrib;

use serde::{Deserialize, Serialize};
use serde_json::Result;

use multimap::MultiMap;

use std::assert;
use std::collections::*;

#[derive(Debug, Serialize, Deserialize)]
pub struct FiniteAutomatonJson {
    alphabet: HashSet<char>,
    start_state: String,
    states: HashMap<String, bool>,
    transition_function: Vec<(String, Option<char>, String)>,
    input_strings: Vec<String>, // we need to update the api so that it passes a vec
                                // of strings, and the post returns a vec of bools
}

#[derive(Debug)]
pub struct FiniteAutomaton {
    // automata are defined as a 5 tuple of states, alphabet, transition function,
    // final, and start state
    alphabet: HashSet<char>,
    start_state: String,
    // states are defined as a map from strings to bools, which determine if
    // they are accepting states
    states: HashMap<String, bool>,
    // transition function is a hashMap from the current state, to a hashmap
    // representing all of the transitions for the current state
    // the transition of a current state is a letter and a next state
    transition_function: MultiMap<(String, Option<char>), String>,
    is_deterministic: bool,
}

impl FiniteAutomaton {
    pub fn new(
        a_alphabet: HashSet<char>,
        a_start_state: String,
        a_new_states: HashMap<String, bool>,
        a_transitions: MultiMap<(String, Option<char>), String>,
        a_is_deterministic: bool,
    ) -> FiniteAutomaton {
        // should probably add a check for validity of automaton, or maybe it
        // should be done client side
        FiniteAutomaton {
            alphabet: a_alphabet,
            start_state: a_start_state,
            states: a_new_states,
            transition_function: a_transitions,
            is_deterministic: a_is_deterministic,
        }
    }

    pub fn new_from_json(
        json_struct: &FiniteAutomatonJson,
    ) -> (FiniteAutomaton, Vec<String>, String) {
        let mut new_transition_function: MultiMap<(String, Option<char>), String> = MultiMap::new();

        for element in json_struct.transition_function.iter() {
            new_transition_function.insert(
                (element.0.to_owned(), element.1.to_owned()),
                element.2.to_owned(),
            );
        }

        let mut return_finite_automaton = FiniteAutomaton {
            alphabet: json_struct.alphabet.to_owned(),
            start_state: json_struct.start_state.to_owned(),
            states: json_struct.states.to_owned(),
            transition_function: new_transition_function,
            // doesn't really matter what this determinsitic field is as it will
            // be set in check_is_deterministic()
            is_deterministic: true,
        };

        let hint: String = return_finite_automaton.check_is_deterministic();

        (
            return_finite_automaton,
            json_struct.input_strings.to_owned(),
            hint,
        )
    }

    // convert the original string by using string.chars().collect()
    fn _validate_string(
        &self,
        validate_string: &Vec<char>,
        position: usize,
        mut current_path: Vec<(char, String)>,
        current_state: String,
        transition_char: char,
    ) -> (bool, Vec<(char, String)>) {
        current_path.push((transition_char, current_state.to_owned()));

        if position == validate_string.len() {
            let is_final: bool = match self.states.get(&current_state) {
                Some(b) => *b,
                None => false,
            };
            if is_final {
                (true, current_path.to_owned())
            } else {
                // after the current symbol has been checked should check for epsilon transitions
                let target_vec_epsilon_transitions = match self
                    .transition_function
                    .get_vec(&(current_state.to_owned(), None))
                {
                    Some(v) => v.to_owned(),
                    None => Vec::new(),
                };

                // check for epsilon transitions here
                for target_state in target_vec_epsilon_transitions {
                    match self._validate_string(
                        validate_string,
                        position,
                        current_path.to_owned(),
                        target_state,
                        'Ɛ'.to_owned(),
                    ) {
                        (true, r) => return (true, r),
                        _ => continue,
                    };
                }

                (false, current_path)
            }
        } else {
            let search_tuple = (current_state.to_owned(), Some(validate_string[position]));
            let target_states_vec = match self.transition_function.get_vec(&search_tuple.to_owned())
            {
                Some(v) => v.to_owned(),
                None => Vec::new(),
            };

            for target_state in target_states_vec {
                match self._validate_string(
                    validate_string,
                    position + 1,
                    current_path.to_owned(),
                    (*target_state).to_owned(),
                    validate_string[position],
                ) {
                    (true, r) => return (true, r),
                    _ => continue,
                };
            }

            // after the current symbol has been checked should check for epsilon transitions
            let target_vec_epsilon_transitions = match self
                .transition_function
                .get_vec(&(current_state.to_owned(), None))
            {
                Some(v) => v.to_owned(),
                None => Vec::new(),
            };

            for target_state in target_vec_epsilon_transitions {
                match self._validate_string(
                    validate_string,
                    position,
                    current_path.to_owned(),
                    target_state,
                    'Ɛ'.to_owned(),
                ) {
                    (true, r) => return (true, r),
                    _ => continue,
                };
            }

            (false, current_path.to_owned())
        }
    }

    // returns a path of transitions and states, beginning with the start state
    // and ending with a final state if the automaton accepts the string. If
    // the automaton rejects the string returns None. Maybe this should
    // be changed to a Result, though

    // this function assumes that the validation that the string is valid for the
    // alphabet occurs on the client side

    // return API dictates: (is_deterministic, accepted, path)
    // string is any possible hint in creation
    pub fn validate_string(
        &self,
        validate_string: String,
    ) -> (bool, bool, Vec<(char, String)>, String) {
        let return_vec: Vec<(char, String)> = Vec::new();

        let validate_vec: Vec<char> = validate_string.chars().collect();
        let (accepted, return_vec) = self._validate_string(
            &validate_vec,
            0,
            return_vec,
            self.start_state.to_owned(),
            '_',
        );

        (
            self.is_deterministic.to_owned(),
            accepted,
            return_vec.to_owned(),
            validate_string,
        )
    }

    pub fn validate_string_json(&self, validate_string: String) -> Result<String> {
        serde_json::to_string_pretty(&self.validate_string(validate_string))
    }

    fn check_is_deterministic(&mut self) -> String {
        let mut is_deterministic_check: bool = true;
        for (source_state, _) in &self.states {
            //checks to make sure that there are no epsilon transitions
            is_deterministic_check &= self
                .transition_function
                .get(&(source_state.to_owned(), None))
                == None;

            if !is_deterministic_check {
                self.is_deterministic = is_deterministic_check;
                return "Make sure no epsilon transitions exist".to_string();
            }

            // checks to make sure that there is exactly one target state for each
            // transition character
            for transition in &self.alphabet {
                let check_vec_length = match self
                    .transition_function
                    .get_vec(&(source_state.to_owned(), Some(transition.to_owned())))
                    .to_owned()
                {
                    Some(v) => v.len(),
                    None => 0,
                };

                is_deterministic_check &= check_vec_length == 1;

                // makes this check to break out early from the loop in order to not
                // waste time
                if !is_deterministic_check {
                    self.is_deterministic = is_deterministic_check;

                    if check_vec_length == 0 {
                        return "Make sure all states have transitions for all states".to_string();
                    } else {
                        // too many inputs
                        return "Make sure each transition only occurs once for each state"
                            .to_string();
                    }
                }
            }
        }

        self.is_deterministic = is_deterministic_check;
        "".to_string()
    }

    fn find_epsilon_closure(&self, start_state: &String, transition: Option<char>) -> Vec<String> {
        let return_vec: &mut Vec<String> = &mut Vec::new();
        if transition != None {
            match self
                .transition_function
                .get_vec(&(start_state.to_owned(), transition))
            {
                Some(v) => {
                    return_vec.append(&mut v.to_owned());
                    for target in &v.to_owned() {
                        return_vec.append(&mut self.find_epsilon_closure(target, None));
                    }
                }
                None => {} // do nothing
            }
        }
        match self
            .transition_function
            .get_vec(&(start_state.to_owned(), None))
        {
            Some(v) => {
                return_vec.append(&mut v.to_owned());
                for target in &v.to_owned() {
                    return_vec.append(&mut self.find_epsilon_closure(target, transition));
                }
            }
            None => {} // do nothing
        }

        return_vec.to_owned()
    }

    pub fn convert_to_dfa(self) -> FiniteAutomaton {
        if self.is_deterministic {
            // if an automaton is a dfa it is trivially a dfa. Should probably
            // minimize this later though
            self
        } else {
            let mut return_automata = FiniteAutomaton::new(
                self.alphabet,
                self.start_state.to_owned(),
                self.states,
                self.transition_function,
                true,
            );
            let mut current_state = self.start_state;

            return_automata
        }
    }
}

#[cfg(test)]
#[test]
pub fn test_dfas() -> () {
    // start out with a test DFA, which recognizes the language of only a* out
    // of the alphabet a,b,c

    let mut a_alphabet: HashSet<char> = HashSet::new();
    a_alphabet.insert('a');
    a_alphabet.insert('b');

    let a_start_state: String = "q_0".to_owned();

    let mut a_new_states: HashMap<String, bool> = HashMap::new();
    a_new_states.insert("q_0".to_owned(), true);
    a_new_states.insert("q_1".to_owned(), false);

    let mut a_transitions: MultiMap<(String, Option<char>), String> = MultiMap::new();

    a_transitions.insert(("q_0".to_owned(), Some('a')), "q_0".to_owned());
    a_transitions.insert(("q_0".to_owned(), Some('b')), "q_1".to_owned());
    a_transitions.insert(("q_1".to_owned(), Some('a')), "q_1".to_owned());
    a_transitions.insert(("q_1".to_owned(), Some('b')), "q_1".to_owned());

    let test_dfa: FiniteAutomaton =
        FiniteAutomaton::new(a_alphabet, a_start_state, a_new_states, a_transitions, true);

    assert_eq!(
        test_dfa.validate_string("".to_string()),
        (
            true,
            true,
            vec![('_'.to_owned(), "q_0".to_owned()),],
            "".to_owned()
        )
    );
    assert_eq!(
        test_dfa.validate_string("a".to_string()),
        (
            true,
            true,
            vec![
                ('_'.to_owned(), "q_0".to_owned()),
                ('a'.to_owned(), "q_0".to_owned()),
            ],
            "a".to_owned(),
        )
    );
    assert_eq!(
        test_dfa.validate_string("aa".to_string()),
        (
            true,
            true,
            vec![
                ('_'.to_owned(), "q_0".to_owned()),
                ('a'.to_owned(), "q_0".to_owned()),
                ('a'.to_owned(), "q_0".to_owned()),
            ],
            "aa".to_owned(),
        )
    );
    assert_eq!(
        test_dfa.validate_string("ab".to_string()),
        (
            true,
            false,
            vec![('_'.to_owned(), "q_0".to_owned()),],
            "ab".to_owned()
        )
    );
    assert_eq!(
        test_dfa.validate_string("aba".to_string()),
        (
            true,
            false,
            vec![('_'.to_owned(), "q_0".to_owned()),],
            "aba".to_owned()
        )
    );
    assert_eq!(
        test_dfa.validate_string("abb".to_string()),
        (
            true,
            false,
            vec![('_'.to_owned(), "q_0".to_owned()),],
            "abb".to_owned()
        )
    );
}

#[cfg(test)]
#[test]
pub fn test_nfas() -> () {
    // simplified solution to 2a from hw1 f19
    // multiple transitions with the same character but different end states
    // however there are no epsilon transitions
    let mut a_alphabet: HashSet<char> = HashSet::new();
    a_alphabet.insert('a');
    a_alphabet.insert('b');

    let a_start_state: String = "q_0".to_owned();

    let mut a_new_states: HashMap<String, bool> = HashMap::new();
    a_new_states.insert("q_0".to_owned(), false);
    a_new_states.insert("q_1".to_owned(), false);
    a_new_states.insert("q_2".to_owned(), false);
    a_new_states.insert("q_3".to_owned(), true);

    let mut a_transitions: MultiMap<(String, Option<char>), String> = MultiMap::new();

    a_transitions.insert(("q_0".to_owned(), Some('a')), "q_1".to_owned());
    a_transitions.insert(("q_0".to_owned(), Some('b')), "q_2".to_owned());

    a_transitions.insert(("q_1".to_owned(), Some('a')), "q_1".to_owned());
    a_transitions.insert(("q_1".to_owned(), Some('b')), "q_1".to_owned());
    a_transitions.insert(("q_1".to_owned(), Some('b')), "q_3".to_owned());

    a_transitions.insert(("q_2".to_owned(), Some('b')), "q_2".to_owned());
    a_transitions.insert(("q_2".to_owned(), Some('a')), "q_2".to_owned());
    a_transitions.insert(("q_2".to_owned(), Some('a')), "q_3".to_owned());

    let test_nfa_a: FiniteAutomaton = FiniteAutomaton::new(
        a_alphabet,
        a_start_state,
        a_new_states,
        a_transitions,
        false,
    );

    // lets check some hand written sample strings
    assert_eq!(
        test_nfa_a.validate_string("".to_string()),
        (
            false,
            false,
            vec![('_'.to_owned(), "q_0".to_owned()),],
            "".to_owned()
        )
    );
    assert_eq!(
        test_nfa_a.validate_string("a".to_string()),
        (
            false,
            false,
            vec![('_'.to_owned(), "q_0".to_owned()),],
            "a".to_owned()
        )
    );
    assert_eq!(
        test_nfa_a.validate_string("aa".to_string()),
        (
            false,
            false,
            vec![('_'.to_owned(), "q_0".to_owned()),],
            "aa".to_owned()
        )
    );
    assert_eq!(
        test_nfa_a.validate_string("ab".to_string()),
        (
            false,
            true,
            vec![
                ('_'.to_owned(), "q_0".to_owned()),
                ('a'.to_owned(), "q_1".to_owned()),
                ('b'.to_owned(), "q_3".to_owned()),
            ],
            "ab".to_owned()
        )
    );
    assert_eq!(
        test_nfa_a.validate_string("aba".to_string()),
        (
            false,
            false,
            vec![('_'.to_owned(), "q_0".to_owned()),],
            "aba".to_owned()
        )
    );
    assert_eq!(
        test_nfa_a.validate_string("bab".to_string()),
        (
            false,
            false,
            vec![('_'.to_owned(), "q_0".to_owned()),],
            "bab".to_owned()
        )
    );
    assert_eq!(
        test_nfa_a.validate_string("abb".to_string()),
        (
            false,
            true,
            vec![
                ('_'.to_owned(), "q_0".to_owned()),
                ('a'.to_owned(), "q_1".to_owned()),
                ('b'.to_owned(), "q_1".to_owned()),
                ('b'.to_owned(), "q_3".to_owned()),
            ],
            "abb".to_owned()
        )
    );
    assert_eq!(
        test_nfa_a.validate_string("baa".to_string()),
        (
            false,
            true,
            vec![
                ('_'.to_owned(), "q_0".to_owned()),
                ('b'.to_owned(), "q_2".to_owned()),
                ('a'.to_owned(), "q_2".to_owned()),
                ('a'.to_owned(), "q_3".to_owned()),
            ],
            "baa".to_owned()
        )
    );

    // simplified solution to 2b from hw1 f19
    // this one has epsilon transitions, and accepts any string with a caridanility of 2 or less

    let mut b_alphabet: HashSet<char> = HashSet::new();
    b_alphabet.insert('0');
    b_alphabet.insert('1');

    let b_start_state: String = "q_0".to_owned();

    let mut b_new_states: HashMap<String, bool> = HashMap::new();
    b_new_states.insert("q_0".to_owned(), false);
    b_new_states.insert("q_1".to_owned(), false);
    b_new_states.insert("q_2".to_owned(), false);
    b_new_states.insert("q_3".to_owned(), true);

    let mut b_transitions: MultiMap<(String, Option<char>), String> = MultiMap::new();

    b_transitions.insert(("q_0".to_owned(), Some('0')), "q_1".to_owned());
    b_transitions.insert(("q_0".to_owned(), Some('1')), "q_1".to_owned());
    b_transitions.insert(("q_0".to_owned(), None), "q_3".to_owned());

    b_transitions.insert(("q_1".to_owned(), Some('0')), "q_2".to_owned());
    b_transitions.insert(("q_1".to_owned(), Some('1')), "q_2".to_owned());
    b_transitions.insert(("q_1".to_owned(), None), "q_3".to_owned());

    b_transitions.insert(("q_2".to_owned(), None), "q_3".to_owned());

    let test_nfa_b: FiniteAutomaton = FiniteAutomaton::new(
        b_alphabet,
        b_start_state,
        b_new_states,
        b_transitions,
        false,
    );

    // lets check some hand written sample strings
    assert_eq!(
        test_nfa_b.validate_string("".to_string()),
        (
            false,
            true,
            [
                ('_'.to_owned(), "q_0".to_owned(),),
                ('Ɛ'.to_owned(), "q_3".to_owned(),),
            ]
            .to_vec(),
            "".to_owned()
        )
    );
    assert_eq!(
        test_nfa_b.validate_string("0".to_string()),
        (
            false,
            true,
            [
                ('_'.to_owned(), "q_0".to_owned(),),
                ('0'.to_owned(), "q_1".to_owned(),),
                ('Ɛ'.to_owned(), "q_3".to_owned(),),
            ]
            .to_vec(),
            "0".to_owned()
        )
    );
    assert_eq!(
        test_nfa_b.validate_string("00".to_string()),
        (
            false,
            true,
            [
                ('_'.to_owned(), "q_0".to_owned()),
                ('0'.to_owned(), "q_1".to_owned()),
                ('0'.to_owned(), "q_2".to_owned()),
                ('Ɛ'.to_owned(), "q_3".to_owned()),
            ]
            .to_vec(),
            "00".to_owned()
        )
    );
    assert_eq!(
        test_nfa_b.validate_string("01".to_string()),
        (
            false,
            true,
            [
                ('_'.to_owned(), "q_0".to_owned()),
                ('0'.to_owned(), "q_1".to_owned()),
                ('1'.to_owned(), "q_2".to_owned()),
                ('Ɛ'.to_owned(), "q_3".to_owned()),
            ]
            .to_vec(),
            "01".to_owned()
        )
    );
    assert_eq!(
        test_nfa_b.validate_string("010".to_string()),
        (
            false,
            false,
            [('_'.to_owned(), "q_0".to_owned())].to_vec(),
            "010".to_owned()
        )
    );
    assert_eq!(
        test_nfa_b.validate_string("101".to_string()),
        (
            false,
            false,
            [('_'.to_owned(), "q_0".to_owned())].to_vec(),
            "101".to_owned()
        )
    );
    assert_eq!(
        test_nfa_b.validate_string("011".to_string()),
        (
            false,
            false,
            [('_'.to_owned(), "q_0".to_owned())].to_vec(),
            "011".to_owned()
        )
    );
    assert_eq!(
        test_nfa_b.validate_string("100".to_string()),
        (
            false,
            false,
            [('_'.to_owned(), "q_0".to_owned())].to_vec(),
            "100".to_owned()
        )
    );
}
