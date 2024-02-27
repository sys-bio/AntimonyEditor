// empty
// gonna try and copy the way vscode antimony does things.

export class SrcPosition {
    public line: number;
    public column: number;

    constructor(line: number, column: number) {
        this.line = line;
        this.column = column;
    }

    public toString() {
        return this.line + ':' + this.column;
    }
}

export class SrcRange {
    public start: SrcPosition;
    public end: SrcPosition;

    constructor(start: SrcPosition, stop: SrcPosition) {
        this.start = start;
        this.end = stop;
    }

    public toString() {
        return this.start.toString() + ' - ' + this.end.toString();
    }
}


//---------------------------------------//


// copied from vscode-antimony types file.
export enum varTypes {
    Unknown = 'unknown',
    Const = 'const',
    
    // Subtypes of unknown
    Variable = 'variable',
    // TODO: may not need submodel/model/function as these are represented by ST's?
    Submodel = 'submodel',
    Model = 'model',
    Function = 'function',
    Unit = 'unit',
    ModularModel = 'mmodel',
    Import = 'import',

    // Subtype of Variable, also known as "formula"
    Parameter = 'parameter',

    // Subtypes of Parameter
    Species = 'species',
    Compartment = 'compartment',
    Reaction = 'reaction',
    Interaction = 'interaction',
    Event = 'event',
    Constraint = 'constraint',

    // what is deleted a subtype of?
    Deleted = 'deleted',
}

export function getTypeFromString(type: string): varTypes {
    switch(type) {
        case 'species':
            return varTypes.Species;
        case 'compartment':
            return varTypes.Compartment;
        case 'const':
            return varTypes.Const;
        case 'var':
            return varTypes.Variable;
        default:
            // this *should* be caught by parsing.
            // error out for now
            console.error("weird/bad type found " + type);
            return varTypes.Unknown;
    }
}

/**
 * returns if type1 is a subtype (derives from) type2
 * copy of 'derives_from' method in vscode-antimony types file for now
 * https://github.com/sys-bio/vscode-antimony/blob/master/vscode-antimony/src/server/stibium/stibium/types.py
 * @param type1 
 * @param type2 
 */
export function isSubtTypeOf(type1: varTypes, type2: varTypes) {
    if (type1 === type2) {
        return true;
    }

    if (type2 === varTypes.Unknown) {
        return true;
    }

    let set = new Set();
    set.add(varTypes.Species);
    set.add(varTypes.Compartment);
    set.add(varTypes.Reaction);
    set.add(varTypes.Constraint);
    set.add(varTypes.Event);

    let derives_from_param: boolean = set.has(type1);

    if (type2 === varTypes.Variable) {
        return derives_from_param || type1 === varTypes.Parameter;
    }

    if (type2 === varTypes.Parameter) {
        return derives_from_param;
    }

    // set.add(varTypes.Parameter);
    // if (set.has(type1) && !set.has(type2)) {
    //     return false;
    // }

    // if (set.has(type2) && !set.has(type1)) {
    //     return false;
    // }

    return false;
}