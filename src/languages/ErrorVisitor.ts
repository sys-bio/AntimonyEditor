import { AbstractParseTreeVisitor } from 'antlr4ts/tree'
import { AntimonyGrammarVisitor } from './antlr/AntimonyGrammarVisitor';
import { GlobalST} from './SymbolTableClasses';
import { ErrorUnderline } from './Types';

export class ErrorVisitor extends AbstractParseTreeVisitor<void> implements AntimonyGrammarVisitor<void> {
  public globalST: GlobalST;
  protected errorList: ErrorUnderline[];
  
  // these keep track of scoping when traversing 
  // so we know to which ST to add a variable: 
  protected currNameAndScope: ErrorVisitor.nameAndScope | undefined;

  constructor(globalST: GlobalST) {
    super();
    this.globalST = globalST;
    this.currNameAndScope = undefined;
    this.errorList = [];
  }

  protected defaultResult(): void {
  }

  /**
   * gets the list of accumulated errors
   * @returns 
   */
  public getErrors(): ErrorUnderline[] {
    return this.errorList;
  }

  /**
   * concats the input error list with the one present within the visitor
   * @param errors 
   */
  public addErrorList(errors: ErrorUnderline[]) {
    this.errorList = this.errorList.concat(errors);
  }
}

module ErrorVisitor {
  export type scope = "model" | "mmodel" | "function";
  export type nameAndScope = {name: string, scope: scope};
}