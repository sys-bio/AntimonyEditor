import * as monaco from 'monaco-editor';
import { AbstractParseTreeVisitor, ParseTree, TerminalNode } from 'antlr4ts/tree'
import { AntimonyGrammarVisitor } from './antlr/AntimonyGrammarVisitor';
import { GlobalST, SymbolTable} from './SymbolTableClasses';
import { ErrorUnderline, SrcPosition, SrcRange } from './Types';
import { ParserRuleContext } from 'antlr4ts';
import { FunctionContext, ModelContext, Modular_modelContext } from './antlr/AntimonyGrammarParser';

export class ErrorVisitor extends AbstractParseTreeVisitor<void> implements AntimonyGrammarVisitor<void> {
  public globalST: GlobalST;
  protected errorList: ErrorUnderline[];
  
  // these keep track of scoping when traversing 
  // so we know to which ST to add a variable: 
  protected currNameAndScope: ErrorVisitor.nameAndScope | undefined;

  constructor(globalST: GlobalST) {
    super();
    this.globalST = globalST;
    this.currNameAndScope = undefined;
    this.errorList = [];
  }

  protected defaultResult(): void {
  }

  /**
   * gets the list of accumulated errors
   * @returns 
   */
  public getErrors(): ErrorUnderline[] {
    return this.errorList;
  }

  /**
   * concats the input error list with the one present within the visitor
   * @param errors 
   */
  public addErrorList(errors: ErrorUnderline[]) {
    this.errorList = this.errorList.concat(errors);
  }

    /**
   * Creates a ErrorUnderline type to represent a distinct semantic error.
   * @param idSrcRange the line column range the error will give underline to
   * @param message the error message shown when hovering over idSrcRange
   * @param isError true if an error, false if a warning
   * @returns an ErrorUnderline that can be passed to monaco.editor.setModelMarkers()
   */
  protected getErrorUnderline(idSrcRange: SrcRange, message: string, isError: boolean): ErrorUnderline {
    let severity = monaco.MarkerSeverity.Error;
    if (!isError) {
      severity = monaco.MarkerSeverity.Warning;
    }
    let errorUnderline: ErrorUnderline = {
      startLineNumber:  idSrcRange.start.line,
      startColumn:  idSrcRange.start.column,
      endLineNumber:  idSrcRange.end.line,
      endColumn:  idSrcRange.end.column,
      message: message,
      severity: severity
    }
    return errorUnderline;
  }

  /**
 * returns the ST relevant to the current location
 * in the tree the traversal is at.
 * @returns either the symbol table or undefined (although it should never be undefined).
 */
  protected getCurrST(): SymbolTable | undefined {
    let currST: SymbolTable | undefined = undefined;
    if (this.currNameAndScope) {
      // get the ST (this really needs to be a private function lol)
      if (this.currNameAndScope.scope === "model") {
        // make sure that this the symbol table this var is in exists
        currST = this.globalST.getModelST(this.currNameAndScope.name);
      } else  if (this.currNameAndScope.scope === "mmodel")  {
        // TODO: take care of mmodels
      } else {
        // function
        currST = this.globalST.getFunctionST(this.currNameAndScope.name);
      }
    } else {
      // this.currNameAndScope is undefined, outermost scope
      currST = this.globalST;
    }
    
    return currST;
  }

  /**
 * given a node, finds the (startline, startcolumn), (endline, endcolumn).
 * TODO: fix this method!! wrong srcRange for assignements.
 *       Also just cleanup the code, it is terrible rn.
 * @param ctx the parse tree node
 * @returns a SrcRange to represent the location range
 */
  protected getSrcRange(ctx: ParseTree): SrcRange {
    if (ctx instanceof ParserRuleContext) {
      let startLine: number = ctx._start.line;
      let startColumn: number = ctx._start.charPositionInLine;
      let stopLine: number = -1;
      let stopColumn: number = -1;

      if (ctx._stop) {
        stopLine = ctx._stop.line;
        stopColumn = ctx._stop.charPositionInLine + 1;
      } else {
        stopLine = startLine;
        stopColumn = startColumn + 1;
      }

      if (stopLine === startLine && stopColumn === startColumn + 1) {
        stopColumn += ctx.text.length - 1;
      }

      let srcRange: SrcRange = new SrcRange(new SrcPosition(startLine, startColumn+1), 
                                            new SrcPosition(stopLine, stopColumn+1));
      return srcRange;
    } else if (ctx instanceof TerminalNode) {

      let start: SrcPosition = new SrcPosition(ctx._symbol.line, ctx._symbol.charPositionInLine + 1);
      let end: SrcPosition = new SrcPosition(ctx._symbol.line, ctx._symbol.charPositionInLine + ctx.text.length + 1);
      let srcRange: SrcRange = new SrcRange(start, end);

      return srcRange;
    } else {

      let srcRange: SrcRange = new SrcRange(new SrcPosition(0, 0), new SrcPosition(0, 0));
      return srcRange;
    }
  }

  /**
 * checks for the $varName case, 
 * returns just the varname
 * @param id 
 */
  protected getVarName(id: string): string {
    if (id.length === 0) {
      return id;
    }

    if (id.charAt(0) === '$') {
      return id.slice(1);
    }

    return id;
  }

  /**
   * 
   * @param name the name of the function or model scope
   * @param ctx 
   * @param scope either "function" or "model"
   */
  protected setScopeVisitChildren(name: string, ctx: ModelContext | FunctionContext | Modular_modelContext, scope: ErrorVisitor.scope) {
    if (ctx.children) {
      this.currNameAndScope = {name: name, scope: scope};
      for (let i = 0; i < ctx.children.length; i++) {
        this.visit(ctx.children[i]);
      }
      this.currNameAndScope = undefined;
    }
  }
}



module ErrorVisitor {
  export type scope = "model" | "mmodel" | "function";
  export type nameAndScope = {name: string, scope: scope};
}