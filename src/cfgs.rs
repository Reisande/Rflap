use crate::tests;

use serde::{Deserialize, Serialize};
use serde_json::Result;

use std::borrow::Borrow;
use std::collections::{HashMap, HashSet};
use std::panic;

#[macro_use]
extern crate dynparser;
use dynparser::parser::atom::Atom::Literal;
use dynparser::parser::expression::{Expression, SetOfRules};
use dynparser::{parse, rules_from_peg};

#[derive(Debug, Deserialize, Serialize)]
pub struct CfgJsonCallback {
    pub test_results: Vec<(String, bool)>,
    pub chomsky_normal_form: bool,
    pub error_string: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct CfgJson {
    // terminals: lowercase letters or numbers
    terminals: HashSet<char>,
    // start_nonterminal: char,
    non_terminals: HashSet<char>,
    // start nonterminal is 'S'
    // non_terminals are capital characters
    // productions are 2d because there can more than one rule for a non_terminal,
    // and each rule is a series of characters corresponding to non-terminals and terminals
    productions: HashMap<char, Vec<Vec<char>>>,
    tests: Vec<String>,
}

impl CfgJson {
    // should not really be ca;led outside of tests. The method which should create CfgJsons is the derived
    // serde_json::de::from_str
    pub fn new(
        t: HashSet<char>,
        n_t: HashSet<char>,
        p: HashMap<char, Vec<Vec<char>>>,
        ts: Vec<String>,
    ) -> CfgJson {
        // should probably add a check for validity of automaton, or maybe it
        // should be done client side
        CfgJson {
            terminals: t,
            non_terminals: n_t,
            productions: p,
            tests: ts,
        }
    }

    // validate CfgJson
    pub fn validate_cfg_json(&self) -> std::result::Result<(), &'static str> {
        for (terminal, productions) in &self.productions {
            // checks to make sure each production in each rule is made up of valid characters
            if !self.non_terminals.contains(terminal.borrow()) {
                return Err("One of the productions is not actually in the list of non terminals");
            }

            for rule in productions {
                for character in rule {
                    if !self.non_terminals.contains(terminal.borrow())
                        && !self.terminals.contains(character.borrow())
                    {
                        return Err("One of the characters inside of a listed rule is not a terminal or non-terminal");
                    }
                }
            }
        }

        if !self.non_terminals.contains('S'.borrow()) {
            return Err("Does not contain \"S\" as a non-terminal");
        }

        Ok(())
    }

    pub fn create_grammar(&self) -> std::result::Result<SetOfRules, String> {
        let mut non_terminal_strings: HashMap<char, String> = HashMap::new();
        let mut terminal_strings: HashMap<char, String> = HashMap::new();

        // TODO: this code is disgusting and horribly inefficient, change the char in the CFG
        // TODO: type to be a string and check all invariants
        for non_terminal in self.non_terminals.iter() {
            let mut char_string = [0; 4];

            let non_terminal_string = non_terminal.encode_utf8(&mut char_string).to_string();
            non_terminal_strings.insert(*non_terminal, non_terminal_string.to_owned());
        }

        for terminal in self.terminals.iter() {
            let mut char_string = [0; 4];

            let terminal_string = terminal.encode_utf8(&mut char_string).to_string();
            terminal_strings.insert(*terminal, terminal_string.to_owned());
        }

        let mut init_hashmap: HashMap<String, Expression> = HashMap::new();

        for (production_name, rule) in self.productions.iter() {
            for rule in rules {
                let mut exp_vec: &Vec<Expression> = &Vec::new();
                for sub_expression in rule {
                    if let Some(&S) = non_terminal_strings.get(sub_expression) {
                        exp_vec.push(Expression::RuleName(S))
                    } else if let Some(&S) = terminal_strings.get(sub_expression) {
                        exp_vec.push(Expression::Simple(Literal(S)))
                    } else {
                        return Err(format!(
                            "{} has no corresponding non-terminal or terminal",
                            sub_expression
                        ));
                    }
                }

                let insert_expression: Expression = Expression::And(Expression::new(exp_vec));

                init_hashmap.insert(
                    non_terminal_strings
                        .get(production_name)
                        .unwrap()
                        .to_owned(),
                    insert_expression,
                );
            }
        }

        Err("Not implemented".to_string())
    }

    // validate strings
    // The error type means that a string fails to parse, and should be rejected, the ParseTrees
    // are just in case we want to show them later, but are unused for now
    pub fn validate_strings(&self, grammar: earlgrey::Grammar) -> Vec<(String, bool)> {
        let mut return_vec: Vec<(String, bool)> = Vec::new();

        let parser: EarleyParser = earlgrey::EarleyParser::new(grammar);

        for test in &self.tests {
            let a = parser.parse("aba".split_whitespace());

            return_vec.push((
                test.to_owned(),
                match a {
                    Ok(_) => true,
                    Err(_) => false,
                },
            ));
        }

        return_vec
    }

    // check Chomsky Normal form
    pub fn check_chomsky_normal_form(&self) -> std::result::Result<(), &'static str> {
        for (_, rules) in &self.productions {
            for rule in rules {
                if rule.len() > 2 {
                    return Err("One of your rules has more than two symbols");
                }

                if rule.len() == 2 {
                    // both symbol have to be non-terminals
                    if !self.non_terminals.contains(rule[0].borrow())
                        && !self.non_terminals.contains(rule[1].borrow())
                    {
                        return Err("One of your rules has a non-terminal and a terminal, or two non terminals");
                    }
                } else if rule.len() == 1 {
                    if !self.terminals.contains(rule[0].borrow()) {
                        return Err("One of your rules has only one symbol, and that one symbol is not a terminal");
                    }
                } else if rule.len() == 0 {
                    return Err("One of your rules is empty. This should not happen; please report this error on Piazza");
                }
            }
        }

        Ok(())
    }
}

#[cfg(test)]
#[test]
pub fn test_cfgs() -> () {
    // trivial example of the CFG which recognizes palindromes
    // ! represents epsilon
    // S -> aSa | bSb | a | b | !
    let mut terminals: HashSet<char> = HashSet::new();
    terminals.insert('a');
    terminals.insert('b');

    let mut non_terminals: HashSet<char> = HashSet::new();
    non_terminals.insert('S');

    let mut productions: HashMap<char, Vec<Vec<char>>> = HashMap::new();
    productions.insert(
        'S',
        [
            ['a', 'S', 'a'].to_vec(),
            ['b', 'S', 'b'].to_vec(),
            ['a'].to_vec(),
            ['b'].to_vec(),
            ['!'].to_vec(),
        ]
        .to_vec(),
    );

    let mut tests: Vec<String> = Vec::new();
    tests.push("aba".to_string());
    //tests.push("".to_string()); currently this makes the thing crash
    tests.push("ba".to_string());
    tests.push("aabaa".to_string());
    tests.push("aa".to_string());
    tests.push("b".to_string());

    let cfg = CfgJson {
        terminals,
        non_terminals,
        productions,
        tests,
    };

    println!("{:?}", cfg.validate_cfg_json());

    /*let grammar = match cfg.create_grammar() {
        Ok(g) => g,
        Err(s) => {
            println!("{}", s);
            panic!(s);
        }
    };

    println!("{:?}", cfg.check_chomsky_normal_form());

    let result_of_tests = cfg.validate_strings(grammar);

    assert!(result_of_tests[0].1);
    assert!(result_of_tests[1].1);
    assert!(result_of_tests[!2].1);
    assert!(result_of_tests[3].1);
    assert!(result_of_tests[4].1);
    assert!(result_of_tests[5].1);*/
}
