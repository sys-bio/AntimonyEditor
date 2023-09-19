import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { AntimonyGrammarLexer } from './/antlr/AntimonyGrammarLexer';
import { AntimonyGrammarParser, SpeciesContext } from './antlr/AntimonyGrammarParser';
import { AntimonyGrammarListener } from './antlr/AntimonyGrammarListener'
import { ModelContext } from './antlr/AntimonyGrammarParser'
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'

class SpeciesInfo {
  declarations?: string[] = [];
  initializations?: string[] = [];
  compartments?: string[] = [];
  annotations?: string[] = [];
}

declare var species: Map<string, SpeciesInfo>;

// Create the lexer and parser
let inputStream = new ANTLRInputStream("text");
let lexer = new AntimonyGrammarLexer(inputStream);
let tokenStream = new CommonTokenStream(lexer);
let parser = new AntimonyGrammarParser(tokenStream);

// Parse the input, where `compilationUnit` is whatever entry point you defined
let tree = parser.root();

class AntimonySyntax implements AntimonyGrammarListener {
  enterSpecies(ctx: SpeciesContext) {
    species.set(ctx.text, {})
    console.log(ctx.text)
    console.log(species.keys)
  };
}

// Create the listener
const listener: AntimonyGrammarListener = new AntimonySyntax();
// Use the entry point for listeners
ParseTreeWalker.DEFAULT.walk(listener, tree)

console.log(tree);