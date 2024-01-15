
// this is a record type wow!
// should probably make this the return of a function 
// in an error class, so that valid line/column values 
// can be checked.
export type SrcPosition = {
    line: number;
    column: number;
}

/**
 * represents a location range relative to the
 * web editor in terms of line and column
 */
export type SrcRange = {
    start: SrcPosition;
    stop: SrcPosition;
}

/**
 * stores information about variables
 * in a symbol table
 */
export type STVariableInfo = {
    type: string;
    initialized: boolean;
    compartments: string;
    srcRange: SrcRange;
}


/**
 * A Symbol table!
 */
export class SymbolTable {
    // a map from variable name to a list of positions 
    // this variable is found to be declared.
    // this takes care of variable reassignment during ST buildup
    private varMap: Map<string, STVariableInfo>;

    constructor() {
        this.varMap = new Map();
    }

    /**
     * Adds variable with varName and info varInfo to the ST 
     * @param varName name of variable
     * @param varInfo a STVariableInfo that contains information about the variable
     */
    setVar(varName: string, varInfo: STVariableInfo): void {
        // if (!this.varMap.has(varName)) {
        //     this.varMap.set(varName);
        // }
        // this.varMap.get(varName)?.push(varInfo);
        this.varMap.set(varName, varInfo);
    }

    /**
     * looks up a variable
     * @param varName variable name to look up in the ST
     * @returns a STVariableInfo if the variable exists, and undefined otherwise
     */
    getVar(varName: string) {
        let varInfo = this.varMap.get(varName);
        return varInfo;
        // if (varInfo) { 
        //     return varInfo[varInfo.length - 1];
        // } else {
        //     return undefined;
        // }
    }
}

/**
 * symbol table for the global scope in an Antimony file
 */
export class GlobalST extends SymbolTable {
    private funcMap: Map<string, FuncST>;
    private modelMap: Map<string, ModelST>

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
            this.funcMap.set(funcName, new FuncST(srcRange));
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
            this.modelMap.set(modelName, new ModelST(srcRange));
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
}

/**
 * Symbol table for a function
 */
export class FuncST extends SymbolTable {
    // this contains the location of the function name id
    private funcIdRange: SrcRange;

    constructor(srcRange: SrcRange) {
        super();
        this.funcIdRange = srcRange;
    }

    /**
     * 
     * @returns the position of the function ID within the web editor
     */
    getPosition(): SrcRange {
        return this.funcIdRange;
    }
}

/**
 * Symbol table for a model
 */
export class ModelST extends SymbolTable {
    // this contains the location of the model name id
    private modelIdRange: SrcRange;

    constructor(srcRange: SrcRange) {
        super();
        this.modelIdRange = srcRange;
    }

    /**
     * 
     * @returns the position of the model ID within the web editor
     */
    getPosition(): SrcRange {
        return this.modelIdRange;
    }
}

/**
 * Symbol table for a modular model
 */
export class MModelST extends ModelST {
    private params: string[];
    
    constructor(srcRange: SrcRange, paramsIn: string[]) {
        super(srcRange);
        this.params = paramsIn;
    }
}
