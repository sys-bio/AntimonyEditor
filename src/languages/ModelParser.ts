import * as monaco from 'monaco-editor';
import { ANTLRErrorListener, ANTLRInputStream, CommonTokenStream, ParserRuleContext, RecognitionException, Recognizer } from 'antlr4ts';
import { AntimonyGrammarLexer } from './antlr/AntimonyGrammarLexer';
import { AnnotationContext, AntimonyGrammarParser, AssignmentContext, DeclarationContext, EventContext, FunctionContext, In_compContext, Is_assignmentContext, NamemaybeinContext, ReactionContext, SpeciesContext, Species_listContext, Unit_declarationContext } from './antlr/AntimonyGrammarParser';
import { AntimonyGrammarListener } from './antlr/AntimonyGrammarListener'
import { ModelContext } from './antlr/AntimonyGrammarParser'
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'
import { AbstractParseTreeVisitor, ParseTree, TerminalNode } from 'antlr4ts/tree'
import { AntimonyGrammarVisitor } from './antlr/AntimonyGrammarVisitor';
import { SymbolTable, GlobalST, FuncST, ModelST, STVariableInfo, SrcPosition, SrcRange} from './SymbolTableClasses';
import { Context } from 'vm';
import { start } from 'repl';

class VariableInfo {
  label?: string;
  modifiers?: string;
  initialize?: string;
  display?: string;
  compartments?: string;
  annotations?: string[] = [];
}

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

const ModelParser = (editor: monaco.editor.IStandaloneCodeEditor, hoverExists: boolean) => {
  // Create the lexer and parser
  let inputStream = new ANTLRInputStream(editor.getValue());
  let lexer = new AntimonyGrammarLexer(inputStream);
  let tokenStream = new CommonTokenStream(lexer);
  let parser = new AntimonyGrammarParser(tokenStream);

  // Create custom error listener
  const errorListener = new ErrorListener();
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  // Parse the input, where `compilationUnit` is whatever entry point you defined
  let tree = parser.root();

  var variables: Map<string, VariableInfo> = new Map<string, VariableInfo>();

  var annotatedVar: string[] = [];

  class AntimonySyntax implements AntimonyGrammarListener {
    // Add the following method to capture parse errors
    syntaxError<T>(
      recognizer: Recognizer<T, any>,
      offendingSymbol: T,
      line: number,
      charPositionInLine: number,
      msg: string,
      e: RecognitionException | undefined
    ): void {
      console.error(`Parse error at Line ${line}:${charPositionInLine} - ${msg}`);
    }

    enterModel(ctx: ModelContext) {
      const modelName = ctx.NAME().text; // Get the model name
      const modelInfo = new VariableInfo();

      let variable = variables.get(modelName);
      if (!variable) {
        modelInfo.label = 'Model';
        variables.set(modelName, modelInfo);
      } else {
        variable.label = 'Model';
      }
    };

    enterSpecies(ctx: SpeciesContext) {
      const speciesInfo = new VariableInfo();
      speciesInfo.label = 'Species';

      let variable = variables.get(ctx.text);

      if (!variable) {
        variables.set(ctx.text, speciesInfo);
      } else {
        variable.label = 'Species';
      }
    };

    enterReaction (ctx: ReactionContext) {
        const reactionName = ctx.reaction_name()?.namemaybein().text; // Get reaction name
        const reactionInfo = new VariableInfo();

      if (reactionName) {
        let variable = variables.get(reactionName);

        if (!variable) {
          reactionInfo.label = 'Reaction'
          variables.set(reactionName, reactionInfo)
        } else {
          variable.label = 'Reaction';
        }
      }
    };

    enterDeclaration (ctx: DeclarationContext) {
      const varType = ctx.decl_modifiers().text; // Get modifier
      if (varType == 'compartment') {
        ctx.decl_item().forEach((item) => {
          const varName = item.namemaybein().var_name().text; // Get variable name
          let variable = variables.get(varName);
          if (variable) {
            variable.label = 'Compartment';
          } else {
            let variableInfo = new VariableInfo();
            variableInfo.label = 'Compartment';
            variables.set(varName, variableInfo);
          }
        });
      }

      ctx.decl_item().forEach((item) => {
        const varName = item.namemaybein().var_name().text; // Get variable name
        let variable = variables.get(varName);
        if (variable) {
          variable.modifiers = varType;
        } else {
          let variableInfo = new VariableInfo();
          variableInfo.modifiers = varType;
          variables.set(varName, variableInfo);
        }
      });
    };

    enterAssignment (ctx: AssignmentContext) {
      const varName = ctx.namemaybein().var_name().text; // Get variable name
      const varAssignment = ctx.sum().text; // Get assignment
      let variable = variables.get(varName);
      if (variable && varAssignment) {
        variable.initialize = varAssignment;
      } else if (!variable && varAssignment) {
        let variableInfo = new VariableInfo();
        variableInfo.initialize = varAssignment;
        variables.set(varName, variableInfo);
      }
    };

    enterEvent (ctx: EventContext) {
      const eventName = ctx.reaction_name()?.namemaybein().text; // Get variable name
      if (eventName) {
        let variable = variables.get(eventName);
        if (variable) {
          variable.label = 'Event';
        } else {
          let variableInfo = new VariableInfo();
          variableInfo.label = 'Event';
          variables.set(eventName, variableInfo);
        }
      }
    }

    enterUnit_declaration (ctx: Unit_declarationContext) {
      const varName = ctx.var_name().text; // Get variable name
      const varSum = ctx.sum().text; // Get sum
      let variable = variables.get(varName);
      if (variable && varSum) {
        variable.initialize = varSum;
        variable.label = 'Unit';
        variable.modifiers = 'unit';
      } else if (!variable && varSum) {
        let variableInfo = new VariableInfo();
        variableInfo.initialize = varSum;
        variableInfo.label = 'Unit';
        variableInfo.modifiers = 'unit';
        variables.set(varName, variableInfo);
      }
    };

    enterNamemaybein(ctx: NamemaybeinContext) {
      const varName = ctx.var_name().text; // Get the species name
      const compartmentCtx = ctx.in_comp();
      const compartment = compartmentCtx ? compartmentCtx.var_name().text : undefined; // Get compartment

      let variable = variables.get(varName);

      if (variable && compartment) {
        variable.compartments = compartment;
      } else if (!variable && compartment) {
        const variableInfo = new VariableInfo();
        variableInfo.compartments = compartment;
        variables.set(varName, variableInfo);
      }
    }

    enterIs_assignment (ctx: Is_assignmentContext) {
      const varName = ctx.NAME().text; // Get the species name
      const display = ctx.ESCAPED_STRING().text; // Get the display

      let variable = variables.get(varName);

      if (variable && display) {
        variable.display = display;
      } else if (!variable && display) {
        const variableInfo = new VariableInfo();
        variableInfo.display = display;
        variables.set(varName, variableInfo);
      }
    };

    enterAnnotation(ctx: AnnotationContext) {
      const varName = ctx.var_name().text; // Get the species name
      const annotationlink = ctx.ESCAPED_STRING().text; // Get the annotation

      if (annotatedVar.includes(varName)) {
        return;
      } else {
        annotatedVar.push(varName);
      }

      let variable = variables.get(varName);
      if (variable) {
        variable.annotations?.push(annotationlink);
      } else {
        const annotationInfo = new VariableInfo();
        annotationInfo.annotations?.push(annotationlink);
        variables.set(varName, annotationInfo);
      }
    };
  }
  // console.log(variables);
  // // printing the tree for debugging purposes
  // console.log(tree);

  // type scope = "model" | "mmodel" | "function";
  // type nameAndScope = {name: string, scope: scope};
  // type ErrorUnderline = {
  //   startLineNumber: number,
  //   startColumn: number,
  //   endLineNumber: number,
  //   endColumn: number,
  //   message: string,
  //   severity: monaco.MarkerSeverity.Warning | monaco.MarkerSeverity.Error
  // }

  // class SymbolTableVisitor extends AbstractParseTreeVisitor<void> implements AntimonyGrammarVisitor<void> {
  //   public globalST: GlobalST;
  //   private errorList: ErrorUnderline[];
    

  //   // these keep track of scoping when traversing so we know to which ST to add
  //   // a variable: 
  //   private currNameAndScope: nameAndScope | undefined;

  //   constructor(globalST: GlobalST) {
  //     super();
  //     this.globalST = globalST;
  //     this.currNameAndScope = undefined;
  //     this.errorList = [];
  //   }

  //   protected defaultResult(): void {
  //   }

  //   /**
  //    * gets the list of accumulated errors
  //    * @returns 
  //    */
  //   public getErrors(): ErrorUnderline[] {
  //     return this.errorList;
  //   }

  //   private getVarInfo(ctx: ParserRuleContext): STVariableInfo {
  //     let varInfo: STVariableInfo =  {
  //       type: '',
  //       initialized: false,
  //       compartments: '',
  //       srcRange: this.getSrcRange(ctx)
  //     }
  //     return varInfo;
  //   }

  //   /**
  //    * given a node, finds the (startline, startcolumn), (endline, endcolumn).
  //    * @param ctx the parse tree node
  //    * @returns a SrcRange to represent the location range
  //    */
  //   private getSrcRange(ctx: ParseTree): SrcRange {
  //     if (ctx instanceof ParserRuleContext) {
  //       let startLine: number = ctx._start.line;
  //       let startColumn: number = ctx._start.charPositionInLine;
  //       let stopLine: number = -1;
  //       let stopColumn: number = -1;

  //       if (ctx._stop) {
  //         stopLine = ctx._stop.line;
  //         stopColumn = ctx._stop.charPositionInLine;
  //       } else {
  //         stopLine = startLine;
  //         stopColumn = startColumn;
  //       }

  //       if (stopLine === startLine && stopColumn === startColumn) {
  //         stopColumn += ctx.text.length;
  //       }

  //       let srcRange: SrcRange = {
  //         start: {
  //           line: startLine,
  //           column: startColumn + 1
  //         },
  //         stop: {
  //           line: stopLine,
  //           column: stopColumn + 1
  //         }
  //       }
  //       return srcRange;
  //     } else if (ctx instanceof TerminalNode) {
  //       let srcRange: SrcRange = {
  //         start: {
  //           line: ctx._symbol.line,
  //           column: ctx._symbol.charPositionInLine + 1
  //         },
  //         stop: {
  //           line: ctx._symbol.line,
  //           column: ctx._symbol.charPositionInLine + ctx.text.length + 1
  //         }
  //       }
  //       return srcRange;
  //     } else {
  //       let srcRange: SrcRange = {
  //         start: {
  //           line: 0,
  //           column: 0
  //         },
  //         stop: {
  //           line: 0,
  //           column: 0
  //         }
  //       }
  //       return srcRange;
  //     }
  //   }

  //   /**
  //    * Creates a ErrorUnderline type to represent a distinct semantic error.
  //    * @param idSrcRange the line column range the error will give underline to
  //    * @param message the error message shown when hovering over idSrcRange
  //    * @param isError true if an error, false if a warning
  //    * @returns an ErrorUnderline that can be passed to monaco.editor.setModelMarkers()
  //    */
  //   private getErrorUnderline(idSrcRange: SrcRange, message: string, isError: boolean): ErrorUnderline {
  //     let severity = monaco.MarkerSeverity.Error;
  //     if (!isError) {
  //       severity = monaco.MarkerSeverity.Warning;
  //     }
  //     let errorUnderline: ErrorUnderline = {
  //       startLineNumber:  idSrcRange.start.line,
  //       startColumn:  idSrcRange.start.column,
  //       endLineNumber:  idSrcRange.stop.line,
  //       endColumn:  idSrcRange.stop.column,
  //       message: message,
  //       severity: severity
  //     }
  //     return errorUnderline;
  //   }
    
  //   visitFunction(ctx: FunctionContext) {
  //     if (ctx.children) {
  //       const funcName: string = ctx.children[1].text;
  //       const funcIDSrcRange: SrcRange = this.getSrcRange(ctx.children[1]);

  //       const funcST: FuncST | undefined = this.globalST.getFunctionST(funcName);
  //       if (!funcST){
  //         // func has not been declared yet
  //         this.globalST.setFunction(funcName, funcIDSrcRange)
  //       } else {
  //         // redeclared function, error
  //         const errorMessage: string = 'function \'' + funcName+ '\' already defined on line ' + 
  //                                       funcST.getPosition().start.line + ':' + 
  //                                       funcST.getPosition().start.column;
  //         let errorUnderline: ErrorUnderline = this.getErrorUnderline(funcIDSrcRange, errorMessage, true);
  //         this.errorList.push(errorUnderline);
  //       }


  //       // this can be a private function
  //       this.currNameAndScope = {name: funcName, scope: "function"};
  //       for (let i = 0; i < ctx.children.length; i++) {
  //         this.visit(ctx.children[i]);
  //       }
  //       this.currNameAndScope = undefined;
  //     }
  //   }

  //   visitModel(ctx: ModelContext) {
  //     if (ctx.children) {
  //       let idIndex = 1;
  //       let modName: string = ctx.children[idIndex].text;
  //       // take care of case where we have model *ID()
  //       if (modName === '*') {
  //         idIndex = 2;
  //         modName = ctx.children[idIndex].text;
  //       }
  //       const modelIDsrcRange: SrcRange = this.getSrcRange(ctx.children[idIndex]);

  //       const modelST: ModelST | undefined = this.globalST.getModelST(modName);
  //       if (!modelST){
  //         // func has not been declared yet
  //         this.globalST.setModel(modName,  modelIDsrcRange)
  //       } else {
  //         // redeclared function, error
  //         // should make a function to return errorUnderlines.
  //         const errorMessage = 'model \'' + modName+ '\' already defined on line ' + 
  //                               modelST.getPosition().start.line + ':' +
  //                               modelST.getPosition().start.column
  //         let errorUnderline: ErrorUnderline = this.getErrorUnderline(modelIDsrcRange, errorMessage, true);
  //         this.errorList.push(errorUnderline);
  //       }
  //       this.currNameAndScope = {name: modName, scope: "model"};
  //       for (let i = 0; i < ctx.children.length; i++) {
  //         this.visit(ctx.children[i]);
  //       }
  //       this.currNameAndScope = undefined;
  //     }
  //   }

  //   visitSpecies(ctx: SpeciesContext) {
  //     let varInfo: STVariableInfo = this.getVarInfo(ctx);
  //     varInfo.type = "species";
  //     varInfo.initialized = false;

  //     let speciesName: string = ctx.text;
  //     if (this.currNameAndScope) {

  //       const scopeType: scope = this.currNameAndScope.scope;
  //       const name: string = this.currNameAndScope.name;

  //       if (scopeType === "function") {
  //         // actually this will never appear in a function
  //         this.globalST.getFunctionST(name)?.setVar(speciesName, varInfo);
  //       } else if (scopeType === "model") {
  //         this.globalST.getModelST(name)?.setVar(speciesName, varInfo);
  //       } else {

  //       }
  //     } else {
  //       this.globalST.setVar(speciesName, varInfo);
  //     }
  //   }

  //   visitDeclaration(ctx: DeclarationContext) {
  //     console.log("declaration " + ctx.text);
  //   }

  //   visitAssignment(ctx: AssignmentContext) {
  //     if (ctx.children) {
  //       for (let i = 0; i < ctx.children.length; i++) {
  //         this.visit(ctx.children[i]);
  //       }
  //     }
  //   }

  //   visitNamemaybein(ctx: NamemaybeinContext) {
  //     // ID case 1
  //     // here if ID already exists in ST than no more to be done, 
  //     // if ID does not exist than it is added as a variable type.
      
  //     // ID in ID2 case 2
  //     // here if ID2 does not exist, assume it is a compartment
  //     // if ID2 does exist, it must be of type compartment.

  //     const id1: string = ctx.var_name().text;
  //     const in_compCtx: In_compContext | undefined = ctx.in_comp();

  //     // case 1, we will always deal with ID
  //     let currST: SymbolTable | undefined;
      
  //     // get the ST to add var to.
  //     // this can probably be a private function
  //     if (this.currNameAndScope?.scope === "model") {
  //       // make sure that this the symbol table this var is in exists
  //       currST = this.globalST.getModelST(this.currNameAndScope?.name);
  //     } else  if (this.currNameAndScope?.scope === "mmodel")  {
  //       // TODO: take care of mmodels
  //     } else {
  //       // this.currNameAndScope is undefined, outermost scope
  //       currST = this.globalST;
  //     } 

  //     if (!currST) {
  //       // wait what happens here?
  //       // there should always be a valid ST, as it is either global or not.
  //       // so nothing should happen here.
  //     } else {
  //       // create a STvarInfo
  //       // we initialize as a variable before further info is known.
  //       let id1VarInfo: STVariableInfo = {
  //         type: 'variable',
  //         initialized: false,
  //         compartments: '',
  //         srcRange: this.getSrcRange(ctx.var_name())
  //       }

  //       // take care of adding var to ST if needed.
  //       // check for case 2
  //       if (in_compCtx) {
  //         const id2: string = in_compCtx.var_name().text;
  //         // check if the comparment is already defined.
  //         let id2VarInfo: STVariableInfo | undefined = currST.getVar(id2)
  //         if (id2VarInfo) {
  //           // exists, check if it is a compartment
  //           if (id2VarInfo.type === "compartment") {
  //             // modify id1VarInfo
  //             id1VarInfo.compartments = id2;
  //           } else {
  //             // error, trying to say some value is in a noncompartment type
  //             const errorMessage: string = "replace with compartment error message"; // TODO figure out a good error message here
  //             const errorUnderline = this.getErrorUnderline(this.getSrcRange(in_compCtx.var_name()), errorMessage, true);
  //             this.errorList.push(errorUnderline);
  //           }
  //         } else {
  //           // does not exist in ST yet, add as uninitialized compartment (default value).
  //           let id2VarInfo: STVariableInfo = {
  //             type: 'compartment',
  //             initialized: false,
  //             compartments: '',
  //             srcRange: this.getSrcRange(in_compCtx.var_name())
  //           }
  //           currST.setVar(id2, id2VarInfo);
            
  //           // warn that compartment is unitialized.
  //           const errorMessage: string = "Compartment '"+ id2 + "' has not been initialized, using default value"; // TODO figure out a good error message here
  //           const errorUnderline = this.getErrorUnderline(this.getSrcRange(in_compCtx.var_name()), errorMessage, false);
  //           this.errorList.push(errorUnderline);
  //         }
  //       }

  //       // case 1
  //       // ST exists, check if var is already recorded.
  //       // if not, then add var to ST as a variable
  //       if (!currST.getVar(id1)) {
  //         // set the var in the ST
  //         currST.setVar(id1, id1VarInfo);
  //       }
  //     }
  //   }
  // }


  // // create and buildup a global symbol table from the parse tree.
  // let globalSymbolTable: GlobalST = new GlobalST();
  // const stVisitor: SymbolTableVisitor = new SymbolTableVisitor(globalSymbolTable);
  // stVisitor.visit(tree);
  // console.log(stVisitor.globalST);
  // //this is how to add error squiglies 
  // let model: monaco.editor.ITextModel | null = editor.getModel();
  // if (model !== null) {
  //   monaco.editor.setModelMarkers(model, "owner", stVisitor.getErrors());
  // }

  // Create the listener
  const listener: AntimonyGrammarListener = new AntimonySyntax();
  // Use the entry point for listeners
  ParseTreeWalker.DEFAULT.walk(listener, tree)
  parser.addErrorListener(errorListener);

  let hoverInfo = parseAntimony(variables, errorListener.getErrors());
  let typingTimer: any;
  if (hoverInfo) {
    editor.onDidDispose(() => {
      hoverInfo.dispose();
    });
    editor.onDidChangeModelContent(() => {
      hoverInfo.dispose();
    });
  }
}

function parseAntimony(variables: Map<string, VariableInfo>, errors: string[]) {
  let hoverContents: monaco.IMarkdownString[] = [];

  // Register the hover provider
  let hoverInfo = monaco.languages.registerHoverProvider('antimony', {
    provideHover: (model, position) => {
      hoverContents = []
      let valueOfHover: string = '';
      let valueOfAnnotation: string = '';
      const word = model.getWordAtPosition(position);
      if (word) {
        // check if position range is in error and if it is, return error message
        // have to figure out entire position range of error first
        if (errors.length > 0) {
          errors.forEach((error) => {
            valueOfHover += `Error: ${error} <br/>`; // Include error message in valueOfHover
            console.log(error);
          });
        }
        if (variables.has(word.word)) {
          const variableInfo = variables.get(word.word);
          if (variableInfo?.modifiers) {
            switch (variableInfo?.modifiers) {
              case 'var':
                valueOfHover += `<span style="color:#BC96CA;">${variableInfo?.modifiers}</span> <br/> `;
                break;
              case 'const':
                valueOfHover += `<span style="color:#4954F5;">${variableInfo?.modifiers}</span> <br/> `;
                break;
              case 'formula':
                valueOfHover += `<span style="color:#8185C9;">${variableInfo?.modifiers}</span> <br/> `;
                break;
              case 'species':
                valueOfHover += `(<span style="color:#FD7F20;">Species</span>) ${word.word} <br/> `;
                break;
              default:
                break;
            }
          }
          if (variableInfo?.display) {
            valueOfHover += `<span style="color:#FD7F20;">${variableInfo?.display}</span> <br/> `;
          }
          if (variableInfo?.label) {
            switch (variableInfo?.label) {
              case 'Model':
                valueOfHover += `${word.word} <br/> `;
                break;
              case 'Reaction':
                valueOfHover += `(<span style="color:#4DC5B9;">${variableInfo?.label}</span>) ${word.word} <br/> `;
                break;
              case 'Compartment':
                valueOfHover += `(<span style="color:#BC96CA;">${variableInfo?.label}</span>) ${word.word} <br/> `;
                break;
              case 'Event':
                valueOfHover += `(<span style="color:#4954F5;">${variableInfo?.label}</span>) ${word.word} <br/> `;
                break;
              case 'Unit':
                valueOfHover += `(<span style="color:#4954F5;">${variableInfo?.label}</span>) ${word.word} <br/> `;
                break;
              default:
                break;
            }
          }
          if (variableInfo?.initialize) {
            valueOfHover += `Initialized Value: <span style="color:#DEF9CB;">${variableInfo?.initialize}</span> <br/> `;
          }
          if (variableInfo?.compartments) {
            valueOfHover += `In <span style="color:#BC96CA;">${'compartment'}</span>: ${variableInfo?.compartments} <br/> `;
          }
          if (variableInfo?.annotations) {
            variableInfo?.annotations.forEach((annotation) => {
              valueOfAnnotation += `<span style="color:#f2ab7c;">${annotation.replace(/"/g, "")}</span> <br/> `;
            });
          }
        }
        hoverContents.push(
          { supportHtml: true,
            value:  valueOfHover });
        hoverContents.push(
          { supportHtml: true,
            value:  valueOfAnnotation });
        return {
          range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
          contents: hoverContents,
        };
      }
  
    },
  });
  return hoverInfo;
}

export default ModelParser;