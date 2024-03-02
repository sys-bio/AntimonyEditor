import {AssignmentContext, AtomContext, Decl_itemContext, Decl_modifiersContext, DeclarationContext, EventContext, Event_assignmentContext, FunctionContext, In_compContext, Init_paramsContext, Modular_modelContext, NamemaybeinContext, ReactionContext, Reaction_nameContext, SpeciesContext, Species_listContext, Var_nameContext, Variable_inContext } from './antlr/AntimonyGrammarParser';
import { ModelContext } from './antlr/AntimonyGrammarParser'
import { SymbolTable, FuncST, ModelST} from './SymbolTableClasses';
import { Variable } from './Variable';
import { ErrorUnderline, SrcRange, getTypeFromString, isSubtTypeOf, varTypes } from './Types';
import { functionAlreadyExistsError, incompatibleTypesError, modelAlreadyExistsError, overriddenValueWarning, overridingValueWarning, unitializedRateLawWarning } from './SemanticErrors';
import { ErrorVisitor } from './ErrorVisitor';
import { AntimonyGrammarVisitor } from './antlr/AntimonyGrammarVisitor';

// type scope = "model" | "mmodel" | "function";
// type nameAndScope = {name: string, scope: scope};

export class SymbolTableVisitor extends ErrorVisitor implements AntimonyGrammarVisitor<void> {
  
  visitFunction(ctx: FunctionContext) {
    if (ctx.children) {
      const funcName = this.getVarName(ctx.NAME().text);
      const funcIDSrcRange: SrcRange = this.getSrcRange(ctx.NAME());
      const funcST: FuncST | undefined = this.globalST.getFunctionST(funcName);

      if (!funcST){
        // func has not been declared yet
        // can still error if another var has same name!
        const existingVarInfo: Variable | undefined = this.globalST.getVar(funcName)
        if (existingVarInfo) {
          // error, already exists!
          const errorMessage: string = incompatibleTypesError(varTypes.Function, existingVarInfo);
          const errorUnderline: ErrorUnderline = this.getErrorUnderline(funcIDSrcRange, errorMessage, true);
          this.errorList.push(errorUnderline);
        } else {
          this.globalST.setFunction(funcName, funcIDSrcRange)

          // look for params
          let params: Init_paramsContext | undefined = ctx.init_params();

          if (params && params.children) {
            for (let i = 0; i < params.children.length; i += 2) {
              const paramInfo: Variable = new Variable(varTypes.Unknown, false, undefined, this.getSrcRange(params.children[i]), undefined, false);
              const paramId: string = params.children[i].text;

              // we need to know what the params are if we want to
              // use this function anywhere.
              this.globalST.getFunctionST(funcName)?.params.push(paramId);
              this.globalST.getFunctionST(funcName)?.setVar(paramId, paramInfo);
            }
          }
        }
      } else {
        // redeclared function, error
        const errorMessage: string = functionAlreadyExistsError(funcName, funcST.getPosition());
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
            const paramInfo: Variable = new Variable(varTypes.Unknown, false, undefined, this.getSrcRange(params.children[i]), undefined, false);
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
        const errorMessage = modelAlreadyExistsError(modName, modelST.getPosition());
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
        const errorMessage = modelAlreadyExistsError(modName, modelST.getPosition());
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
    let varInfo: Variable = new Variable(varTypes.Species, false, undefined, this.getSrcRange(ctx), undefined, false);

    let speciesName: string = this.getVarName(ctx.NAME().text);
    // gets the $ location within the grammar def of "species : (NUMBER)? ('$')? NAME;"
    varInfo.isConst = (ctx.text.charAt((ctx.text.length - ctx.NAME().text.length - 1)) === '$');

    // get the relevant ST
    const currST: SymbolTable | undefined = this.getCurrST();

    if (currST) {
      const existingVarInfo: Variable | undefined = currST.getVar(speciesName);
      if (existingVarInfo) {
        if (existingVarInfo.canSetType(varTypes.Species)) {
          existingVarInfo.type = varTypes.Species;
          existingVarInfo.idSrcRange = this.getSrcRange(ctx.NAME());
        } else {
          const errorMessage = incompatibleTypesError(varTypes.Species, existingVarInfo);
          const errorUnderline: ErrorUnderline = this.getErrorUnderline(varInfo.idSrcRange, errorMessage, true);
          this.errorList.push(errorUnderline);
        }
      } else {
        // var does not exist, insert into ST
        currST.setVar(speciesName, varInfo);
      }
    }
  }

  /**
   * 
   * @param ctx 
   */
  visitDeclaration(ctx: DeclarationContext) {
    // grammar def: declaration : decl_modifiers decl_item (',' decl_item)*;
    if (ctx.children) {
      // we visit the children first
      // something like this is valid: "species B = 1, C = 2, D = 3;"

      // visit children first for convenience.
      for (let i = 0; i < ctx.children.length; i++) {
        this.visit(ctx.children[i]);
      }

      // we are looping this way to only hit the Decl_itemContext nodes.
      for (let i = 1; i < ctx.children.length; i+=2) {
        const declItem: Decl_itemContext = ctx.children[i] as Decl_itemContext;
        const varName: string = this.getVarName(declItem.namemaybein().var_name().text);
        const currSrcRange: SrcRange = this.getSrcRange(declItem);
        const currST: SymbolTable | undefined = this.getCurrST();

        // check if we are using $ to apply const
        let varIsConst: boolean = (varName.charAt(0) === '$');
        if (varIsConst) {
          currSrcRange.start.column += 1;
        }

        let varInfo: Variable | undefined;
        if (currST) {
          varInfo = currST.getVar(varName);
        }

        // gauranteed to pass this check as children visited first.
        if (varInfo) {
          // TODO: in vscode-antimony, type overried takes precedence over value reassignement.
          // should this continue being the case, or should both cases be reported?
          // for now keep it as report both.


          // take care of modifiers
          let declModifiers: Decl_modifiersContext = ctx.decl_modifiers();
          varInfo.substanceOnly = (declModifiers.SUB_MODIFIER() !== undefined) || varInfo.substanceOnly;
          varInfo.isConst = (declModifiers.VAR_MODIFIER()?.text === varTypes.Const) || varInfo.isConst;
          let typeString: string | undefined = declModifiers.TYPE_MODIFIER()?.text;
          
          if (typeString) {
            const type: varTypes = getTypeFromString(typeString);

            if (varInfo.canSetType(type)) {
              varInfo.type = type;
              varInfo.idSrcRange = currSrcRange;
            } else {
              // error! trying to overried previous type decl
              const errorMessage = incompatibleTypesError(type, varInfo);
              const errorUnderline: ErrorUnderline = this.getErrorUnderline(currSrcRange, errorMessage, true);
              this.errorList.push(errorUnderline);
            }
          }

          // 2) check if initialize node exists
          if (declItem.decl_assignment()) {
            // check if it is initialized.
            // varInfo gauranteed not undefined
            // as the children are visited first.
            if (varInfo.initSrcRange !== undefined) {
              // warning case! reinitalization!
              //
              // guaranteed to pass this check, maybe try and bundle varInfo.initialized and varInfo.initSrcRange
              // as one field would be better?
              if (varInfo.initSrcRange) {
                const errorMessage1: string = overriddenValueWarning(varName, currSrcRange);
                const errorUnderline1: ErrorUnderline = this.getErrorUnderline(varInfo.initSrcRange, errorMessage1, false);
                this.errorList.push(errorUnderline1);

                const errorMessage2: string = overridingValueWarning(varName, varInfo.initSrcRange);
                const errorUnderline2: ErrorUnderline = this.getErrorUnderline(currSrcRange, errorMessage2, false);
                this.errorList.push(errorUnderline2);
              }

              varInfo.initSrcRange = currSrcRange;
            } else {
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
          if (varInfo.initSrcRange !== undefined) {
            // warning case! reinitalization!
            if (varInfo.initSrcRange) {
              const errorMessage1: string = overriddenValueWarning(varName, currSrcRange);
              const errorUnderline1: ErrorUnderline = this.getErrorUnderline(varInfo.initSrcRange, errorMessage1, false);
              this.errorList.push(errorUnderline1);

              const errorMessage2: string = overridingValueWarning(varName, varInfo.initSrcRange);
              const errorUnderline2: ErrorUnderline = this.getErrorUnderline(currSrcRange, errorMessage2, false);
              this.errorList.push(errorUnderline2);
            }
          }
          varInfo.initSrcRange = currSrcRange;
          varInfo.type = varTypes.Parameter;
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

    const id1: string = this.getVarName(ctx.var_name().text);
    const in_compCtx: In_compContext | undefined = ctx.in_comp();
    let isConst: boolean = (ctx.var_name().text.charAt(0) === '$');

    // case 1, we will always deal with ID
    const currST: SymbolTable | undefined = this.getCurrST();

    if (!currST) {
      // wait what happens here?
      // there should always be a valid ST, as it is either global or not.
      // so nothing should happen here.
    } else {
      // create a STVarInfo
      // we initialize as a variable before further info is known.
      let id1SrcRange = this.getSrcRange(ctx.var_name())
      if (isConst) {
        // we do this so we odn't underline the $
        id1SrcRange.start.column += 1;
      }
      let id1VarInfo: Variable = new Variable(varTypes.Unknown, isConst, undefined, id1SrcRange, undefined, false);
      id1VarInfo.type = varTypes.Variable;

      // check for case 2
      if (in_compCtx) {
        const id2: string = this.getVarName(in_compCtx.var_name().text);
        // check if the compartment is already defined.
        let id2VarInfo: Variable | undefined = currST.getVar(id2)
        if (id2VarInfo) {
          // exists, check if it is a compartment
          if (id2VarInfo.canSetType(varTypes.Compartment)) {
            id2VarInfo.type = varTypes.Compartment;
            id1VarInfo.compartment = id2;
            //  check for const
            id1VarInfo.isConst = id1VarInfo.isConst || (in_compCtx.var_name().text.charAt(0) === '$');
          } else {
            //error, trying to say some value is in a noncompartment type
            const errorMessage = incompatibleTypesError(varTypes.Compartment, id2VarInfo);
            const errorUnderline = this.getErrorUnderline(this.getSrcRange(in_compCtx.var_name()), errorMessage, true);
            this.errorList.push(errorUnderline);
          }
        } else {
          // does not exist in ST yet, add as uninitialized compartment (default value).
          let id2VarInfo: Variable = new Variable(varTypes.Compartment, false, undefined, this.getSrcRange(in_compCtx.var_name()), undefined, false);
          currST.setVar(id2, id2VarInfo);
          id1VarInfo.compartment = id2;

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

  visitVariable_in(ctx: Variable_inContext) {
    this.visitNamemaybein(ctx);
  }

  visitReaction_name(ctx: Reaction_nameContext) {
    this.visit(ctx.namemaybein());
    const id = ctx.namemaybein().var_name().text;
    const currST: SymbolTable | undefined = this.getCurrST();
    const idSrcRange: SrcRange = this.getSrcRange(ctx.namemaybein().var_name());

    if (currST) {
      const varInfo: Variable | undefined = currST.getVar(id);

      if (varInfo) {
        if (isSubtTypeOf(varTypes.Reaction, varInfo.type)) {
          varInfo.type = varTypes.Reaction;
        } else {
          const errorMessage = incompatibleTypesError(varTypes.Reaction, varInfo);
          const errorUnderline: ErrorUnderline = this.getErrorUnderline(idSrcRange, errorMessage, true);
          this.errorList.push(errorUnderline);
        }
      }
    }
  }

  visitReaction(ctx: ReactionContext) {
    // visiting will probably need to be done partial manually
    const reactionName: Reaction_nameContext | undefined = ctx.reaction_name()
    let id = "";
    if (reactionName) {
      id = reactionName.namemaybein().text;
      this.handleEventOrReactionName(id, reactionName, varTypes.Reaction);
    }

    const currST: SymbolTable | undefined = this.getCurrST();

    // check if the reaction has a rate rule
    // no need to remember rate rule for error checking?
    if (!ctx.sum()) {
      // although it might make more sense to check in the semantic visitor
      // it really doesn't matter here I think.
      const errorMessage: string = unitializedRateLawWarning(id);
      this.errorList.push(this.getErrorUnderline(this.getSrcRange(ctx), errorMessage, false));
    } else {
      // record that this reaction var has a rate rule assigned to it
      if (reactionName && currST) {
        let varInfo: Variable | undefined = currST.getVar(id);
        if (varInfo) {
          varInfo.initSrcRange = varInfo.idSrcRange;
        }
      }
    }


    // go through children
    // if we have in_comp, we need to set compartment info
    // else we just visit as usual?

    if (ctx.children) {
      let reactionSpecies = new Set<string>();
      for (let i = 0; i < ctx.children.length; i++) {
        this.visit(ctx.children[i]);

        // for compartment case:
        if (ctx.children[i] instanceof Species_listContext) {
          let speciesList: Species_listContext = ctx.children[i] as Species_listContext;
          if (speciesList.children) {
            for (let j = 0; j < speciesList.children.length; j+=2) {
              reactionSpecies.add(speciesList.children[j].text);
            }
          }
        }
      }

      const inComp: In_compContext | undefined = ctx.in_comp();
      if (inComp && currST) {
        // in a compartment! need to know which species are in this reaciton
        // then try to assign compartment to them.

        // get the compartment id
        const compartmentId: string = inComp.var_name().text;
        // check if compartment id already exists;
        let compartmentInfo: Variable | undefined = currST.getVar(compartmentId);
        let validCompartment: boolean = true;
        if (compartmentInfo !== undefined) {
          if (compartmentInfo.canSetType(varTypes.Compartment)) {
            compartmentInfo.type = varTypes.Compartment;
          } else {
            validCompartment = false;
            // type issue!
            const errorMessage = incompatibleTypesError(varTypes.Compartment, compartmentInfo);
            this.errorList.push(this.getErrorUnderline(this.getSrcRange(inComp.var_name()), errorMessage, true));
          }
        } else {
          // compartment id does not exist as a variable yet
          compartmentInfo = new Variable(varTypes.Unknown, false, undefined, this.getSrcRange(inComp.var_name()), undefined, false);
          compartmentInfo.type = varTypes.Compartment;
          currST.setVar(compartmentId, compartmentInfo);
        }


        // if there is a type issue with the compartment, we do not set.
        if (validCompartment) {
          // set reaction id's compartment
          let reactionInfo: Variable | undefined = currST.getVar(id);
          if (reactionInfo) {
            reactionInfo.compartment = compartmentId;
          }

          // set compartment of species in reaction
          for (let speciesId of reactionSpecies) {
            let speciesInfo: Variable | undefined = currST.getVar(speciesId);
            if (speciesInfo && speciesInfo.compartment === undefined) {
              speciesInfo.compartment = compartmentId;
            }
          }
        }
      }
    }
  }

  /**
   * // event
        event : reaction_name? 'at' event_delay? bool_exp event_trigger_list? ':' event_assignment_list;

        event_delay : bool_exp 'after';

        event_trigger_list : (',' event_trigger)*;

        // atom has to be changed to (NUMBER | var_name)
        event_trigger : 't0' '=' BOOLEAN
            | 'priority' '=' sum
            | 'fromTrigger' '=' BOOLEAN
            | 'persistent' '=' BOOLEAN;
   * @param ctx 
   */
  visitEvent(ctx: EventContext) {
    const eventName: Reaction_nameContext | undefined = ctx.reaction_name()
    let id = "";
    if ( eventName) {
      id =  eventName.namemaybein().text;
      this.handleEventOrReactionName(id, eventName, varTypes.Event);
    }

    if (ctx.children) {
      for (let i = 0; i < ctx.children.length; i++) {
        this.visit(ctx.children[i]);
      }
    }
  }

  visitEvent_assignment(ctx: Event_assignmentContext) {
    try {
      const varNameCtx: Var_nameContext = ctx.var_name();
      this.handleParameterVarNameContext(varNameCtx);
      this.visit(ctx.sum());
    } catch(e) {
      // TODO: improve this error message.
      // just error the whole event Assignemnt here for now
      // quite possibly occurs when we have (x > true) instead of (x > 1) for example.
      // but keep this error message for now.
      const errorMessage = (e as Error).message;
      const ErrorUnderline = this.getErrorUnderline(this.getSrcRange(ctx), errorMessage, true);
      this.errorList.push(ErrorUnderline);
      console.error(errorMessage);
    }
  }

  /**
   * handles the reaction_nameContext that declares the
   * id of either a reaction or an event, handling error checking type 
   * assignment, and inserting into the ST if needed.
   * @param id the id of the reaction/event
   * @param name
   * @param type
   */
  private handleEventOrReactionName(id: string, name: Reaction_nameContext, type: varTypes.Event | varTypes.Reaction) {
    this.visit(name.namemaybein());
    const currST: SymbolTable | undefined = this.getCurrST();
    const idSrcRange: SrcRange = this.getSrcRange(name.namemaybein().var_name());

    if (currST) {
      const varInfo: Variable | undefined = currST.getVar(id);

      if (varInfo) {
        if (isSubtTypeOf(type, varInfo.type)) {
          varInfo.type = type;
        } else {
          const errorMessage = incompatibleTypesError(type, varInfo);
          const errorUnderline: ErrorUnderline = this.getErrorUnderline(idSrcRange, errorMessage, true);
          this.errorList.push(errorUnderline);
        }
      }
    }
  }

  private handleParameterVarNameContext(varNameCtx: Var_nameContext) {
    const varName = this.getVarName(varNameCtx.NAME().text);
    const isConst = (varNameCtx.text.charAt(0) === '$');
    const idSrcRange: SrcRange = this.getSrcRange(varNameCtx.NAME());
    
    // if it exists, type checks, etc
    // if not, then add to ST as a parameter.
    const currST: SymbolTable | undefined = this.getCurrST();
    if (currST) {
      let existingVarInfo: Variable | undefined = currST.getVar(varName);

      if (existingVarInfo) {
        // already exists
        if (existingVarInfo.canSetType(varTypes.Parameter)) {
          existingVarInfo.type = varTypes.Parameter;
          existingVarInfo.idSrcRange = idSrcRange;
        } else if (!isSubtTypeOf(existingVarInfo.type, varTypes.Parameter)) {
          const errorMessage = incompatibleTypesError(varTypes.Parameter, existingVarInfo);
          const errorUnderline: ErrorUnderline = this.getErrorUnderline(idSrcRange, errorMessage, true);
          this.errorList.push(errorUnderline);
        }

      } else {
        // does not exist.
        const varInfo = new Variable(varTypes.Parameter, isConst, undefined, idSrcRange, undefined, false);
        currST.setVar(varName, varInfo);
      }
    }
  }

  // this is for sum expressions
  // or perhaps "some" expressions? wink wink XD
  visitAtom(ctx: AtomContext) {
    const varNameCtx: Var_nameContext | undefined = ctx.var_name();
    if (varNameCtx) {
      this.handleParameterVarNameContext(varNameCtx);
    } else {
      // not at an atom that has a varname
      // we only care about ones with varNames because that is 
      // where semantic checking is relevant, so here we just
      // continue on to the children.
      if (ctx.children) {
        for (let i = 0; i < ctx.children.length; i++) {
          this.visit(ctx.children[i]);
        }
      }
    }
  }
}