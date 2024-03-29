import { SrcRange, isSubtTypeOf, varTypes } from "./Types"



export class Variable {
    /**
     * id: the id of the variable, ie A = 1 has id A
     * type: the type of the variable, ie species A has type species
     * isConst: is this variable a constant?
     * compartment: is this variable in a compartment? if so which one.
     * initialzied: has this variable been initalized? ie A = 1 initializes value to A
     * idSrcRange: the editor location of the id of this variable
     * initSrcRange: the editor location where this variable is initialized.
     */
    // public id: string;
    public type: varTypes;
    public isConst: boolean;
    public compartment: string | undefined;
    // // do we even need an initialized field if we have initSrcRange?
    // public initialized: boolean;
    public idSrcRange: SrcRange;
    public initSrcRange: SrcRange | undefined;
    public substanceOnly: boolean;
    public value: string | undefined; // for numerical values
    public displayName: string | undefined;
    public annotations: string[];
    public refLocations: Set<string>;

    constructor(type: varTypes,
                isConst: boolean, 
                compartment: string | undefined, 
                idSrcRange: SrcRange,
                initSrcRange: SrcRange | undefined,
                substanceOnly: boolean) {
        // this.id = id;
        this.type = type;
        this.isConst = isConst;
        this.compartment = compartment;
        this.idSrcRange = idSrcRange;
        this.initSrcRange = initSrcRange;
        this.substanceOnly = substanceOnly;
        this.value = undefined;
        this.displayName = undefined;
        this.annotations = [];
        this.refLocations = new Set();
        this.refLocations.add(idSrcRange.toString());
    }

    /**
     * returns true when the variable can be set to 
     * newType, false otherwise. Only checks if the type
     * can be set, does not actually set the type.
     * 
     * TODO: fix this, is currently the reverse of what it should be.
     * @param newType 
     * @returns true or false
     */
    public canSetType(newType: varTypes): boolean {
        return isSubtTypeOf(newType, this.type);
    }
}



export {}