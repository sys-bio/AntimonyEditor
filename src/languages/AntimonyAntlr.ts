import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { AntimonyGrammarLexer } from './AntimonyGrammarLexer';
import { AntimonyGrammarParser } from './AntimonyGrammarParser';
import { AntimonyGrammarListener } from './AntimonyGrammarListener'
import { ModelContext } from './AntimonyGrammarParser'
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'

// Create the lexer and parser
let inputStream = new ANTLRInputStream("text");
let lexer = new AntimonyGrammarLexer(inputStream);
let tokenStream = new CommonTokenStream(lexer);
let parser = new AntimonyGrammarParser(tokenStream);

// Parse the input, where `compilationUnit` is whatever entry point you defined
let tree = parser.root();

class AntimonySyntax implements AntimonyGrammarListener {
  // Assuming a parser rule with name: `functionDeclaration`
  enterModel(context: ModelContext) {
    console.log(`Function start line number ${context._start.line}`)
    // ...
  }

  // other enterX functions...
}

// Create the listener
const listener: AntimonyGrammarListener = new AntimonySyntax();
// Use the entry point for listeners
ParseTreeWalker.DEFAULT.walk(listener, tree)

console.log(tree);