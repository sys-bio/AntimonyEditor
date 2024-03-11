import * as monaco from 'monaco-editor';
import { ANTLRErrorListener, ANTLRInputStream, CommonTokenStream, DefaultErrorStrategy, Parser, RecognitionException, Recognizer} from 'antlr4ts';
import { AntimonyGrammarLexer } from './antlr/AntimonyGrammarLexer';
import { AntimonyGrammarParser} from './antlr/AntimonyGrammarParser';
import { GlobalST} from './SymbolTableClasses';
import { SymbolTableVisitor } from './SymbolTableVisitor';
import { ATNState } from 'antlr4ts/atn/ATNState';
import { IntervalSet } from 'antlr4ts/misc/IntervalSet';
import { SemanticContext } from 'antlr4ts/atn/SemanticContext';
import { SemanticVisitor } from './SemanticVisitor';
import { ErrorUnderline } from './Types';


type parseErrors = {
  line: number,
  column: number,
  msg: string
}

class MyErrorStrat extends DefaultErrorStrategy {
  private errors: string[] = [];

  recover(recognizer: Parser, e: RecognitionException): void {
    this.errors.push("Recovering from " + e + " at " + recognizer.currentToken);
  }

  sync(recognizer: Parser): void {
      if (!this.inErrorRecoveryMode(recognizer)) {
        let s: ATNState | undefined = recognizer.interpreter.atn.states.at(recognizer.state);
        if (s) {
          let next = s.transition(0).target;
          let expecting: IntervalSet = recognizer.getExpectedTokens();
          let nextTokens: IntervalSet = recognizer.getExpectedTokensWithinCurrentRule();
        }
      }
  }
}

// copied from ModelParser for now
class ErrorListener implements ANTLRErrorListener<any> {
  private errors: parseErrors[] = [];

  syntaxError<T>(
    recognizer: Recognizer<T, any>,
    offendingSymbol: T,
    line: number,
    charPositionInLine: number,
    msg: string,
    e: RecognitionException | undefined
  ): void {
    this.errors.push({line: line, column: charPositionInLine, msg: msg});
  }

  getErrors(): parseErrors[] {
    return this.errors;
  }
}

const ModelSemanticsChecker = (editor: monaco.editor.IStandaloneCodeEditor, hoverExists: boolean) => {

  // const stVisitor: SymbolTableVisitor = getSTVisitor(editor.getValue());
  // console.log(stVisitor.globalST);
  const errors: ErrorUnderline[] = getErrors(editor.getValue());

  //this is how to add error squiglies 
  let model: monaco.editor.ITextModel | null = editor.getModel();
  if (model !== null) {
    monaco.editor.setModelMarkers(model, "owner", errors);
  }
}

export function getErrors(antimonyCode: string): ErrorUnderline[] {
  let inputStream = new ANTLRInputStream(antimonyCode);
  let lexer = new AntimonyGrammarLexer(inputStream);
  let tokenStream = new CommonTokenStream(lexer);
  let parser = new AntimonyGrammarParser(tokenStream);

  const errorListener = new ErrorListener();
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);
  // parser.errorHandler = new MyErrorStrat();

  // Parse the input, where `compilationUnit` is whatever entry point you defined
  let tree = parser.root();
  // printing the tree for debugging purposes
  console.log(tree);
  
  // create and buildup a global symbol table from the parse tree.
  let globalSymbolTable: GlobalST = new GlobalST();
  console.log(globalSymbolTable);
  const stVisitor: SymbolTableVisitor = new SymbolTableVisitor(globalSymbolTable);
  stVisitor.visit(tree);
  const semanticVisitor: SemanticVisitor = new SemanticVisitor(stVisitor.globalST);
  semanticVisitor.visit(tree);
  

  // stVisitor.addErrorList(addParseErrors(errorListener.getErrors()))
  return stVisitor.getErrors().concat(semanticVisitor.getErrors());
}

function addParseErrors(errors: parseErrors[]) {
  let parseErrors = []
  for (let i = 0; i < errors.length; i++) {
    const line: number = errors[i].line;
    const column: number = errors[i].column + 1;
    const unexpectedChar = errors[i].msg;

    let error = {
      startLineNumber: line,
      startColumn: column,
      endLineNumber: line,
      endColumn: column + 1,
      message: "Unexpected token " + unexpectedChar,
      severity: monaco.MarkerSeverity.Error
    }
    parseErrors.push(error);
  }
  return parseErrors;
}

export default ModelSemanticsChecker;