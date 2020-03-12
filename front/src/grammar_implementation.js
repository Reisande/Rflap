import g from "cfgrammar-tool"


let types = g.types;
let parser = g.parser;
let generator = g.generator;


let Grammar = types.Grammar;
let Rule = types.Rule;

let T = types.T;
let NT = types.NT;


let  exprGrammar = Grammar([
    Rule('E', [NT('E'), T('+'), NT('T')]),
    Rule('E', [NT('T')]),
    Rule('T', [NT('T'), T('*'), NT('F')]),
    Rule('T', [NT('F')]),
    Rule('F', [T('('), NT('E'), T(')')]),
    Rule('F', [T('n')])
  ]);

  
  
