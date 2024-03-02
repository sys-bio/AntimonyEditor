import { AntimonyGrammarVisitor } from "./antlr/AntimonyGrammarVisitor";
import { SymbolTable } from "./SymbolTableClasses";
import { ErrorVisitor } from "./ErrorVisitor";
import { FunctionContext, ModelContext, SpeciesContext, Var_nameContext } from "./antlr/AntimonyGrammarParser";
import { ErrorUnderline, SrcRange, isSubtTypeOf, varTypes } from "./Types";
import { defaultValueWarning, unitializedParameterError } from "./SemanticErrors";

// goal is to loop through and look at all variables, classes, 
export class SemanticVisitor extends ErrorVisitor implements AntimonyGrammarVisitor<void> {
  visitModel(ctx: ModelContext) {
    const name = ctx.NAME().text;
    if (ctx.children) {
      this.currNameAndScope = {name: name, scope: "model"};
      for (let i = 0; i < ctx.children.length; i++) {
        this.visit(ctx.children[i]);
      }
      this.currNameAndScope = undefined;
    }
  }

  visitFunction(ctx: FunctionContext) {
    const name = ctx.NAME().text;
    if (ctx.children) {
      this.currNameAndScope = {name: name, scope: "function"};
      for (let i = 0; i < ctx.children.length; i++) {
        this.visit(ctx.children[i]);
      }
      this.currNameAndScope = undefined;
    }
  }

  

  visitVar_name(ctx: Var_nameContext) {
    this.varInitializationCheck(ctx);
  }

  visitSpecies(ctx: SpeciesContext) {
    this.varInitializationCheck(ctx);
  }

  /**
   * checks for if the var is initialized, and if 
   * not records appropriate errors or warnings.
   * @param ctx context of an variable
   */
  private varInitializationCheck(ctx: SpeciesContext | Var_nameContext) {
    const currST: SymbolTable | undefined = this.getCurrST();
    const varName = ctx.NAME().text;
    const idSrcRange: SrcRange = this.getSrcRange(ctx.NAME());
    if (currST) {
      const varInfo = currST.getVar(varName);
      if (varInfo && varInfo.initSrcRange === undefined) {
        if (varInfo.type === varTypes.Parameter) {
          // error, needs initialized value
          //Parameter 'k' missing value assignment
          const errorMessage: string = unitializedParameterError(varName);
          const errorUnderline: ErrorUnderline = this.getErrorUnderline(idSrcRange, errorMessage, true);
          this.errorList.push(errorUnderline);
        } else if (isSubtTypeOf(varInfo.type, varTypes.Parameter)) {
          // warning, using default value
          //Species 'Z' has not been initialized, using default value
          const errorMessage: string = defaultValueWarning(varName);
          const errorUnderline: ErrorUnderline = this.getErrorUnderline(idSrcRange, errorMessage, false);
          this.errorList.push(errorUnderline);
        }
      }
    } 
  }
}