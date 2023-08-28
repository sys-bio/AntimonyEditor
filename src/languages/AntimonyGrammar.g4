grammar AntimonyGrammar;

model : ('model' | 'module') NAME 'end';

// model : ("model" | "module") NAME simple_stmt_list END;

// NAME : { 'var' | 'const' | 'compartment' | 'species' | 'formula' | 'function' | 'end' | 'model' | 'substanceOnly' }? CNAME;

END : 'end';

var_name : '$'? NAME;
in_comp : 'in' var_name;
namemaybein : var_name (in_comp)?;

empty : 'empty';
reaction_name : namemaybein ':';
reaction : (reaction_name)? species_list ARROW (species_list)? ';' (sum)? (in_comp)?
    | (reaction_name)? (species_list)? ARROW species_list ';' (sum)? (in_comp)?;
species_list : species ('+' species)*;
species : (NUMBER)? '$'? NAME;
ARROW : '->' | '=>';

sum : product (('+' | '-') product)*;

product : atom (('*' | '/') atom)*;

atom : NUMBER | NAME;

// simple_stmt_list : simple_stmt+;

// small_stmt : reaction
//     | assignment
//     | declaration
//     | annotation
//     | unit_declaration
//     | unit_assignment
//     | mmodel_call
//     // | function_call
//     | variable_in
//     | is_assignment
//     | import
//     | interaction
//     | rate_rule
//     | sboterm
//     | event;

NUMBER : [0-9]+;
NAME : [a-zA-Z_] [a-zA-Z0-9_]*;
// CNAME : [a-zA-Z_] [a-zA-Z0-9_]*;
NEWLINE : '\r'? '\n';

WS : [ \t\r\n]+ -> skip;
