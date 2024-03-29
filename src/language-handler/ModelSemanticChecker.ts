import * as monaco from 'monaco-editor';
import { ANTLRErrorListener, ANTLRInputStream, CommonTokenStream, Parser, RecognitionException, Recognizer} from 'antlr4ts';
import { AntimonyGrammarLexer } from './antlr/AntimonyGrammarLexer';
import { AntimonyGrammarParser, RootContext} from './antlr/AntimonyGrammarParser';
import { GlobalST} from './SymbolTableClasses';
import { SymbolTableVisitor } from './SymbolTableVisitor';
import { SemanticVisitor } from './SemanticVisitor';
import { ErrorUnderline, SrcRange } from './Types';
import { Variable } from './Variable';


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
    // console.log(offendingSymbol)
    this.errors.push({line: line, column: charPositionInLine, msg: msg});
  }

  getErrors(): parseErrors[] {
    return this.errors;
  }
}

const ModelSemanticsChecker = (editor: monaco.editor.IStandaloneCodeEditor, hoverExists: boolean) => {
  // const errors: ErrorUnderline[] = getErrors(removeCarriageReturn(editor.getValue()), true);
  const antAnalyzer = new AntimonyProgramAnalyzer(editor.getValue());

  const errors: ErrorUnderline[] = antAnalyzer.getErrors(true);

  // this is how to add error squiglies 
  let model: monaco.editor.ITextModel | null = editor.getModel();
  if (model !== null) {
    monaco.editor.setModelMarkers(model, "owner", errors);
  }
}


export class AntimonyProgramAnalyzer {
  private errorListener: ErrorListener;
  private parser: AntimonyGrammarParser;
  private tree: RootContext;
  private stVisitor: SymbolTableVisitor;
  private semanticVisitor: SemanticVisitor;
  private globalST: GlobalST;

  constructor(antimonyCode: string) {
    // we remove carriage returns in the string since
    // these only exist in new lines on windows OS, and interfere with the 
    // grammar parse.
    antimonyCode = this.removeCarriageReturn(antimonyCode);
    let inputStream = new ANTLRInputStream(antimonyCode);
    let lexer = new AntimonyGrammarLexer(inputStream);
    let tokenStream = new CommonTokenStream(lexer);
    this.parser = new AntimonyGrammarParser(tokenStream);

    this.errorListener = new ErrorListener();
    this.parser.removeErrorListeners();
    this.parser.addErrorListener(this.errorListener);

    // Parse the input, where `compilationUnit` is whatever entry point you defined
    this.tree = this.parser.root();

    this.globalST = new GlobalST();
    // console.log(globalSymbolTable);
    this.stVisitor = new SymbolTableVisitor(this.globalST);
    this.stVisitor.visit(this.tree);
    this.semanticVisitor = new SemanticVisitor(this.globalST);
    this.semanticVisitor.visit(this.tree);
  }

  getErrors(includeParseErrors: boolean) {
    if (includeParseErrors) {
      this.stVisitor.addErrorList(this.addParseErrors(this.errorListener.getErrors()));
    }
    return this.stVisitor.getErrors().concat(this.semanticVisitor.getErrors());
  }

  getGeneralHoverInfo() {
    // let hoverContents: monaco.IMarkdownString[] = [];
    // let hoverInfo = monaco.languages.registerHoverProvider('antimony', {
    //   provideHover: (model, position) => {
    //     hoverContents = [];
    //     let valueOfHover: string = '';
    //     let valueOfAnnotation: string = '';
    //     const word = model.getWordAtPosition(position);
  
    //     // Check if word exists
    //     if (word) {
    //       // check if position range is in error and if it is, return error message
    //       // have to figure out entire position range of error first
    //       // if (errors.length > 0) {
    //       //   errors.forEach((error) => {
    //       //     valueOfHover += `Error: ${error} <br/>`; // Include error message in valueOfHover
    //       //     console.log(error);
    //       //   });
    //       // }
    //       // check if word exists in variables map and if it does, add information to valueOfHover
    //       if (variables.has(word.word)) {
    //         const variableInfo = variables.get(word.word);
    //         if (variableInfo?.modifiers) {
    //           switch (variableInfo?.modifiers) {
    //             case 'var':
    //               valueOfHover += `<span style="color:#BC96CA;">${variableInfo?.modifiers}</span> <br/> `;
    //               break;
    //             case 'const':
    //               valueOfHover += `<span style="color:#4954F5;">${variableInfo?.modifiers}</span> <br/> `;
    //               break;
    //             case 'formula':
    //               valueOfHover += `<span style="color:#8185C9;">${variableInfo?.modifiers}</span> <br/> `;
    //               break;
    //             case 'species':
    //               valueOfHover += `(<span style="color:#FD7F20;">Species</span>) ${word.word} <br/> `;
    //               break;
    //             default:
    //               break;
    //           }
    //         }
    //         // check if variableInfo exists and if it does, add information to valueOfHover
    //         if (variableInfo?.display) {
    //           valueOfHover += `<span style="color:#FD7F20;">${variableInfo?.display}</span> <br/> `;
    //         }
    //         // check if variableInfo exists and if it does, add information to valueOfHover
    //         if (variableInfo?.label) {
    //           switch (variableInfo?.label) {
    //             case 'Model':
    //               valueOfHover += `${word.word} <br/> `;
    //               break;
    //             case 'Reaction':
    //               valueOfHover += `(<span style="color:#4DC5B9;">${variableInfo?.label}</span>) ${word.word} <br/> `;
    //               break;
    //             case 'Compartment':
    //               valueOfHover += `(<span style="color:#BC96CA;">${variableInfo?.label}</span>) ${word.word} <br/> `;
    //               break;
    //             case 'Event':
    //               valueOfHover += `(<span style="color:#4954F5;">${variableInfo?.label}</span>) ${word.word} <br/> `;
    //               break;
    //             case 'Unit':
    //               valueOfHover += `(<span style="color:#4954F5;">${variableInfo?.label}</span>) ${word.word} <br/> `;
    //               break;
    //             default:
    //               break;
    //           }
    //         }
    //         // check if variableInfo exists and if it does, add information to valueOfHover
    //         if (variableInfo?.initialize) {
    //           valueOfHover += `Initialized Value: <span style="color:#DEF9CB;">${variableInfo?.initialize}</span> <br/> `;
    //         }
    //         // check if variableInfo exists and if it does, add information to valueOfHover
    //         if (variableInfo?.compartments) {
    //           valueOfHover += `In <span style="color:#BC96CA;">${'compartment'}</span>: ${variableInfo?.compartments} <br/> `;
    //         }
    //         // check if variableInfo exists and if it does, add information to valueOfAnnotation
    //         if (variableInfo?.annotations) {
    //           variableInfo?.annotations.forEach((annotation) => {
    //             valueOfAnnotation += `<span style="color:#f2ab7c;">${annotation.replace(/"/g, "")}</span> <br/> `;
    //           });
    //         }
    //       }
    //       // add valueOfHover and valueOfAnnotation to hoverContents
    //       hoverContents.push(
    //         { supportHtml: true,
    //           value:  valueOfHover });
    //       hoverContents.push(
    //         { supportHtml: true,
    //           value:  valueOfAnnotation });
    //       return {
    //         range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
    //         contents: hoverContents,
    //       };
    //     }
    //   },
    // });
  }

  private getVarInfoByIDsrcRange(id: string, srcRange: SrcRange) {
    // go through the ST, looking for this id and srcRange combo.

  }

  getAnnotations() {
    // do stuff
    
  }

  /**
 * takes the parse errors discovered and
 * returns each one in the same format as the other semantic errors
 * basically following the "ErrorUnderline" type
 * @param errors list of discovered parseErrors
 * @returns a list of ErrorUnderline's
 */
  private addParseErrors(errors: parseErrors[]): ErrorUnderline[] {
    let parseErrors = []
    for (let i = 0; i < errors.length; i++) {
      const line: number = errors[i].line;
      const column: number = errors[i].column + 1;
      const msg = errors[i].msg;
  
      let error = {
        startLineNumber: line,
        startColumn: column,
        endLineNumber: line,
        endColumn: column + 1,
        message: msg,
        severity: monaco.MarkerSeverity.Error
      }
      parseErrors.push(error);
    }
    return parseErrors;
  }

  private removeCarriageReturn(input: string): string {
    return input.replaceAll('\r','');
  }
}

/**
 * Error checks an antimony program, and returns all of the errors in an array.
 * @param antimonyCode string that is antimony program code to be error checked
 * @param includeParseErrors errors include parse errors if true, otherwise does not include. 
 *                           This is mostly for testing, as we do not need to test the parser.
 * @returns a list of errors that can be passed to monaco for display
 */
export function getErrors(antimonyCode: string, includeParseErrors: boolean): ErrorUnderline[] {
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
  // console.log(tree);
  
  // create and buildup a global symbol table from the parse tree.
  let globalSymbolTable: GlobalST = new GlobalST();
  // console.log(globalSymbolTable);
  const stVisitor: SymbolTableVisitor = new SymbolTableVisitor(globalSymbolTable);
  stVisitor.visit(tree);
  const semanticVisitor: SemanticVisitor = new SemanticVisitor(stVisitor.globalST);
  semanticVisitor.visit(tree);

  if (includeParseErrors) {
    stVisitor.addErrorList(addParseErrors(errorListener.getErrors()));
  }

  return stVisitor.getErrors().concat(semanticVisitor.getErrors());
}

/**
 * takes the parse errors discovered and
 * returns each one in the same format as the other semantic errors
 * basically following the "ErrorUnderline" type
 * @param errors list of discovered parseErrors
 * @returns a list of ErrorUnderline's
 */
function addParseErrors(errors: parseErrors[]): ErrorUnderline[] {
  let parseErrors = []
  for (let i = 0; i < errors.length; i++) {
    const line: number = errors[i].line;
    const column: number = errors[i].column + 1;
    const msg = errors[i].msg;

    let error = {
      startLineNumber: line,
      startColumn: column,
      endLineNumber: line,
      endColumn: column + 1,
      message: msg,
      severity: monaco.MarkerSeverity.Error
    }
    parseErrors.push(error);
  }
  return parseErrors;
}

export function removeCarriageReturn(input: string): string {
  return input.replaceAll('\r','');
}

export default ModelSemanticsChecker;