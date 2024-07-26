import * as monaco from "monaco-editor";
import {
  ANTLRErrorListener,
  ANTLRInputStream,
  CommonTokenStream,
  RecognitionException,
  Recognizer,
} from "antlr4ts";
import { AntimonyGrammarLexer } from "./antlr/AntimonyGrammarLexer";
import { AntimonyGrammarParser, RootContext } from "./antlr/AntimonyGrammarParser";
import { GlobalST, ParamAndNameTable } from "./SymbolTableClasses";
import { SymbolTableVisitor } from "./SymbolTableVisitor";
import { SemanticVisitor } from "./SemanticVisitor";
import { ErrorUnderline, SrcPosition, SrcRange, isSubtTypeOf, varTypes } from "./Types";
import { Variable } from "./Variable";
import { editor } from "monaco-editor";

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
  // Clear old decorations
  editor.deltaDecorations(existingDecorations, []);

  const antAnalyzer = new AntimonyProgramAnalyzer(editor.getValue(), highlightColor);

  // Get all errors
  let errors: ErrorUnderline[] = antAnalyzer.getErrors(true);

  // Get all unannotated variables (optional)
  let newDecorations: string[] = [];
  if (annotHighlightOn) {
    const unannotatedDecorations = antAnalyzer.getUnannotatedDecorations();
    newDecorations = editor.deltaDecorations([], unannotatedDecorations); // Add new decorations
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
 * Creates a debounced function that delays the invocation of the provided function until after the specified delay
 * has elapsed since the last time the debounced function was invoked.
 *
 * @template T - The type of the function to be debounced.
 * @param {T} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {(this: unknown, ...args: Parameters<T>) => void} - Returns the new debounced function.
 *
 * @example
 * // Create a debounced function with a 300ms delay
 * const debouncedFunction = debounce(() => console.log('Hello, World!'), 300);
 *
 * // Call the debounced function multiple times in quick succession
 * debouncedFunction();
 * debouncedFunction();
 * debouncedFunction();
 *
 * // The original function will only be called once, 300ms after the last call to the debounced function.
 */
let debounceTimeout: NodeJS.Timeout;
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  return function (this: unknown, ...args: Parameters<T>): void {
    const context = this;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func.apply(context, args), delay);
  };
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
    const hoverProvider = monaco.languages.registerHoverProvider("antimony", {
      provideHover: (model, position) => {
        let hoverContents = [];
        let valueOfHover = "";
        let valueOfAnnotation = "";
        const word = model.getWordAtPosition(position);
        if (word) {
          let hoverLine = position.lineNumber;
          let hoverColumnStart = word.startColumn;
          let hoverColumnEnd = word.endColumn;

          let start = new SrcPosition(position.lineNumber, word.startColumn);
          let end = new SrcPosition(position.lineNumber, word.endColumn);
          let srcRange = new SrcRange(start, end);
          let varInfo = this.globalST.hasVarAtLocation(word.word, srcRange)?.varInfo;
          if (varInfo) {
            if (varInfo.type === varTypes.Model) {
              valueOfHover += this.getModelHover(word.word);
            } else if (varInfo.type === varTypes.Function) {
              valueOfHover += this.getFuncHover(word.word);
            } else {
              if (varInfo.isConst) {
                valueOfHover += `<span style="color:${this.hoverKeyWordColor.get(varTypes.Const)};">const</span> <br/> `;
              } else if (isSubtTypeOf(varInfo.type, varTypes.Variable)) {
                valueOfHover += `<span style="color:${this.hoverKeyWordColor.get(varTypes.Variable)};">var</span> <br/> `;
              }

              if (varInfo.displayName) {
                valueOfHover += `<span style="color:#f2ab7c;">${varInfo.displayName}</span> <br/> `;
              }

              valueOfHover += `(<span style="color:${this.hoverKeyWordColor.get(varInfo.type)};">${varInfo.type}</span>) ${word.word} <br/> `;

              if (varInfo.value) {
                valueOfHover += `Initialized Value: <span style="color:#DEF9CB;">${varInfo.value}</span> <br/> `;
              }

              if (varInfo.compartment) {
                valueOfHover += `In <span style="color:${this.hoverKeyWordColor.get(varTypes.Compartment)};">${varTypes.Compartment}</span>: ${varInfo.compartment} <br/> `;
              }

              varInfo.annotations.forEach((annotation) => {
                let comment = this.getAnnotationComment(annotation, varInfo, model);

                let keyword = varInfo?.annotationKeywordMap.get(annotation);
                let link = annotation.replace(/"/g, "");
                valueOfAnnotation += `<span>
                        <span style="color:#d33682;">${keyword} </span>
                        <a href=${annotation.replace(/"/g, "")}>${link}</a>
                        <span style="color:#76b947;">${comment}</span>
                        <span 
                          class="trash-icon" 
                          data-annotation=${annotation}>🗑️</span>
                        </span>
                    </span><br/>`;
              });
            }
            hoverContents.push({ supportHtml: true, value: valueOfHover });
            hoverContents.push({ supportHtml: true, value: valueOfAnnotation });
            document.addEventListener("click", debounce((e) => {
              this.handleTrashIconClick(e, model, position);
            }, 300)); // Adjust delay as needed
            return {
              range: new monaco.Range(hoverLine, hoverColumnStart, hoverLine, hoverColumnEnd),
              contents: hoverContents,
            };
          }
        }
      },
    });

    return hoverProvider;
  }

  /**
   * Handles the click event on a trash icon to delete an annotation associated with the icon.
   * Retrieves the annotation data from the target element and deletes it from the UI and data structures.
   *
   * @param event The MouseEvent object representing the click event.
   */
  private handleTrashIconClick(event: MouseEvent, model: editor.ITextModel, position: monaco.Position) {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    if (target) {
      let annotation = target.getAttribute("data-annotation");
      if (annotation) {
        this.deleteAnnotation(annotation, target, model, position);
        // Show the popup message
        this.showPopupMessage(event.clientX, event.clientY, "Rehover to delete another annotation");
      }
    }
  }

  /**
   * Displays a popup message at the specified position.
   *
   * @param x The x-coordinate of the popup position.
   * @param y The y-coordinate of the popup position.
   * @param message The message to display in the popup.
   */
  private showPopupMessage(x: number, y: number, message: string) {
    const popup = document.createElement("div");
    popup.innerText = message;
    popup.style.position = "absolute";
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.backgroundColor = "#464646";
    popup.style.color = "white";
    popup.style.padding = "5px";
    popup.style.borderRadius = "8px";
    popup.style.zIndex = "1000";
    popup.style.font = "12px";
    document.body.appendChild(popup);

    // Hide the popup after a short delay
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 3000);
  }

  /**
   * This method handles the removal of a specified annotation from the editor. It adjusts the
   * document's text to delete the annotation and potentially modify or consolidate lines to
   * prevent format disruptions in the source code. This function also updates the internal
   * data structures to reflect the removal of the annotation, ensures that all related UI
   * elements are updated accordingly, and maintains the integrity of remaining annotations.
   *
   * The process includes recalculating line and column positions for any remaining annotations
   * to ensure accurate display and interaction within the editor.
   *
   * @param annotation The specific annotation identifier as a string, which is to be removed.
   * @param target The HTMLElement that represents the clickable trash icon, which initiated
   *               the deletion process.
   * @param model The Monaco editor's text model, which is used for reading and modifying the
   *              text within the editor.
   * @param word The word or identifier associated with the annotation being deleted, used to
   *             update or reference the relevant variable information.
   * @param srcRange An optional source range specifying the location of the word within the
   *                 editor, which may affect how the text and annotations are managed around
   *                 the deleted annotation.
   */
  private deleteAnnotation(annotation: string, target: HTMLElement, model: editor.ITextModel, position: monaco.Position) {
    annotation = "\"" + annotation + "\"";
    const word = model.getWordAtPosition(position);
    if (word) {
      let start = new SrcPosition(position.lineNumber, word.startColumn);
      let end = new SrcPosition(position.lineNumber, word.endColumn);
      let srcRange = new SrcRange(start, end);
      let varInfo = this.globalST.hasVarAtLocation(word.word, srcRange)?.varInfo;
      let annLineNum = varInfo?.annotationLineRange.get(annotation);
      if (varInfo && annLineNum) {
        const remainingAnnotations = this.getRemainingAnnotations(varInfo, annotation);
        const {startLine, startColumn, endLine, endColumn} = this.getAnnotationRange(annLineNum, model);
        const keyWord = varInfo.annotationKeywordMap.get(annotation);
        if (keyWord === undefined) {
          console.error('Error: keyWord is undefined.');
          return;
        }
        const resultString = this.createNewText(remainingAnnotations, keyWord, word.word);
        const range = new monaco.Range(startLine, startColumn, endLine, endColumn);
        const replacementOperation = {
          range: range,
          text: resultString
        };
        console.log(range)
        model.pushEditOperations([], [replacementOperation], () => null);
        if (resultString === "") {
          this.deleteMultipleRanges(model, [new SrcRange(new SrcPosition(endLine, endColumn), new SrcPosition(endLine + 1, 1))])
        }
      }
      const annotationElement = target.parentElement;
      if (annotationElement) {
        annotationElement.remove();
      }
    }

  }
  /**
   * Retrieves the remaining annotations for a given variable, excluding a specified annotation.
   * Filters the annotations based on keyword and line range.
   *
   * @param varInfo The variable information object containing annotations.
   * @param annotation The specific annotation to exclude.
   * @returns An array of remaining annotations.
   */
  private getRemainingAnnotations(varInfo: Variable, annotation: string): string[] {
    const annotationRange = varInfo.annotationLineRange.get(annotation);
    return varInfo.annotations.filter(ann => {
      const annKeyWord = varInfo.annotationKeywordMap.get(ann);
      const annRange = varInfo.annotationLineRange.get(ann);
      return annKeyWord === varInfo.annotationKeywordMap.get(annotation)
          && ann !== annotation
          && annRange?.start.line === annotationRange?.start.line
          && annRange?.end.line === annotationRange?.end.line;
    });
  }


  /**
   * Calculates the start and end positions of an annotation range within the text model.
   *
   * @param annLineNum The source range of the annotation.
   * @param model The text model containing the annotation.
   * @returns An object containing the start and end positions of the annotation range.
   */
  private getAnnotationRange(annLineNum: SrcRange, model: editor.ITextModel) {
    const startLine = annLineNum.start.line;
    const startColumn = 1; // Assuming the annotation starts at the beginning of the line
    const endLine = annLineNum.end.line;
    const endColumn = model.getLineMaxColumn(endLine);
    return { startLine, startColumn, endLine, endColumn };
  }

  /**
   * Creates the new text string for the remaining annotations, properly formatted.
   *
   * @param remainingAnnotations An array of remaining annotations.
   * @param keyWord The keyword associated with the annotations.
   * @param word The variable name associated with the annotations.
   * @returns A formatted string containing the remaining annotations.
   */
  private createNewText(remainingAnnotations: string[], keyWord: string, word: string): string {
    const varNameAndKeyWord = "  " + word + " " + keyWord + " ";
    const indent = ' '.repeat(word.length + keyWord.length + 4);
    let resultString = remainingAnnotations.join(',\n' + indent);
    resultString = remainingAnnotations.length === 0 ? "" : varNameAndKeyWord + resultString;
    return resultString;
  }

  private deleteMultipleRanges(model: monaco.editor.ITextModel, ranges: SrcRange[]) {
    const operations = ranges.map(range => ({
      range: new monaco.Range(range.start.line, range.start.column, range.end.line, range.end.column),
      text: '' // Empty text to delete the range
    }));

    // Push edit operations to the model
    model.pushEditOperations([], operations, () => null);
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
    let lineInfo: SrcRange | undefined = varInfo?.annotationLineRange.get(annotation);
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
    const decorations: monaco.editor.IModelDeltaDecoration[] = unannotatedErrors.map(variable => {
      let colorClass = 'custom-highlight';

      // Dynamically inject CSS for the decoration
      addDynamicStyleRule(`.${colorClass} { background-color: ${this.highlightColor}; color: black; }`);

      return {
        range: new monaco.Range(
            variable.startLineNumber,
            variable.startColumn,
            variable.endLineNumber,
            variable.endColumn
        ),
        options: {
          inlineClassNameAffectsLetterSpacing: true,
          className: colorClass,
          stickiness: monaco.editor.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
        }
      };
    }).flat();
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
 * Adds a dynamically created CSS rule to the document's head.
 * Creates a <style> element and appends it to the document head,
 * then inserts the given CSS rule into the style sheet.
 *
 * @param css The CSS rule to be added dynamically.
 */
export function addDynamicStyleRule(css: string): void {
  const style = document.createElement('style');
  style.type = 'text/css';
  document.head.appendChild(style);

  // Check if the style sheet exists and insert the CSS rule.
  if (style.sheet) {
    style.sheet.insertRule(css, style.sheet.cssRules.length);
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