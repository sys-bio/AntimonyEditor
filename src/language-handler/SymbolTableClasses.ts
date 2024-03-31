import { SrcRange, varTypes } from "./Types";
import { Variable } from "./Variable";


/**
 * A Symbol table!
 */
export class SymbolTable {
    // a map from variable name to a list of positions 
    // this variable is found to be declared.
    // this takes care of variable reassignment during ST buildup
    private varMap: Map<string, Variable>;

    constructor() {
        this.varMap = new Map();
    }

    /**
     * Adds variable with varName and info varInfo to the ST 
     * @param varName name of variable
     * @param varInfo a Variable that contains information about the variable
     */
    setVar(varName: string, varInfo: Variable): void {
        // if (!this.varMap.has(varName)) {
        //     this.varMap.set(varName);
        // }
        // this.varMap.get(varName)?.push(varInfo);
        this.varMap.set(varName, varInfo);
    }

    /**
     * looks up a variable
     * @param varName variable name to look up in the ST
     * @returns a Variable if the variable exists, and undefined otherwise
     */
    getVar(varName: string) {
        let varInfo = this.varMap.get(varName);
        return varInfo;
    }
}

/**
 * symbol table for the global scope in an Antimony file
 */
export class GlobalST extends SymbolTable {
    private funcMap: Map<string, ParamAndNameTable>;
    private modelMap: Map<string, ParamAndNameTable>

    constructor() {
        super();
        this.funcMap = new Map();
        this.modelMap = new Map();
    }

    /**
     * inserts a function into the global ST, creating a corresponding function ST for it
     * @param funcName 
     * @param srcRange the location of the function ID within the web editor
     */
    setFunction(funcName: string, srcRange: SrcRange): void {
        if (!this.funcMap.has(funcName)) {
            this.funcMap.set(funcName, new ParamAndNameTable(srcRange));
            this.setVar(funcName, new Variable(varTypes.Function, false, undefined, srcRange, srcRange, false));
        } else {
            // function already exists
            console.log("function " + funcName + " already exists")
        }
    }

    /**
     * looks up a function in the global ST
     * @param funcName 
     * @returns the symbol table for the function if it exists, undefined otherwise.
     */
    getFunctionST(funcName: string) {
        return this.funcMap.get(funcName);
    }

    /**
     * inserts a model into the global ST, creating a corresponding model ST for it
     * @param modelName 
     * @param srcRange the location of the model ID within the web editor
     */
    setModel(modelName: string, srcRange: SrcRange): void {
        if (!this.modelMap.has(modelName)) {
            this.modelMap.set(modelName, new ParamAndNameTable(srcRange));
            this.setVar(modelName, new Variable(varTypes.Model, false, undefined, srcRange, srcRange, false));
        } else {
            // model already exists
            console.log("model " + modelName + " already exists")
        }
    }

    /**
     * looks up a model in the global ST
     * @param modelName 
     * @returns the symbol table for the model if it exists, undefined otherwise
     */
    getModelST(modelName: string) {
        return this.modelMap.get(modelName);
    }

    /**
     * looks up a var with id that exists at srcRange
     * @param id 
     * @param srcRange 
     * @returns the variable of the info of that variable if it exists
     *          undefined if a variable does not exist at that location and id
     */
    hasVarAtLocation(id: string, srcRange: SrcRange): Variable | undefined {
        let varInfo: Variable | undefined = this.getVar(id);
        if (varInfo && varInfo.refLocations.has(srcRange.toString())) {
            return varInfo;
        }

        for (const [key, funcST] of this.funcMap) {
            varInfo = funcST.getVar(id);
            if (varInfo && varInfo.refLocations.has(srcRange.toString())) {
                return varInfo;
            }
        }

        
        for (const [key, modelST] of this.modelMap) {
            varInfo = modelST.getVar(id);
            if (varInfo && varInfo.refLocations.has(srcRange.toString())) {
                return varInfo;
            }
        }

        return undefined;
    }
}

/**
 * a ST that is used for functions and models
 */
export class ParamAndNameTable extends SymbolTable {
    private srcRange: SrcRange;
    public params: string[];
    public paramSet: Set<string>;

    constructor(srcRange: SrcRange) {
        super();
        this.srcRange = srcRange;
        this.params = []
        this.paramSet = new Set();
    }

    /**
     * gets the id positino of the model or function represented by this ST
     * @returns a SrcRange representing the position of the id that represents this table
     */
    public getPosition(): SrcRange {
        return this.srcRange;
    }

    /**
     * adds a parameter to either a model or function
     * assumes that this parameter name is unique and has not been added before.
     * @param name 
     */
    public addParameter(name: string) {
        this.params.push(name);
        this.paramSet.add(name);
    }
}

// these may be needed in the future if more info specific to 
// models are needed
// /**
//  * Symbol table for a function
//  */
// export class FuncST extends ParamAndNameTable {
// }

// /**
//  * Symbol table for a model
//  * Note: treat model and mmodels as the same thing?
//  * only thing that matters is params being non zero length
//  * for mmodel
//  * 
//  * TODO: make a decision, make fields private or public???
//  */
// export class ModelST extends ParamAndNameTable {
// }
