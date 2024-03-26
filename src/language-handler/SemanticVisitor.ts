import { AntimonyGrammarVisitor } from "./antlr/AntimonyGrammarVisitor";
import { SymbolTable } from "./SymbolTableClasses";
import { ErrorVisitor } from "./ErrorVisitor";
import { FunctionContext, ModelContext, Modular_modelContext, ReactionContext, SpeciesContext, Var_nameContext } from "./antlr/AntimonyGrammarParser";
import { ErrorUnderline, SrcRange, isSubtTypeOf, varTypes } from "./Types";
import { defaultValueWarning, unitializedParameterError, unitializedRateLawWarning } from "./SemanticErrors";
import { ErrorNode } from "antlr4ts/tree";

// goal is to loop through and look at all variables, classes, 
export class SemanticVisitor extends ErrorVisitor implements AntimonyGrammarVisitor<void> {
  visitModel(ctx: ModelContext) {
    if (this.hasParseError(ctx)) {
      return;
    }

    const name = ctx.NAME().text;
    this.setScopeVisitChildren(name, ctx, 'model');
  }

  visitModular_model(ctx: Modular_modelContext) {
    if (this.hasParseError(ctx)) {
      return;
    }
    
    const name = ctx.NAME().text;
    this.setScopeVisitChildren(name, ctx, 'model');
  }

  visitFunction(ctx: FunctionContext) {
    if (this.hasParseError(ctx)) {
      return;
    }

    const name = ctx.NAME().text;
    this.setScopeVisitChildren(name, ctx, 'function');
  }

  visitVar_name(ctx: Var_nameContext) {
    if (this.hasParseError(ctx)) {
      return;
    }

    this.varInitializationCheck(ctx);
  }

  visitSpecies(ctx: SpeciesContext) {
    if (this.hasParseError(ctx)) {
      return;
    }

    this.varInitializationCheck(ctx);
  }

  visitReaction(ctx: ReactionContext) {
    if (this.hasParseError(ctx)) {
      return;
    }

    // don't do anything if children contain an error node
    if (ctx.children) {
      for (let i = 0; i < ctx.children.length; i++) {
        if (ctx.children[i] instanceof ErrorNode) {
          return;
        }
      }
    }

    let id = ctx.reaction_name()?.namemaybein().text;
    if (id === undefined) {
      id = '';
    }
    if (!ctx.sum()) {
       // although it might make more sense to check in the semantic visitor
      // it really doesn't matter here I think.
      const errorMessage: string = unitializedRateLawWarning(id);
      this.addError(this.getErrorUnderline(this.getSrcRange(ctx), errorMessage, false));
    }

    if (ctx.children) {
      for (let i = 0; i < ctx.children.length; i++) {
        this.visit(ctx.children[i]);
      }
    }
  }

  /**
   * checks for if the var is initialized, and if 
   * not records appropriate errors or warnings.
   * @param ctx context of an variable
   * @requires ctx does not have an exception.
   */
  private varInitializationCheck(ctx: SpeciesContext | Var_nameContext) {
    const currST: SymbolTable | undefined = this.getCurrST();
    const varName = ctx.NAME().text;
    const idSrcRange: SrcRange = this.getSrcRange(ctx.NAME());
    if (currST) {
      const varInfo = currST.getVar(varName);
      if (this.currNameAndScope?.scope !== 'function' && varInfo && varInfo.initSrcRange === undefined) {
        if (varInfo.type === varTypes.Parameter) {
          // error, needs initialized value
          //Parameter 'k' missing value assignment
          const errorMessage: string = unitializedParameterError(varName);
          const errorUnderline: ErrorUnderline = this.getErrorUnderline(idSrcRange, errorMessage, true);
          this.addError(errorUnderline);
        } else if (isSubtTypeOf(varInfo.type, varTypes.Parameter) && varInfo.type !== varTypes.Reaction && varInfo.type !== varTypes.Event) {
          // warning, using default value
          // Species 'Z' has not been initialized, using default value
          const errorMessage: string = defaultValueWarning(varName, varInfo.type);
          const errorUnderline: ErrorUnderline = this.getErrorUnderline(idSrcRange, errorMessage, false);
          this.addError(errorUnderline);
        }
      }
    } 
  }
}