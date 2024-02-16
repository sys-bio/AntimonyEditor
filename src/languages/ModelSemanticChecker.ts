import * as monaco from 'monaco-editor';
import { ANTLRErrorListener, ANTLRInputStream, CommonTokenStream, ParserRuleContext, RecognitionException, Recognizer } from 'antlr4ts';
import { AntimonyGrammarLexer } from './antlr/AntimonyGrammarLexer';
import { AnnotationContext, AntimonyGrammarParser, AssignmentContext, Decl_itemContext, Decl_modifiersContext, DeclarationContext, EventContext, FunctionContext, In_compContext, Is_assignmentContext, NamemaybeinContext, ReactionContext, SpeciesContext, Species_listContext, Unit_declarationContext } from './antlr/AntimonyGrammarParser';
import { SymbolTable, GlobalST, FuncST, ModelST} from './SymbolTableClasses';
import { SymbolTableVisitor } from './SymbolTableVisitor';
import { error } from 'console';


type parseErrors = {
  line: number,
  column: number,
  msg: string
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

  const stVisitor: SymbolTableVisitor = getSTVisitor(editor.getValue());
  // console.log(stVisitor.globalST);

  //this is how to add error squiglies 
  let model: monaco.editor.ITextModel | null = editor.getModel();
  if (model !== null) {
    monaco.editor.setModelMarkers(model, "owner", stVisitor.getErrors());
  }
}

export function getSTVisitor(antimonyCode: string): SymbolTableVisitor {
  let inputStream = new ANTLRInputStream(antimonyCode);
  let lexer = new AntimonyGrammarLexer(inputStream);
  let tokenStream = new CommonTokenStream(lexer);
  let parser = new AntimonyGrammarParser(tokenStream);

  const errorListener = new ErrorListener();
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  // Parse the input, where `compilationUnit` is whatever entry point you defined
  let tree = parser.root();
  // printing the tree for debugging purposes
  console.log(tree);
  
  // create and buildup a global symbol table from the parse tree.
  let globalSymbolTable: GlobalST = new GlobalST();
  console.log(globalSymbolTable);
  const stVisitor: SymbolTableVisitor = new SymbolTableVisitor(globalSymbolTable);
  stVisitor.visit(tree);
  stVisitor.addErrorList(addParseErrors(errorListener.getErrors()))
  return stVisitor;
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