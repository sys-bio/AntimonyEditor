import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { AntimonyGrammarLexer } from './AntimonyGrammarLexer';
import { AntimonyGrammarParser } from './AntimonyGrammarParser';

// Create the lexer and parser
let inputStream = new ANTLRInputStream("text");
let lexer = new AntimonyGrammarLexer(inputStream);
let tokenStream = new CommonTokenStream(lexer);
let parser = new AntimonyGrammarParser(tokenStream);

// Parse the input, where `compilationUnit` is whatever entry point you defined
let tree = parser.var_name();

console.log(tree);