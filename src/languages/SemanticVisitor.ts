import { AbstractParseTreeVisitor } from "antlr4ts/tree";
import { AntimonyGrammarVisitor } from "./antlr/AntimonyGrammarVisitor";
import { GlobalST } from "./SymbolTableClasses";
import { ErrorVisitor } from "./ErrorVisitor";




// goal is to loop through and look at all variables, classes, 
export class SemanticVisitor extends ErrorVisitor {

}