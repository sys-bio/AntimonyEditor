grammar AntimonyGrammar;

// import

// entry point for parser
model : NEWLINE? COMMENT? ('model' | 'module') NAME '()'? simple_stmt_list END;

// end of model
END : 'end';

var_name : '$'? NAME;
in_comp : 'in' var_name;
namemaybein : var_name (in_comp)?;

empty : ;
// reactions
reaction_name : namemaybein ':';
reaction : (reaction_name)? species_list ARROW (species_list)? ';' (sum)? (in_comp)?
    | (reaction_name)? (species_list)? ARROW species_list ';' (sum)? (in_comp)?;
species_list : species ('+' species)*;
species : (NUMBER)? ('$')? NAME;
ARROW : '->' | '=>';

// interaction

// event

// boolean

// compare

// logical

// sboterm

// assignment
assignment : namemaybein ('=' | AEQ) sum;

AEQ : ':=';

// apostrophe and rate rule

// annotation

// declaration
declaration : decl_modifiers decl_item (',' decl_item)*;
decl_modifiers : TYPE_MODIFIER;
decl_item : namemaybein (decl_assignment)?;
decl_assignment : '=' sum;

// unit

// model call, reaction name?

// modifiers
// VAR_MODIFIER: ('var' | 'const')
// SUB_MODIFIER: /\b(substanceOnly)\b/
TYPE_MODIFIER: ('species' | 'compartment' | 'formula');

// math (add more from lark later)
sum : product
    | sum '+' product
    | sum '-' product;

product : power
    | product '*' power
    | product '/' power;

power: atom
    | power '^' atom
    | 'exp' atom;

atom : NUMBER
    | var_name
    | NUMBER var_name
    | '-' atom
    | '+' atom
    | '(' sum ')';
    // | func_call
    // | '(' bool_exp ')';

// func_call : var_name '(' (parameters)? ')';

// func call

// body of model
simple_stmt : (small_stmt)? (';' | NEWLINE);

small_stmt : reaction 
    | assignment
    | declaration;

simple_stmt_list : simple_stmt+;

// modular model (worry about that at a later date)

// function
// parameters : (bool_exp) (',' (bool_exp))*

// parameters

// init params

// var in

// is assignment

// comment
// fix this later for the multiline comment and #
COMMENT : '//' ~[\r\n]* NEWLINE -> skip;

// root / file

// name 
NAME : ('species' | 'compartment' | 'var' | 'const' | 'formula' | 'function' | 'end' | 'model' | 'substanceOnly' | 'in')? CNAME;

// manual coding of import cname from lark
CNAME: ('_' | LETTER) ('_' | LETTER | DIGIT)*;
LETTER: UCASE_LETTER | LCASE_LETTER;
WORD: LETTER+;
LCASE_LETTER: [a-z];
UCASE_LETTER: [A-Z];
DIGIT: [0-9];

// etc
NUMBER : [0-9]+;
NEWLINE : '\r'? '\n';
WS : [ \t\r\n]+ -> skip;
