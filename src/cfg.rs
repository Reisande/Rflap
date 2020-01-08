enum SymbolType {
    Terminal,
    NonTerminal,
}

pub struct CFG {
    // a CFG can be represented as a 4-tuple of non-terminal, terminals, rules,
    // and a start symbol
    non_terminals: std::vec::Vec<String>,
    terminals: std::vec::Vec<String>,
    // rules are a map from a non terminal to an ordered collection of terminals
    // and nonterminals
    rules: std::collections::HashMap<String, (String, SymbolType)>,
    start: String,
}

impl CFG {
    // this takes an argument of a string instead of a vector of strings because,
    // like the automata path, the vector of strings is validated one at a time
    pub fn verify_string(self, input_string: String) -> bool {}
}
