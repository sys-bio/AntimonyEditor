import * as monaco from 'monaco-editor';
import { ANTLRErrorListener, ANTLRInputStream, CommonTokenStream, ParserRuleContext, RecognitionException, Recognizer } from 'antlr4ts';
import { AntimonyGrammarLexer } from './antlr/AntimonyGrammarLexer';
import { AnnotationContext, AntimonyGrammarParser, AssignmentContext, Decl_itemContext, Decl_modifiersContext, DeclarationContext, EventContext, FunctionContext, In_compContext, Is_assignmentContext, NamemaybeinContext, ReactionContext, SpeciesContext, Species_listContext, Unit_declarationContext } from './antlr/AntimonyGrammarParser';
import { AntimonyGrammarListener } from './antlr/AntimonyGrammarListener'
import { ModelContext } from './antlr/AntimonyGrammarParser'
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'
import { AbstractParseTreeVisitor, ParseTree, TerminalNode } from 'antlr4ts/tree'
import { AntimonyGrammarVisitor } from './antlr/AntimonyGrammarVisitor';
import { SymbolTable, GlobalST, FuncST, ModelST, STVariableInfo, SrcPosition, SrcRange} from './SymbolTableClasses';
import { Context } from 'vm';
import { start } from 'repl';
import { error } from 'console';

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
  type scope = "model" | "mmodel" | "function";
  type nameAndScope = {name: string, scope: scope};
  type ErrorUnderline = {
    startLineNumber: number,
    startColumn: number,
    endLineNumber: number,
    endColumn: number,
    message: string,
    severity: monaco.MarkerSeverity.Warning | monaco.MarkerSeverity.Error
  }

  class SymbolTableVisitor extends AbstractParseTreeVisitor<void> implements AntimonyGrammarVisitor<void> {
    public globalST: GlobalST;
    private errorList: ErrorUnderline[];
    

    // these keep track of scoping when traversing so we know to which ST to add
    // a variable: 
    private currNameAndScope: nameAndScope | undefined;

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
     * returns a STVariable info
     * the returned is as follows
     *    type: ''
     *    initialized: false
     *    compartments: ''
     *    srcRange: the correct srcRange for the ctx.
     * 
     * @param ctx 
     * @returns 
     */
    private getVarInfo(ctx: ParserRuleContext): STVariableInfo {
      let varInfo: STVariableInfo =  {
        type: '',
        initialized: false,
        compartments: '',
        srcRange: this.getSrcRange(ctx)
      }
      return varInfo;
    }

    /**
     * given a node, finds the (startline, startcolumn), (endline, endcolumn).
     * TODO: fix this method!! wrong srcRange for assignements
     * @param ctx the parse tree node
     * @returns a SrcRange to represent the location range
     */
    private getSrcRange(ctx: ParseTree): SrcRange {
      if (ctx instanceof ParserRuleContext) {
        let startLine: number = ctx._start.line;
        let startColumn: number = ctx._start.charPositionInLine;
        let stopLine: number = -1;
        let stopColumn: number = -1;

        if (ctx._stop) {
          stopLine = ctx._stop.line;
          stopColumn = ctx._stop.charPositionInLine;
        } else {
          stopLine = startLine;
          stopColumn = startColumn;
        }

        if (stopLine === startLine && stopColumn === startColumn) {
          stopColumn += ctx.text.length;
        }

        let srcRange: SrcRange = {
          start: {
            line: startLine,
            column: startColumn + 1
          },
          stop: {
            line: stopLine,
            column: stopColumn + 1
          }
        }
        return srcRange;
      } else if (ctx instanceof TerminalNode) {
        let srcRange: SrcRange = {
          start: {
            line: ctx._symbol.line,
            column: ctx._symbol.charPositionInLine + 1
          },
          stop: {
            line: ctx._symbol.line,
            column: ctx._symbol.charPositionInLine + ctx.text.length + 1
          }
        }
        return srcRange;
      } else {
        let srcRange: SrcRange = {
          start: {
            line: 0,
            column: 0
          },
          stop: {
            line: 0,
            column: 0
          }
        }
        return srcRange;
      }
    }

    /**
     * returns the ST relevant to the current location
     * in the tree the traversal is at.
     * @returns either the symbol table or undefined (although it should never be undefined).
     */
    private getCurrST(): SymbolTable | undefined {
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
     * Creates a ErrorUnderline type to represent a distinct semantic error.
     * @param idSrcRange the line column range the error will give underline to
     * @param message the error message shown when hovering over idSrcRange
     * @param isError true if an error, false if a warning
     * @returns an ErrorUnderline that can be passed to monaco.editor.setModelMarkers()
     */
    private getErrorUnderline(idSrcRange: SrcRange, message: string, isError: boolean): ErrorUnderline {
      let severity = monaco.MarkerSeverity.Error;
      if (!isError) {
        severity = monaco.MarkerSeverity.Warning;
      }
      let errorUnderline: ErrorUnderline = {
        startLineNumber:  idSrcRange.start.line,
        startColumn:  idSrcRange.start.column,
        endLineNumber:  idSrcRange.stop.line,
        endColumn:  idSrcRange.stop.column,
        message: message,
        severity: severity
      }
      return errorUnderline;
    }
    
    visitFunction(ctx: FunctionContext) {
      if (ctx.children) {
        const funcName: string = ctx.children[1].text;
        const funcIDSrcRange: SrcRange = this.getSrcRange(ctx.children[1]);

        const funcST: FuncST | undefined = this.globalST.getFunctionST(funcName);
        if (!funcST){
          // func has not been declared yet
          this.globalST.setFunction(funcName, funcIDSrcRange)
        } else {
          // redeclared function, error
          const errorMessage: string = 'function \'' + funcName+ '\' already defined on line ' + 
                                        funcST.getPosition().start.line + ':' + 
                                        funcST.getPosition().start.column;
          let errorUnderline: ErrorUnderline = this.getErrorUnderline(funcIDSrcRange, errorMessage, true);
          this.errorList.push(errorUnderline);
        }


        // this can be a private function
        this.currNameAndScope = {name: funcName, scope: "function"};
        for (let i = 0; i < ctx.children.length; i++) {
          this.visit(ctx.children[i]);
        }
        this.currNameAndScope = undefined;
      }
    }

    visitModel(ctx: ModelContext) {
      if (ctx.children) {
        let idIndex = 1;
        let modName: string = ctx.children[idIndex].text;
        // take care of case where we have model *ID()
        if (modName === '*') {
          idIndex = 2;
          modName = ctx.children[idIndex].text;
        }
        const modelIDsrcRange: SrcRange = this.getSrcRange(ctx.children[idIndex]);

        const modelST: ModelST | undefined = this.globalST.getModelST(modName);
        if (!modelST){
          // func has not been declared yet
          this.globalST.setModel(modName,  modelIDsrcRange)
        } else {
          // redeclared function, error
          // should make a function to return errorUnderlines.
          const errorMessage = 'model \'' + modName+ '\' already defined on line ' + 
                                modelST.getPosition().start.line + ':' +
                                modelST.getPosition().start.column
          let errorUnderline: ErrorUnderline = this.getErrorUnderline(modelIDsrcRange, errorMessage, true);
          this.errorList.push(errorUnderline);
        }
        this.currNameAndScope = {name: modName, scope: "model"};
        for (let i = 0; i < ctx.children.length; i++) {
          this.visit(ctx.children[i]);
        }
        this.currNameAndScope = undefined;
      }
    }

    /**
     * main thing this does, any variable inside a reaction is being declared to be
     * a species type, this takes care of that. May need to add erroring.
     * @param ctx 
     */
    visitSpecies(ctx: SpeciesContext) {
      let varInfo: STVariableInfo = this.getVarInfo(ctx);
      varInfo.type = "species";
      varInfo.initialized = false;

      let speciesName: string = ctx.text;
      // get the relevant ST
      const currST: SymbolTable | undefined = this.getCurrST();

      if (currST) {
        const existingVarInfo: STVariableInfo | undefined = currST.getVar(speciesName);
        if (existingVarInfo) {
          // var already exists in the ST
          if (existingVarInfo.type !== "species") {
            if (existingVarInfo.type === "variable") {
              // variable case is special.
              existingVarInfo.type = "species";
            } else {
              const errorMessage = "Unable to set the type to 'species' because " +
                                 "it is already set to be the incompatible type '" +
                                existingVarInfo.type + "' on line " + 
                                existingVarInfo.srcRange.start.line + ":" + existingVarInfo.srcRange.start.column;
              const errorUnderline: ErrorUnderline = this.getErrorUnderline(varInfo.srcRange, errorMessage, true);
              this.errorList.push(errorUnderline);
            }
          }
        } else {
          // var does not exist, insert into ST
          currST.setVar(speciesName, varInfo);
        }
      } else {
        // fail fast!
        console.error("could not find symbol table in visit species!");
      }
    }

    visitDeclaration(ctx: DeclarationContext) {
      // grammar def: declaration : decl_modifiers decl_item (',' decl_item)*;
      if (ctx.children) {
        // we visit the children first, since decl_itm is defined as
        // decl_item : namemaybein (decl_assignment)?;
        // and visiting namemaybein will add variable to the ST.
        // 
        // something like this is valid: "species B = 1, C = 2, D = 3;"
        for (let i = 0; i < ctx.children.length; i++) {
          this.visit(ctx.children[i]);
        }
        
        // figure out the type
        const type: string = (ctx.children[0] as Decl_modifiersContext).text;

        // we are looping this way to only hit the Decl_itemContext nodes.
        for (let i = 1; i < ctx.children.length; i+=2) {
          const declItem: Decl_itemContext = ctx.children[i] as Decl_itemContext;
          const varName: string = declItem.namemaybein().var_name().text;
          const errorSrcRange: SrcRange = this.getSrcRange(declItem);
          const currST: SymbolTable | undefined = this.getCurrST();
          let varInfo: STVariableInfo | undefined;
          if (currST) {
            varInfo = currST.getVar(varName);
          }

          // gauranteed to pass this check as children visited first.
          if (varInfo) {
            // TODO: in vscode-antimony, type overried takes precedence over value reassignement.
            // should this continue being the case, or should both cases be reported?
            // for now keep it as report both.

            // 1) check that the type is not overriding previous decl
            if (varInfo.type !== type) {
              if (varInfo.type === "variable") {
                varInfo.type = type;
              } else {
                // error! trying to overried previous type decl
                const errorMessage: string = "Unable to set the type to '" + type +
                                            "' because it is already set to be the incompatible type '"+ varInfo.type +
                                            "' on line " + 
                                            varInfo.srcRange.start.line + ":" + varInfo.srcRange.start.column;
                const errorUnderline: ErrorUnderline = this.getErrorUnderline(errorSrcRange, errorMessage, true);
                this.errorList.push(errorUnderline);
              }
            }

            // 2) check if initialize node exists
            if (declItem.decl_assignment()) {
              // check if it is initialized.
              // varInfo gauranteed not undefined
              // as the children are visited first.
              if (varInfo.initialized) {
                // warning case! reinitalization!
                const errorMessage: string = "Value assignment to '" + varName +
                "'' is overriding previous assignment on line " +
                varInfo.srcRange.start.line + ":" + varInfo.srcRange.start.column;
                const errorUnderline: ErrorUnderline = this.getErrorUnderline(errorSrcRange, errorMessage, false);
                this.errorList.push(errorUnderline);
              } else {
                varInfo.initialized = true;
              }
            }
          }

        }
      }
    }

    visitAssignment(ctx: AssignmentContext) {
      if (ctx.children) {
        for (let i = 0; i < ctx.children.length; i++) {
          this.visit(ctx.children[i]);
        }

        // now record the assigned variable as assigned.
        const nmbi: NamemaybeinContext = ctx.children[0] as NamemaybeinContext;
        const varName: string = nmbi.var_name().text;
        const errorSrcRange: SrcRange = this.getSrcRange(ctx);

        const currST: SymbolTable | undefined = this.getCurrST();

        if (currST) {
          let varInfo: STVariableInfo | undefined;
          // because we visit the children first, it is
          // gauranteed that the var is in the currST.
          if ((varInfo = currST.getVar(varName)) !== undefined) {
            if (varInfo.initialized) {
              // warning case! reinitalization!
              const errorMessage: string = "Value assignment to '" + varName +
                                           "'' is overriding previous assignment on line " +
                                           varInfo.srcRange.start.line + ":" + varInfo.srcRange.start.column;
              const errorUnderline: ErrorUnderline = this.getErrorUnderline(errorSrcRange, errorMessage, false);
              this.errorList.push(errorUnderline);
            } else {
              varInfo.initialized = true;
            }
          } else {
            // insert into ST?
            // not here, since children node visits will insert initial type
            // correctly.
          }
        }
      }
    }

    /**
     * Handles the cases: check .g4 file fill this part in
     * 
     * This method SHOULD NOT error when compartment does not exist!
     * That is an error that should be taken care of by semantic checking!!! 
     * DO NOT do more that is needed for the symbol table!!
     * @param ctx 
     */
    visitNamemaybein(ctx: NamemaybeinContext) {
      // ID case 1
      // here if ID already exists in ST than no more to be done, 
      // if ID does not exist than it is added as a variable type.
      
      // ID in ID2 case 2
      // here if ID2 does not exist, assume it is a compartment
      // if ID2 does exist, it must be of type compartment.

      const id1: string = ctx.var_name().text;
      const in_compCtx: In_compContext | undefined = ctx.in_comp();

      // case 1, we will always deal with ID
      const currST: SymbolTable | undefined = this.getCurrST();

      if (!currST) {
        // wait what happens here?
        // there should always be a valid ST, as it is either global or not.
        // so nothing should happen here.
      } else {
        // create a STVarInfo
        // we initialize as a variable before further info is known.
        let id1VarInfo: STVariableInfo = this.getVarInfo(ctx.var_name());
        id1VarInfo.type = 'variable';

        // check for case 2
        if (in_compCtx) {
          const id2: string = in_compCtx.var_name().text;
          // check if the compartment is already defined.
          let id2VarInfo: STVariableInfo | undefined = currST.getVar(id2)
          if (id2VarInfo) {
            // exists, check if it is a compartment
            // maybe make each type a global const?
            if (id2VarInfo.type === "compartment") {
              id1VarInfo.compartments = id2;
            } else if (id2VarInfo.type === "variable") {
              id2VarInfo.type = "compartment";
            } else {
              //error, trying to say some value is in a noncompartment type
              const errorMessage: string = "Unable to set the type to 'compartment'" + 
                                           "because it is already set to be the incompatible type '"+
                                            id2VarInfo.type +"' on line " + 
                                            id2VarInfo.srcRange.start.line + ":" + 
                                            id2VarInfo.srcRange.start.column;
              const errorUnderline = this.getErrorUnderline(this.getSrcRange(in_compCtx.var_name()), errorMessage, true);
              this.errorList.push(errorUnderline);
            }
          } else {
            // does not exist in ST yet, add as uninitialized compartment (default value).
            let id2VarInfo: STVariableInfo = this.getVarInfo(in_compCtx.var_name());
            id2VarInfo.type = 'compartment';

            currST.setVar(id2, id2VarInfo);

            // we do NOT error for unitialization! that will be taken care of
            // by the semantic visitor!
          }
        }

        // case 1
        // ST exists, check if var is already recorded.
        // if not, then add var to ST as a variable
        if (!currST.getVar(id1)) {
          // set the var in the ST
          currST.setVar(id1, id1VarInfo);
        }
      }
    }
  }

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