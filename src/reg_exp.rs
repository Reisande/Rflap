// an enum can be considered as a tree/trie of symbols and modifiers
pub enum RegExp {
    Symbol(String),
    Plus(Box<RegExp>),
    KleeneStar(Box<RegExp>),
    Or(std::vec::Vec<Box<RegExp>>),
}
