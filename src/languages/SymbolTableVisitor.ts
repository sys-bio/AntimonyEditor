import * as monaco from 'monaco-editor';
import { ANTLRErrorListener, ANTLRInputStream, CommonTokenStream, ParserRuleContext, RecognitionException, Recognizer } from 'antlr4ts';
import { AnnotationContext, AntimonyGrammarParser, AssignmentContext, Decl_itemContext, Decl_modifiersContext, DeclarationContext, EventContext, FunctionContext, In_compContext, Init_paramsContext, Is_assignmentContext, Modular_modelContext, NamemaybeinContext, ReactionContext, SpeciesContext, Species_listContext, Unit_declarationContext } from './antlr/AntimonyGrammarParser';
import { ModelContext } from './antlr/AntimonyGrammarParser'
import { AbstractParseTreeVisitor, ParseTree, TerminalNode } from 'antlr4ts/tree'
import { AntimonyGrammarVisitor } from './antlr/AntimonyGrammarVisitor';
import { SymbolTable, GlobalST, FuncST, ModelST} from './SymbolTableClasses';
import { Variable } from './Variable';
import { SrcPosition, SrcRange, getTypeFromString, varTypes } from './Types';



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

export class SymbolTableVisitor extends AbstractParseTreeVisitor<void> implements AntimonyGrammarVisitor<void> {
  public globalST: GlobalST;
  private errorList: ErrorUnderline[];
  
  // these keep track of scoping when traversing 
  // so we know to which ST to add a variable: 
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
   * returns a default STVariable info
   * 
   * this is fine as Parsetree since it is a superclass to ParserRuleContext, which is 
   * taken care of in getSrcRange
   * @param ctx 
   * @returns 
   */
  private getVarInfo(ctx: ParseTree): Variable {
    // let varInfo: Variable =  {
    //   type: '',
    //   initialized: false,
    //   initSrcRange: undefined,
    //   compartments: '',
    //   srcRange: this.getSrcRange(ctx)
    // }
    let varInfo:  Variable = new Variable(varTypes.Unknown, false, undefined, false, this.getSrcRange(ctx), undefined);
    return varInfo;
  }

  /**
   * given a node, finds the (startline, startcolumn), (endline, endcolumn).
   * TODO: fix this method!! wrong srcRange for assignements.
   *       Also just cleanup the code, it is terrible rn.
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
      endLineNumber:  idSrcRange.end.line,
      endColumn:  idSrcRange.end.column,
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

        // look for params
        let params: Init_paramsContext | undefined = ctx.init_params();

        if (params && params.children) {
          for (let i = 0; i < params.children.length; i += 2) {
            const paramInfo: Variable = this.getVarInfo(params.children[i]);
            const paramId: string = params.children[i].text;

            // we need to know what the params are if we want to
            // use this function anywhere.
            this.globalST.getFunctionST(funcName)?.params.push(paramId);
            this.globalST.getFunctionST(funcName)?.setVar(paramId, paramInfo);
          }
        }
      } else {
        // redeclared function, error
        const errorMessage: string = 'function \'' + funcName+ '\' already defined on line ' + 
                                      funcST.getPosition().start.toString();
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

  // lotsa repeat with visitModel, 
  // TODO: write some helper functions to reduce repeat code.
  visitModular_model(ctx: Modular_modelContext) {
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
        // model has not been declared yet
        this.globalST.setModel(modName,  modelIDsrcRange)
        
        // add init params to the model as Unknown types.
        const params: Init_paramsContext | undefined = ctx.init_params();
        if (params &&  params.children) {
          // only go over the ids, as we have id1,id2,id3,id4
          for (let i = 0; i < params.children.length; i += 2) {
            const paramInfo: Variable = this.getVarInfo(params.children[i]);
            const paramId: string = params.children[i].text;

            // we need to know what the params are if we want to
            // initialize this model as a variable somwewhere.
            this.globalST.getModelST(modName)?.params.push(paramId);
            this.globalST.getModelST(modName)?.setVar(paramId, paramInfo);
          }
        }

        // go through what is inside this model
        this.currNameAndScope = {name: modName, scope: "model"};
        for (let i = 0; i < ctx.children.length; i++) {
          this.visit(ctx.children[i]);
        }
        this.currNameAndScope = undefined;
      } else {
        // redeclared function, error
        // should make a function to return errorUnderlines.
        const errorMessage = 'model \'' + modName+ '\' already defined on line ' + 
                              modelST.getPosition().start.toString();
        let errorUnderline: ErrorUnderline = this.getErrorUnderline(this.getSrcRange(ctx), errorMessage, true);
        this.errorList.push(errorUnderline);
      }
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
        // model has not been declared yet
        this.globalST.setModel(modName,  modelIDsrcRange)

         // go through what is inside this model
        this.currNameAndScope = {name: modName, scope: "model"};
        for (let i = 0; i < ctx.children.length; i++) {
          this.visit(ctx.children[i]);
        }
        this.currNameAndScope = undefined;
      } else {
        // redeclared function, error
        // should make a function to return errorUnderlines.
        const errorMessage = 'model \'' + modName+ '\' already defined on line ' + 
                              modelST.getPosition().start.toString();
        let errorUnderline: ErrorUnderline = this.getErrorUnderline(this.getSrcRange(ctx), errorMessage, true);
        this.errorList.push(errorUnderline);
      }
    }
  }

  /**
   * main thing this does, any variable inside a reaction is being declared to be
   * a species type, this takes care of that. May need to add erroring.
   * @param ctx 
   */
  visitSpecies(ctx: SpeciesContext) {
    let varInfo: Variable = this.getVarInfo(ctx);
    varInfo.type = varTypes.Species;
    varInfo.initialized = false;

    let speciesName: string = ctx.text;
    // get the relevant ST
    const currST: SymbolTable | undefined = this.getCurrST();

    if (currST) {
      const existingVarInfo: Variable | undefined = currST.getVar(speciesName);
      if (existingVarInfo) {
        // var already exists in the ST
        // if (existingVarInfo.type !== varTypes.Species) {
        //   if (existingVarInfo.type === varTypes.Variable) {
        //     // variable case is special.
        //     existingVarInfo.type = varTypes.Species;
        //   } else {
        //     const errorMessage = "Unable to set the type to 'species' because " +
        //                        "it is already set to be the incompatible type '" +
        //                       existingVarInfo.type + "' on line " + 
        //                       existingVarInfo.idSrcRange.start.line + ":" + existingVarInfo.idSrcRange.start.column;
        //     const errorUnderline: ErrorUnderline = this.getErrorUnderline(varInfo.idSrcRange, errorMessage, true);
        //     this.errorList.push(errorUnderline);
        //   }
        // }
        if (existingVarInfo.canSetType(varTypes.Species)) {
          existingVarInfo.type = varTypes.Species;
        } else {
          const errorMessage = "Unable to set the type to 'species' because " +
                               "it is already set to be the incompatible type '" +
                              existingVarInfo.type + "' on line " + 
                              existingVarInfo.idSrcRange.start.toString();
          const errorUnderline: ErrorUnderline = this.getErrorUnderline(varInfo.idSrcRange, errorMessage, true);
          this.errorList.push(errorUnderline);
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

      // visit children first for convenience.
      for (let i = 0; i < ctx.children.length; i++) {
        this.visit(ctx.children[i]);
      }
      
      // figure out the type
      //const type: string = (ctx.children[0] as Decl_modifiersContext).text;
      const type: varTypes = getTypeFromString((ctx.children[0] as Decl_modifiersContext).text);

      // we are looping this way to only hit the Decl_itemContext nodes.
      for (let i = 1; i < ctx.children.length; i+=2) {
        const declItem: Decl_itemContext = ctx.children[i] as Decl_itemContext;
        const varName: string = declItem.namemaybein().var_name().text;
        const currSrcRange: SrcRange = this.getSrcRange(declItem);
        const currST: SymbolTable | undefined = this.getCurrST();
        let varInfo: Variable | undefined;
        if (currST) {
          varInfo = currST.getVar(varName);
        }

        // gauranteed to pass this check as children visited first.
        if (varInfo) {
          // TODO: in vscode-antimony, type overried takes precedence over value reassignement.
          // should this continue being the case, or should both cases be reported?
          // for now keep it as report both.

          if (varInfo.canSetType(type)) {
            varInfo.type = type;
          } else {
            // error! trying to overried previous type decl
            const errorMessage: string = "Unable to set the type to '" + type +
            "' because it is already set to be the incompatible type '"+ varInfo.type +
            "' on line " + 
            varInfo.idSrcRange.start.toString();
            const errorUnderline: ErrorUnderline = this.getErrorUnderline(currSrcRange, errorMessage, true);
            this.errorList.push(errorUnderline);
          }

          // 2) check if initialize node exists
          if (declItem.decl_assignment()) {
            // check if it is initialized.
            // varInfo gauranteed not undefined
            // as the children are visited first.
            if (varInfo.initialized) {
              // warning case! reinitalization!
              //
              // guaranteed to pass this check, maybe try and bundle varInfo.initialized and varInfo.initSrcRange
              // as one field would be better?
              if (varInfo.initSrcRange) {
                const errorMessage1: string = "Value assignment to '" + varName +
                                              "' is being overridden by a later assignment on line " +
                                              currSrcRange.start.toString();
                const errorUnderline1: ErrorUnderline = this.getErrorUnderline(varInfo.initSrcRange, errorMessage1, false);
                this.errorList.push(errorUnderline1);

                const errorMessage2: string = "Value assignment to '" + varName +
                                            "' is overriding previous assignment on line " +
                                            varInfo.initSrcRange.start.toString()
                const errorUnderline2: ErrorUnderline = this.getErrorUnderline(currSrcRange, errorMessage2, false);
                this.errorList.push(errorUnderline2);
              }

              varInfo.initSrcRange = currSrcRange;
            } else {
              varInfo.initialized = true;
              varInfo.initSrcRange = currSrcRange;
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
      const currSrcRange: SrcRange = this.getSrcRange(ctx);

      const currST: SymbolTable | undefined = this.getCurrST();

      if (currST) {
        let varInfo: Variable | undefined;
        // because we visit the children first, it is
        // gauranteed that the var is in the currST.
        if ((varInfo = currST.getVar(varName)) !== undefined) {
          if (varInfo.initialized) {
            // warning case! reinitalization!
            if (varInfo.initSrcRange) {
              const errorMessage1: string = "Value assignment to '" + varName +
                                            "' is being overridden by a later assignment on line " +
                                            currSrcRange.start.toString();
              const errorUnderline1: ErrorUnderline = this.getErrorUnderline(varInfo.initSrcRange, errorMessage1, false);
              this.errorList.push(errorUnderline1);

              const errorMessage: string = "Value assignment to '" + varName +
                                         "' is overriding previous assignment on line " +
                                         varInfo.initSrcRange.start.toString();
              const errorUnderline: ErrorUnderline = this.getErrorUnderline(currSrcRange, errorMessage, false);
              this.errorList.push(errorUnderline);
            }

            varInfo.initSrcRange = currSrcRange;
          } else {
            varInfo.initialized = true;
            varInfo.initSrcRange = currSrcRange;
          }
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
      let id1VarInfo: Variable = this.getVarInfo(ctx.var_name());
      id1VarInfo.type = varTypes.Variable;

      // check for case 2
      if (in_compCtx) {
        const id2: string = in_compCtx.var_name().text;
        // check if the compartment is already defined.
        let id2VarInfo: Variable | undefined = currST.getVar(id2)
        if (id2VarInfo) {
          // exists, check if it is a compartment
          // maybe make each type a global const?
          // if (id2VarInfo.type === varTypes.Compartment) {
          //   id1VarInfo.compartment = id2;
          // } else if (id2VarInfo.type === varTypes.Variable) {
          //   id2VarInfo.type = varTypes.Compartment;
          if (id2VarInfo.canSetType(varTypes.Compartment)) {
            id2VarInfo.type = varTypes.Compartment;
            id1VarInfo.compartment = id2;
          } else {
            //error, trying to say some value is in a noncompartment type
            const errorMessage: string = "Unable to set the type to 'compartment'" + 
                                         "because it is already set to be the incompatible type '"+
                                          id2VarInfo.type +"' on line " + 
                                          id2VarInfo.idSrcRange.start.toString();
            const errorUnderline = this.getErrorUnderline(this.getSrcRange(in_compCtx.var_name()), errorMessage, true);
            this.errorList.push(errorUnderline);
          }
        } else {
          // does not exist in ST yet, add as uninitialized compartment (default value).
          let id2VarInfo: Variable = this.getVarInfo(in_compCtx.var_name());
          id2VarInfo.type = varTypes.Compartment;

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