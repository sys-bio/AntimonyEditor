import * as monaco from 'monaco-editor';
import { ANTLRErrorListener, ANTLRInputStream, CommonTokenStream, ParserRuleContext, RecognitionException, Recognizer } from 'antlr4ts';
import { AntimonyGrammarLexer } from './antlr/AntimonyGrammarLexer';
import { AnnotationContext, AntimonyGrammarParser, AssignmentContext, Decl_itemContext, Decl_modifiersContext, DeclarationContext, EventContext, FunctionContext, In_compContext, Is_assignmentContext, NamemaybeinContext, ReactionContext, SpeciesContext, Species_listContext, Unit_declarationContext } from './antlr/AntimonyGrammarParser';
import { SymbolTable, GlobalST, FuncST, ModelST, STVariableInfo, SrcPosition, SrcRange} from './SymbolTableClasses';
import { SymbolTableVisitor } from './SymbolTableVisitor';

// copied from ModelParser for now
class ErrorListener implements ANTLRErrorListener<any> {
  private errors: string[] = [];

  syntaxError<T>(
    recognizer: Recognizer<T, any>,
    offendingSymbol: T,
    line: number,
    charPositionInLine: number,
    msg: string,
    e: RecognitionException | undefined
  ): void {
    this.errors.push(`Line ${line}:${charPositionInLine} - ${msg}`);
  }

  getErrors(): string[] {
    return this.errors;
  }
}

const ModelSemanticsChecker = (editor: monaco.editor.IStandaloneCodeEditor, hoverExists: boolean) => {
  // Create the lexer and parser
  let inputStream = new ANTLRInputStream(editor.getValue());
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
  const stVisitor: SymbolTableVisitor = new SymbolTableVisitor(globalSymbolTable);
  stVisitor.visit(tree);
  console.log(stVisitor.globalST);

  //this is how to add error squiglies 
  let model: monaco.editor.ITextModel | null = editor.getModel();
  if (model !== null) {
    monaco.editor.setModelMarkers(model, "owner", stVisitor.getErrors());
  }
}

export default ModelSemanticsChecker;