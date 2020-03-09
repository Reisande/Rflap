extern crate multimap;
extern crate rand;

use serde::{Deserialize, Serialize};
use serde_json::Result;

use multimap::MultiMap;

use std::assert;
use std::collections::*;
use std::iter::FromIterator;

#[derive(Debug, Deserialize)]
pub struct PdaJson {
    stack_alphabet: HashSet<char>,
    transition_alphabet: HashSet<char>,
    start_state: String,
    pub(crate) states: HashMap<String, bool>,
    // chars are: read, pop, push
    transition_function: Vec<(String, char, char, char, String)>,
    input_strings: Vec<String>,
}

#[derive(Serialize)]
pub struct PdaCallback {
    pub list_of_strings: Vec<(bool, bool, Vec<(char, String)>, String)>,
    pub hint: String,
}

#[derive(Debug)]
pub struct Pda {
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
    transition_function: MultiMap<(String, Option<char>, Option<char>, Option<char>), String>,
    stack: Vec<char>,
}

impl Pda {
    pub fn new(
        a_alphabet: HashSet<char>,
        a_start_state: String,
        a_new_states: HashMap<String, bool>,
        a_transitions: MultiMap<(String, char, char, char), String>,
        a_is_deterministic: bool,
    ) -> Pda {
        // should probably add a check for validity of automaton, or maybe it
        // should be done client side
        Pda {
            alphabet: a_alphabet,
            start_state: a_start_state,
            states: a_new_states,
            transition_function: a_transitions
                .iter()
                .map(|(from, c0, c1, c2), to| (from, Some(c0), Some(c1), Some(c2), to))
                .collect(),
            stack: Vec::new(),
        }
    }

    pub fn new_from_json(json_struct: &PdaJson) -> (Pda, Vec<String>, String) {
        let new_transition_function = json_struct
            .transition_function
            .iter()
            .map(|(from, c0, c1, c2), to| (from, Some(c0), Some(c1), Some(c2), to))
            .collect();

        let mut return_pda = Pda {
            alphabet: json_struct.alphabet.to_owned(),
            start_state: json_struct.start_state.to_owned(),
            states: json_struct.states.to_owned(),
            transition_function: new_transition_function,
            stack: Vec::new(),
        };

        let hint: String = return_pda.check_is_deterministic();

        (return_pda, json_struct.input_strings.to_owned(), hint)
    }

    // convert the original string by using string.chars().collect()
    fn _validate_string(
        &self,
        validate_string: &Vec<char>,
        position: usize,
        mut current_path: Vec<(char, String)>,
        current_state: String,
        transition_char: char,
        call_size: u32,
    ) -> (bool, Vec<(char, String)>) {
        if call_size >= 200 {
            std::panic!("overflow")
        }

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
                        call_size + 1,
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
                    call_size + 1,
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
                    call_size + 1,
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

    // return API dictates: (is_deterministic, accepted, path, hint)
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
            0,
        );

        (
            self.is_deterministic.to_owned(),
            accepted,
            return_vec.to_owned(),
            validate_string,
        )
    }

    #[inline]
    pub fn validate_string_json(&self, validate_string: String) -> Result<String> {
        serde_json::to_string_pretty(&self.validate_string(validate_string))
    }
}

#[cfg(test)]
#[test]
pub fn test_pdas() -> () {}
