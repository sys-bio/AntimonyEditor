// ...
import { AntimonyGrammarListener } from '../languages/AntimonyGrammarListener'
import { AntimonyGrammarParser } from '../languages/AntimonyGrammarParser'
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'


class AntimonySyntax implements AntimonyGrammarListener {
  // Assuming a parser rule with name: `functionDeclaration`
  enterFunctionDeclaration(context: FunctionDeclarationContext) {
    console.log(`Function start line number ${context._start.line}`)
    // ...
  }

  // other enterX functions...
}

// Create the listener
const listener: AntimonyGrammarListener = new AntimonySyntax();
// Use the entry point for listeners
ParseTreeWalker.DEFAULT.walk(listener, tree)