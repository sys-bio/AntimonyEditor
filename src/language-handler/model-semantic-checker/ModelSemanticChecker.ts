import * as monaco from "monaco-editor";
import React, { useState, useEffect } from 'react';
import {
  ANTLRErrorListener,
  ANTLRInputStream,
  CommonTokenStream,
  RecognitionException,
  Recognizer,
} from "antlr4ts";
import { AntimonyGrammarLexer } from ".././antlr/AntimonyGrammarLexer";
import { AntimonyGrammarParser, RootContext } from ".././antlr/AntimonyGrammarParser";
import { GlobalST, ParamAndNameTable } from ".././SymbolTableClasses";
import { SymbolTableVisitor } from ".././SymbolTableVisitor";
import { SemanticVisitor } from ".././SemanticVisitor";
import { ErrorUnderline, SrcPosition, SrcRange, isSubtTypeOf, varTypes } from ".././Types";
import { Variable } from ".././Variable";
import "./ModelSemanticChecker.css"

/**
 * Defines a parse error, which includes a position (line, column) as well as the error message.
 */
type parseErrors = {
  line: number;
  column: number;
  msg: string;
};

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
    this.errors.push({ line: line, column: charPositionInLine, msg: msg });
  }

  getErrors(): parseErrors[] {
    return this.errors;
  }
}

/**
 * @description Analyzes an antimony file, does error checking, and adds general hover information.
 * @param editor the monaco editor whose contents are to be semantic checked
 * @param annotHighlightOn boolean for if annotation highlighting should be on
 * @param setGeneralHoverInfo boolean that determines if variable hover info should be added.
 * @param decorations
 * @returns {GlobalST} the complete symbol table representing the program in the monaco editor.
 */
export const ModelSemanticsChecker = (
    editor: monaco.editor.IStandaloneCodeEditor,
    annotHighlightOn: boolean,
    setGeneralHoverInfo: boolean,
    highlightColor: string,
    existingDecorations: string[]
): { symbolTable: GlobalST; decorations: string[] } => {
  const antAnalyzer = new AntimonyProgramAnalyzer(editor.getValue(), highlightColor);

  // Get all errors
  let errors: ErrorUnderline[] = antAnalyzer.getErrors(true);

  // Get all unannotated variables (optional)
  let newDecorations: string[] = [];
  if (annotHighlightOn) {
    const unannotatedDecorations = antAnalyzer.getUnannotatedDecorations();
    newDecorations = editor.deltaDecorations([], unannotatedDecorations); // Replace existing decorations
  } else {
    // Remove existing decorations before applying new ones
    editor.deltaDecorations(existingDecorations, []);
  }

  if (setGeneralHoverInfo) {
    const hoverInfo: monaco.IDisposable = antAnalyzer.getGeneralHoverInfo();
    if (hoverInfo) {
      editor.onDidDispose(() => {
        hoverInfo.dispose();
      });
      editor.onDidChangeModelContent(() => {
        hoverInfo.dispose();
      });
    }
  }

  // Add error (and optional annotated) squiggles
  let model: monaco.editor.ITextModel | null = editor.getModel();
  if (model !== null) {
    monaco.editor.removeAllMarkers("owner");
    monaco.editor.setModelMarkers(model, "owner", errors);
  }

  return { symbolTable: antAnalyzer.getProgramST(), decorations: newDecorations }; // Return the new decorations and symbol table
};

/**
 *
 */
export class AntimonyProgramAnalyzer {
  private errorListener: ErrorListener;
  private parser: AntimonyGrammarParser;
  private tree: RootContext;
  private stVisitor: SymbolTableVisitor;
  private semanticVisitor: SemanticVisitor;
  private globalST: GlobalST;
  private hoverKeyWordColor: Map<string, string>;
  private highlightColor: string;

  constructor(antimonyCode: string, highlightColor: string) {
    // we remove carriage returns in the string since
    // these only exist in new lines on windows OS, and interfere with the
    // grammar parse.
    antimonyCode = this.removeCarriageReturn(antimonyCode);
    this.highlightColor = highlightColor;
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
    // for annotation position
    this.globalST.endLine = this.tree._stop?.line;

    this.stVisitor = new SymbolTableVisitor(this.globalST);
    this.stVisitor.visit(this.tree);

    this.semanticVisitor = new SemanticVisitor(this.globalST);
    this.semanticVisitor.visit(this.tree);

    this.hoverKeyWordColor = new Map();
    this.hoverKeyWordColor.set(varTypes.Species, "#FD7F20");
    this.hoverKeyWordColor.set(varTypes.Compartment, "#bc96ca");
    this.hoverKeyWordColor.set(varTypes.Const, "#dcd52b");
    this.hoverKeyWordColor.set(varTypes.Parameter, "");
    this.hoverKeyWordColor.set(varTypes.Event, "");
    this.hoverKeyWordColor.set(varTypes.Deleted, "");
    this.hoverKeyWordColor.set(varTypes.Constraint, "");
    this.hoverKeyWordColor.set(varTypes.Function, "");
    this.hoverKeyWordColor.set(varTypes.Import, "");
    this.hoverKeyWordColor.set(varTypes.Interaction, "");
    this.hoverKeyWordColor.set(varTypes.Model, "");
    this.hoverKeyWordColor.set(varTypes.ModularModel, "");
    this.hoverKeyWordColor.set(varTypes.Reaction, "");
    this.hoverKeyWordColor.set(varTypes.Variable, "#9cdcfe");
    this.hoverKeyWordColor.set(varTypes.Unknown, "");
  }

  /**
   * Retrieves an array of both semantic and parse errors caught when analyzing the program
   * @param includeParseErrors boolean determining whether to include parse errors or not
   *                           (mainly used for isolated testing of semantic error checking).
   * @returns {ErrorUnderline[]}
   */
  getErrors(includeParseErrors: boolean): ErrorUnderline[] {
    if (includeParseErrors) {
      this.stVisitor.addErrorList(this.addParseErrors(this.errorListener.getErrors()));
    }
    return this.stVisitor.getErrors().concat(this.semanticVisitor.getErrors());
  }

  /**
   * Adds variable and annotation information to hovers.
   * @returns
   */
  getGeneralHoverInfo() {
    let hoverInfo = monaco.languages.registerHoverProvider("antimony", {
      provideHover: (model, position) => {
        let hoverContents: monaco.IMarkdownString[] = [];
        let valueOfHover: string = "";
        let valueOfAnnotation: string = "";
        const word = model.getWordAtPosition(position);

        // Check if word exists
        if (word) {
          // set range for hover
          let hoverLine = position.lineNumber;
          let hoverColumnStart = word.startColumn;
          let hoverColumnEnd = word.endColumn;

          // check if variable with id word.word exists at the given position range.
          // if it does use the stored variable info to create a hover.
          let start: SrcPosition = new SrcPosition(position.lineNumber, word.startColumn);
          let end: SrcPosition = new SrcPosition(position.lineNumber, word.endColumn);
          let srcRange: SrcRange = new SrcRange(start, end);
          let varInfo: Variable | undefined = this.globalST.hasVarAtLocation(
            word.word,
            srcRange
          )?.varInfo;

          if (varInfo) {
            if (varInfo.type === varTypes.Model) {
              valueOfHover += this.getModelHover(word.word);
            } else if (varInfo.type === varTypes.Function) {
              valueOfHover += this.getFuncHover(word.word);
            } else {
              if (varInfo.isConst) {
                valueOfHover += `<span style="color:${this.hoverKeyWordColor.get(
                  varTypes.Const
                )};">const</span> <br/> `;
              } else if (isSubtTypeOf(varInfo.type, varTypes.Variable)) {
                valueOfHover += `<span style="color:${this.hoverKeyWordColor.get(
                  varTypes.Variable
                )};">var</span> <br/> `;
              }

              if (varInfo.displayName) {
                valueOfHover += `<span style="color:#f2ab7c;">${varInfo.displayName}</span> <br/> `;
              }

              valueOfHover += `(<span style="color:${this.hoverKeyWordColor.get(varInfo.type)};">${
                varInfo.type
              }</span>) ${word.word} <br/> `;

              if (varInfo.value) {
                valueOfHover += `Initialized Value: <span style="color:#DEF9CB;">${varInfo.value}</span> <br/> `;
              }

              if (varInfo.compartment) {
                valueOfHover += `In <span style="color:${this.hoverKeyWordColor.get(
                  varTypes.Compartment
                )};">${varTypes.Compartment}</span>: ${varInfo.compartment} <br/> `;
              }

              varInfo.annotations.forEach((annotation) => {
                // get any additional comment on the same line as the annotation
                let comment: string = this.getAnnotationComment(annotation, varInfo, model);

                // the annotation keyword, ie "identity", "part", etc
                let keyword: string | undefined = varInfo?.annotationKeywordMap.get(annotation);
                let link: string = annotation.replace(/"/g, "");

                valueOfAnnotation += `<span><span style="color:#d33682;">${keyword} </span>
                                      <a href=${annotation.replace(/"/g, "")}>${link}</a> 
                                      <span style="color:#76b947;">${comment}</span></span><br/> `;
              });
            }

            // add valueOfHover and valueOfAnnotation to hoverContents
            hoverContents.push({ supportHtml: true, value: valueOfHover });
            hoverContents.push({ supportHtml: true, value: valueOfAnnotation });
          } else {
            // // check if it is an annotation string.
            // let line: string = model.getLineContent(position.lineNumber);
            // let startCol = word.startColumn;
            // let endCol = word.startColumn;
            // while (startCol >= 0) {
            //   if (line.charAt(startCol) === '"' || line.charAt(startCol) === " ") {
            //     startCol++;
            //     break;
            //   }
            //   startCol--;
            // }
            // while (endCol < line.length) {
            //   if (
            //     line.charAt(endCol) === '"' ||
            //     line.charAt(endCol) === " " ||
            //     line.charAt(endCol) === "\r" ||
            //     line.charAt(endCol) === "\n"
            //   ) {
            //     endCol--;
            //     break;
            //   }
            //   endCol++;
            // }
            // let foundString: string = line.substring(startCol, endCol + 1);
            // console.log("before: " + foundString);
            // if (
            //   foundString.charAt(0) === '"' &&
            //   foundString.charAt(foundString.length - 1) === '"'
            // ) {
            //   foundString = foundString.replace('"', "");
            //   startCol++;
            //   endCol--;
            // }
            // console.log("found: " + foundString);
            // console.log(this.globalST.annotationSet);
            // if (
            //   this.isValidUrl(foundString) ||
            //   this.globalST.annotationSet.has('"' + foundString + '"')
            // ) {
            //   hoverContents.push({
            //     supportHtml: true,
            //     value: foundString,
            //   });
            //   // set new hover bounds to be that of the url
            //   hoverColumnStart = startCol + 1;
            //   hoverColumnEnd = endCol + 2;
            // }
          }

          // hoverContents.push({supportHtml: true, value: "http://identifiers.org/chebi/CHEBI:25107"});
          // hoverContents.push({supportHtml: true, value: `<span><a>http://identifiers.org/chebi/CHEBI:25107</a></span>`});
          // console.log("range: " + hoverColumnStart + ", " + hoverColumnEnd);
          return {
            range: new monaco.Range(hoverLine, hoverColumnStart, hoverLine, hoverColumnEnd),
            contents: hoverContents,
          };
        }
      },
    });
    return hoverInfo;
  }

  /**
   * grabs any comment on the line of a single line annotation
   * @param annotation the annotation hyperlink string
   * @param varInfo variable info for the var being annotated
   * @param model editor text model
   * @returns comment if it exists, empty string otherwise
   */
  private getAnnotationComment(
    annotation: string,
    varInfo: Variable | undefined,
    model: monaco.editor.ITextModel
  ): string {
    let lineInfo: SrcRange | undefined = varInfo?.annotationLineNum.get(annotation);
    let comment: string = "";

    if (lineInfo) {
      // get the line the annotation is on, and try to find the comment string
      let lineContent: string = model.getLineContent(lineInfo.end.line);
      // split on both "//" and ";" on the line.
      let commentStart: number = lineInfo.end.column + annotation.length - 2;
      let line: string[] = lineContent.substring(commentStart).split(/\/\/|;/);

      if (line.length > 0 && line[line.length - 1].length !== 0) {
        comment = '"' + line[line.length - 1] + '"';
      }
    }
    return comment;
  }

  private isValidUrl(urlString: string): boolean {
    let url;
    try {
      url = new URL(urlString);
    } catch (e) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  /**
   * Gets string format of what should appear when hovering over a model's id
   * @param modelId
   * @returns {string}
   */
  private getModelHover(modelId: string): string {
    let hover: string = `${modelId}(`;
    const modelST: ParamAndNameTable | undefined = this.globalST.getModelST(modelId);
    if (modelST) {
      for (let i = 0; i < modelST.params.length; i++) {
        const paramId: string = modelST.params[i];
        let paramVarInfo: Variable | undefined = modelST.getVar(paramId);
        if (paramVarInfo) {
          hover += `<span style="color:${this.hoverKeyWordColor.get(paramVarInfo.type)};">${
            paramVarInfo.type
          }</span>: ${paramId}`;
          if (i !== modelST.params.length - 1) {
            hover += `, `;
          }
        }
      }
    }
    hover += `) <br/> `;
    return hover;
  }

  /**
   * Gets a string of what should appear when hovering over a function's id
   * @param funcId
   * @returns {string}
   */
  private getFuncHover(funcId: string): string {
    let hover: string = `${funcId}(`;
    const funcST: ParamAndNameTable | undefined = this.globalST.getFunctionST(funcId);
    if (funcST) {
      for (let i = 0; i < funcST.params.length; i++) {
        const paramId: string = funcST.params[i];
        hover += `${paramId}`;
        if (i !== funcST.params.length - 1) {
          hover += `, `;
        }
      }
    }
    hover += `) <br/> `;
    return hover;
  }

  /**
   * Used to add annotation highlighting
   * @returns {ErrorUnderline[]} for all species, reactions, compartments variables without annotations
   */
  getUnannotatedVariables(): ErrorUnderline[] {
    const unannotated: Variable[] = [];

    // Get unannotated variables
    for (const varInfo of this.globalST.getVarMap().values()) {
      if (
        varInfo.annotations.length === 0 &&
        (varInfo.type === varTypes.Compartment ||
          varInfo.type === varTypes.Species ||
          varInfo.type === varTypes.Reaction)
      ) {
        unannotated.push(varInfo);
      }
    }

    for (const modelMap of this.globalST.getModelMap().values()) {
      for (const varInfo of modelMap.getVarMap().values()) {
        if (
          varInfo.annotations.length === 0 &&
          (varInfo.type === varTypes.Compartment ||
            varInfo.type === varTypes.Species ||
            varInfo.type === varTypes.Reaction)
        ) {
          unannotated.push(varInfo);
        }
      }
    }

    for (const funcMap of this.globalST.getFuncMap().values()) {
      for (const varInfo of funcMap.getVarMap().values()) {
        if (
          varInfo.annotations.length === 0 &&
          (varInfo.type === varTypes.Compartment ||
            varInfo.type === varTypes.Species ||
            varInfo.type === varTypes.Reaction)
        ) {
          unannotated.push(varInfo);
        }
      }
    }

    // Identify where to add unannotated squiggle
    const errors: ErrorUnderline[] = [];
    for (let i = 0; i < unannotated.length; i++) {
      const varInfo: Variable = unannotated[i];
      for (const range of varInfo.refLocations.values()) {
        errors.push({
          startLineNumber: range.start.line,
          startColumn: range.start.column,
          endLineNumber: range.end.line,
          endColumn: range.end.column,
          message: "Consider adding an annotation to this variable.",
          severity: monaco.MarkerSeverity.Error,
        });
      }
    }

    return errors;
  }

  /**
   * Retrieves decorations for unannotated variables in a Monaco editor instance.
   * Each decoration marks specific ranges where unannotated variables are referenced.
   * @returns An array of Monaco editor decorations (`monaco.editor.IModelDeltaDecoration`).
   */
  getUnannotatedDecorations(): monaco.editor.IModelDeltaDecoration[] {
    const unannotatedErrors: ErrorUnderline[] = this.getUnannotatedVariables();
    const decorations: monaco.editor.IModelDeltaDecoration[] = unannotatedErrors.map(error => {
//     console.log("THIS HIGHLIGHT COLOR -> " + this.highlightColor);
    let colorClass = 'custom-highlight-' + this.highlightColor;
      return {
        range: new monaco.Range(
          error.startLineNumber,
          error.startColumn,
          error.endLineNumber,
          error.endColumn
        ),
        options: {
            inlineClassNameAffectsLetterSpacing: true,
            inlineClassName: '',
            className: colorClass, // Dynamic class name
            stickiness: monaco.editor.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
          }
      };
    });
    return decorations;
  }

  /**
   * Gets the symbol table representing the entire analyzed file
   * @returns {GLbitfield}
   */
  getProgramST(): GlobalST {
    return this.globalST;
  }

  /**
   * takes the parse errors discovered and
   * returns each one in the same format as the other semantic errors
   * basically following the "ErrorUnderline" type
   * @param errors list of discovered parseErrors
   * @returns a list of ErrorUnderline's
   */
  private addParseErrors(errors: parseErrors[]): ErrorUnderline[] {
    let parseErrors = [];
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
        severity: monaco.MarkerSeverity.Error,
      };
      parseErrors.push(error);
    }
    return parseErrors;
  }

  /**
   * TODO: probably change the grammar later, for now we remove carriage returns
   * as the grammar is not configured to account for it (only occurs on Windows machines I think?)
   * @param input
   * @returns
   */
  private removeCarriageReturn(input: string): string {
    return input.replaceAll("\r", "");
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

  // create and buildup a global symbol table from the parse tree.
  let globalSymbolTable: GlobalST = new GlobalST();
  const stVisitor: SymbolTableVisitor = new SymbolTableVisitor(globalSymbolTable);
  stVisitor.visit(tree);

  // using the populated symbol table, we now do more extensive semantic checking
  const semanticVisitor: SemanticVisitor = new SemanticVisitor(stVisitor.globalST);
  semanticVisitor.visit(tree);

  // this is mainly an option so that tests can focus on just semantic errors
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
  let parseErrors = [];
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
      severity: monaco.MarkerSeverity.Error,
    };
    parseErrors.push(error);
  }
  return parseErrors;
}

export function removeCarriageReturn(input: string): string {
  return input.replaceAll("\r", "");
}

export default ModelSemanticsChecker;
