import { SrcRange, varTypes } from "./Types";
import { Variable } from "./Variable";


/**
 * 
 * @param newType the type we are trying to set oldVar to
 * @param oldVar Variable representing oldVar
 * @returns the error message string
 */
export function incompatibleTypesError(newType: varTypes, oldVar: Variable): string {
  const errorMessage: string = "Unable to set the type to '" + newType +
                               "' because it is already set to be the incompatible type '"+ oldVar.type +
                               "' on line " + 
                               oldVar.idSrcRange.start.toString();
  return errorMessage;
}

/**
 * 
 * @param name the name of the model
 * @param srcRange the model id location at definition
 * @returns the error message
 */
export function modelAlreadyExistsError(name: string, srcRange: SrcRange): string {
  return 'model \'' + name + '\' already defined on line ' + srcRange.start.toString();
}

/**
 * 
 * @param name the name of the function
 * @param srcRange the function id location at definition
 * @returns the error message
 */
export function functionAlreadyExistsError(name: string, srcRange: SrcRange): string {
  return 'function \'' + name + '\' already defined on line ' + srcRange.start.toString();
}

/**
 * Warning over the assignment being overriden
 * @param name the name of the id being overriden
 * @param srcRange the position of the new overriding value assignment
 * @returns warning message
 */
export function overriddenValueWarning(name: string, srcRange: SrcRange): string {
  const warningMessage: string  = "Value assignment to '" + name +
                       "' is being overridden by a later assignment on line " +
                       srcRange.start.toString();
  return warningMessage;
}

/**
 * Warning over the assignemtn doing the overriding
 * @param name id being given value assignment
 * @param srcRange srcRange of the previous assignment now overriden
 * @returns warning message
 */
export function overridingValueWarning(name: string, srcRange: SrcRange): string {
  const warningMessage: string = "Value assignment to '" + name +
                        "' is overriding previous assignment on line " +
                        srcRange.start.toString()
  return warningMessage;
}

/**
 * Warning over a reaction that has no rate law
 * @returns warning message
 */
export function unitializedRateLawWarning(id: string): string {
  return "Reaction '"+ id +"' missing rate law";
}

/**
 * 
 * @param id 
 * @returns 
 */
export function unitializedParameterError(id: string): string {
  return "Parameter \'" + id + "\' missing value assignment";
}

/**
 * 
 * @param id 
 * @returns 
 */
export function defaultValueWarning(id: string): string {
  return "Species \'" + id + "\' has not been initialized, using default value";
}

export {}