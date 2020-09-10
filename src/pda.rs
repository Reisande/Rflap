extern crate multimap;
extern crate rand;

use serde::{Deserialize, Serialize};
use serde_json::Result;

use multimap::MultiMap;

use std::assert;
use std::collections::*;
use std::env::current_exe;
use std::iter::FromIterator;

#[derive(Debug, Deserialize)]
pub struct PdaJson {
    stack_alphabet: HashSet<char>,
    transition_alphabet: HashSet<char>,
    start_state: String,
    pub(crate) states: HashMap<String, bool>,
    // chars are: read, pop, push
    transition_function: Vec<(String, char, char, char, String)>,
    pub input_strings: Vec<String>,
}

#[derive(Serialize)]
pub struct PdaCallback {
    pub list_of_strings: Vec<(bool, String)>,
}

#[derive(Debug)]
pub struct Pda {
    // automata are defined as a 5 tuple of states, alphabet, transition function,
    // final, and start state
    stack_alphabet: HashSet<char>,
    transition_alphabet: HashSet<char>,
    start_state: String,
    // states are defined as a map from strings to bools, which determine if
    // they are accepting states
    states: HashMap<String, bool>,
    // transition function is a hashMap from the current state, to a hashmap
    // representing all of the transitions for the current state
    // the transition of a current state is a let mutter and a next state
    transition_function: MultiMap<(String, Option<char>, Option<char>), (Option<char>, String)>,
    stack: Vec<char>,
}

#[inline]
fn convert_chars(c: char) -> Option<char> {
    match c {
        '!' => None,
        _ => Some(c),
    }
}

impl Pda {
    pub fn new(
        a_stack_alphabet: HashSet<char>,
        a_transition_alphabet: HashSet<char>,
        a_start_state: String,
        a_new_states: HashMap<String, bool>,
        a_transitions: MultiMap<(String, Option<char>, Option<char>), (Option<char>, String)>,
    ) -> Pda {
        let mut transition_function = MultiMap::new();
		
        for ((from, c0, c1), v) in a_transitions {
            for (c2, to) in v {
                transition_function.insert(
                    (
                        from.to_owned(),
                        convert_chars(c0.unwrap()),
                        convert_chars(c1.unwrap()),
                    ),
                    (convert_chars(c2.unwrap()), to),
                );
            }
        }

        // should probably add a check for validity of automaton, or maybe it
        // should be done client side
        Pda {
            stack_alphabet: a_stack_alphabet,
            transition_alphabet: a_transition_alphabet,
            start_state: a_start_state,
            states: a_new_states,
            transition_function: transition_function,
            stack: Vec::new(),
        }
    }

    pub fn new_from_json(json_struct: &PdaJson) -> (Pda, Vec<String>) {
        let mut new_transition_function = MultiMap::new();

        for (from, c0, c1, c2, to) in json_struct.transition_function.to_owned() {
            new_transition_function.insert(
                (from, convert_chars(c0), convert_chars(c1)),
                (convert_chars(c2), to),
            );
        }

        let mut return_pda = Pda {
            transition_alphabet: json_struct.transition_alphabet.to_owned(),
            stack_alphabet: json_struct.transition_alphabet.to_owned(),
            start_state: json_struct.start_state.to_owned(),
            states: json_struct.states.to_owned(),
            transition_function: new_transition_function,
            stack: Vec::new(),
        };

        (return_pda, json_struct.input_strings.to_owned())
    }

    // convert the original string by using string.chars().collect()
    // accepted, path, stack
    // TODO: use ! instead of epsilon and map over in the new method of the pdaJsonCallback

    // TODO: build invariant that stack is never empty, pop_char will never be empty
    fn _validate_string(
        &self,
        validate_string: &Vec<char>,
        position: usize,
        mut current_path: Vec<(Option<char>, Option<char>, Option<char>, String)>,
        mut current_stack: Vec<char>,
        current_state: String,
        transition_char: Option<char>,
        push_char: Option<char>,
        pop_char: Option<char>,
        call_size: u32,
    ) -> (
        bool,
        Vec<(Option<char>, Option<char>, Option<char>, String)>,
        Vec<char>,
    ) {
        if call_size >= 200 {
            std::panic!("overflow")
        }

        current_path.push((
            transition_char,
            pop_char,
            push_char,
            current_state.to_owned(),
        ));

        match pop_char {
            Some(c) => {
                current_stack.pop();
                ()
            }
            None => {}
        };

        match push_char {
            Some(c) => {
                current_stack.push(c);
                ()
            }
            None => {}
        };

        if current_stack.last() == None && call_size > 0 && position <= validate_string.len() {
            return (false, Vec::new(), Vec::new());
        }

        // end of the string
        if position >= validate_string.len() {
            let is_final: bool = match self.states.get(&current_state.to_owned()) {
                Some(b) => *b,
                None => false,
            };

            if is_final {
                return (true, current_path.to_owned(), current_stack.to_owned());
            }
        } else {
            // regular transition with pop top of stack
            // regular transition with pop nothing

            let mut targets: Vec<(Option<char>, String)> =
                match self.transition_function.get_vec(&(
                    current_state.to_owned(),
                    Some(validate_string[position]),
                    Some(*(current_stack.last().unwrap())),
                )) {
                    Some(v) => v.to_owned(),
                    None => Vec::new(),
                };

            for (push_char, to_state) in targets {
                let mut transition_char: Option<char> = None;

                match self._validate_string(
                    validate_string,
                    position + 1,
                    current_path.to_owned(),
                    current_stack.to_owned(),
                    to_state.to_owned(),
                    Some(validate_string[position]),
                    push_char,
                    Some(*(current_stack.last().unwrap())),
                    call_size + 1,
                ) {
                    (true, path, stack) => return (true, path, stack),
                    (false, _, _) => {}
                }
            }

            // after the current symbol has been checked should check for epsilon transitions
            let mut target_vec_epsilon_transitions: Vec<(Option<char>, String)> =
                match self.transition_function.get_vec(&(
                    current_state.to_owned(),
                    Some(validate_string[position]),
                    None,
                )) {
                    Some(v) => v.to_owned(),
                    None => Vec::new(),
                };

            // epsilon transition with no stack pop
            for (push_char, to_state) in target_vec_epsilon_transitions {
                let mut transition_char: Option<char> = None;

                match self._validate_string(
                    validate_string,
                    position + 1,
                    current_path.to_owned(),
                    current_stack.to_owned(),
                    to_state.to_owned(),
                    Some(validate_string[position]),
                    push_char,
                    None,
                    call_size + 1,
                ) {
                    (true, path, stack) => return (true, path, stack),
                    (false, _, _) => {}
                }
            }
        }

        // epsilon transition with pop top of stack
        // epsilon transition with pop nothing

        let mut target_vec_epsilon_transitions: Vec<(Option<char>, String)> =
            match self.transition_function.get_vec(&(
                current_state.to_owned(),
                None,
                Some(*(current_stack.last().unwrap())),
            )) {
                Some(v) => v.to_owned(),
                None => Vec::new(),
            };

        for (push_char, to_state) in target_vec_epsilon_transitions {
            let mut transition_char: Option<char> = None;

            match self._validate_string(
                validate_string,
                position,
                current_path.to_owned(),
                current_stack.to_owned(),
                to_state.to_owned(),
                None,
                push_char,
                Some(*(current_stack.last().unwrap())),
                call_size + 1,
            ) {
                (true, path, stack) => return (true, path, stack),
                (false, _, _) => {}
            }
        }

        // after the current symbol has been checked should check for epsilon transitions
        let mut target_vec_epsilon_transitions: Vec<(Option<char>, String)> = match self
            .transition_function
            .get_vec(&(current_state.to_owned(), None, None))
        {
            Some(v) => v.to_owned(),
            None => Vec::new(),
        };

        // epsilon transition with no stack pop
        for (push_char, to_state) in target_vec_epsilon_transitions {
            let mut transition_char: Option<char> = None;

            match self._validate_string(
                validate_string,
                position,
                current_path.to_owned(),
                current_stack.to_owned(),
                to_state.to_owned(),
                None,
                push_char,
                None,
                call_size + 1,
            ) {
                (true, path, stack) => return (true, path, stack),
                (false, _, _) => {}
            }
        }

        (false, current_path.to_owned(), current_stack.to_owned())
    }

    // returns a path of transitions and states, beginning with the start state
    // and ending with a final state if the automaton accepts the string. If
    // the automaton rejects the string returns None. Maybe this should
    // be changed to a Result, though

    // this function assumes that the validation that the string is valid for the
    // alphabet occurs on the client side

    // return API dictates: (accepted, path, end_stack, hint)
    // string is any possible hint in creation
    pub fn validate_string(
        &self,
        validate_string: String,
    ) -> (
        bool,
        Vec<(Option<char>, Option<char>, Option<char>, String)>,
        Vec<char>,
        String,
    ) {
        let validate_vec: Vec<char> = validate_string.chars().collect();
        let (accepted, return_path, return_stack) = self._validate_string(
            &validate_vec,
            0,
            Vec::new(),
            Vec::new(),
            self.start_state.to_owned(),
            Some('_'),
            Some('$'),
            None,
            0,
        );

        (
            accepted,
            return_path.to_owned(),
            return_stack.to_owned(),
            validate_string.to_owned(),
        )
    }

    #[inline]
    pub fn validate_string_json(&self, validate_string: String) -> Result<String> {
        serde_json::to_string_pretty(&self.validate_string(validate_string))
    }
}

#[cfg(test)]
#[test]
pub fn test_pdas() -> () {
    // start out with the pda with recognizes palindromes
    let mut a_stack_alphabet: HashSet<char> = HashSet::new();

    a_stack_alphabet.insert('a');
    a_stack_alphabet.insert('b');
    a_stack_alphabet.insert('$');

    let mut a_transition_alphabet: HashSet<char> = HashSet::new();

    a_transition_alphabet.insert('a');
    a_transition_alphabet.insert('b');

    let a_start_state: String = "q1".to_string();

    let mut a_new_states: HashMap<String, bool> = HashMap::new();

    a_new_states.insert("q1".to_string(), false);
    a_new_states.insert("q2".to_string(), false);
    a_new_states.insert("q3".to_string(), false);
    a_new_states.insert("q4".to_string(), true);

    let mut a_transitions: MultiMap<(String, Option<char>, Option<char>), (Option<char>, String)> =
        MultiMap::new();

    a_transitions.insert(
        ("q1".to_string(), Some('!'), Some('!')),
        (Some('!'), "q2".to_string()),
    );

    a_transitions.insert(
        ("q2".to_string(), Some('a'), Some('!')),
        (Some('a'), "q2".to_string()),
    );
    a_transitions.insert(
        ("q2".to_string(), Some('b'), Some('!')),
        (Some('b'), "q2".to_string()),
    );
    a_transitions.insert(
        ("q2".to_string(), Some('a'), Some('!')),
        (Some('!'), "q3".to_string()),
    );
    a_transitions.insert(
        ("q2".to_string(), Some('b'), Some('!')),
        (Some('!'), "q3".to_string()),
    );
    a_transitions.insert(
        ("q2".to_string(), Some('!'), Some('!')),
        (Some('!'), "q3".to_string()),
    );

    a_transitions.insert(
        ("q3".to_string(), Some('b'), Some('b')),
        (Some('!'), "q3".to_string()),
    );
    a_transitions.insert(
        ("q3".to_string(), Some('a'), Some('a')),
        (Some('!'), "q3".to_string()),
    );
    a_transitions.insert(
        ("q3".to_string(), Some('!'), Some('$')),
        (Some('!'), "q4".to_string()),
    );

    let mut test_pda = Pda::new(
        a_stack_alphabet,
        a_transition_alphabet,
        a_start_state,
        a_new_states,
        a_transitions,
    );

    /*assert!(test_pda.validate_string("".to_string()).0);
    assert!(test_pda.validate_string("aa".to_string()).0);
    assert!(test_pda.validate_string("a".to_string()).0);
    assert!(test_pda.validate_string("abba".to_string()).0);

    assert!(!test_pda.validate_string("abbbab".to_string()).0);
    assert!(!test_pda.validate_string("ba".to_string()).0);
    assert!(!test_pda.validate_string("bba".to_string()).0);
    assert!(!test_pda.validate_string("baaa".to_string()).0);*/
}
