// Generated from /Users/evaliu/Documents/AntimonyEditor/src/languages/AntimonyGrammar.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { ModelContext } from "./AntimonyGrammarParser";
import { Var_nameContext } from "./AntimonyGrammarParser";
import { In_compContext } from "./AntimonyGrammarParser";
import { NamemaybeinContext } from "./AntimonyGrammarParser";
import { EmptyContext } from "./AntimonyGrammarParser";
import { Reaction_nameContext } from "./AntimonyGrammarParser";
import { ReactionContext } from "./AntimonyGrammarParser";
import { Species_listContext } from "./AntimonyGrammarParser";
import { SpeciesContext } from "./AntimonyGrammarParser";
import { AssignmentContext } from "./AntimonyGrammarParser";
import { DeclarationContext } from "./AntimonyGrammarParser";
import { Decl_modifiersContext } from "./AntimonyGrammarParser";
import { Decl_itemContext } from "./AntimonyGrammarParser";
import { Decl_assignmentContext } from "./AntimonyGrammarParser";
import { SumContext } from "./AntimonyGrammarParser";
import { ProductContext } from "./AntimonyGrammarParser";
import { PowerContext } from "./AntimonyGrammarParser";
import { AtomContext } from "./AntimonyGrammarParser";
import { Simple_stmtContext } from "./AntimonyGrammarParser";
import { Small_stmtContext } from "./AntimonyGrammarParser";
import { Simple_stmt_listContext } from "./AntimonyGrammarParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `AntimonyGrammarParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface AntimonyGrammarVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.model`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitModel?: (ctx: ModelContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.var_name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVar_name?: (ctx: Var_nameContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.in_comp`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIn_comp?: (ctx: In_compContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.namemaybein`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNamemaybein?: (ctx: NamemaybeinContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.empty`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEmpty?: (ctx: EmptyContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.reaction_name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReaction_name?: (ctx: Reaction_nameContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.reaction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReaction?: (ctx: ReactionContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.species_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSpecies_list?: (ctx: Species_listContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.species`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSpecies?: (ctx: SpeciesContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.assignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignment?: (ctx: AssignmentContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.declaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclaration?: (ctx: DeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.decl_modifiers`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecl_modifiers?: (ctx: Decl_modifiersContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.decl_item`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecl_item?: (ctx: Decl_itemContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.decl_assignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecl_assignment?: (ctx: Decl_assignmentContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.sum`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSum?: (ctx: SumContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.product`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProduct?: (ctx: ProductContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.power`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPower?: (ctx: PowerContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.atom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAtom?: (ctx: AtomContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.simple_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSimple_stmt?: (ctx: Simple_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.small_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSmall_stmt?: (ctx: Small_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `AntimonyGrammarParser.simple_stmt_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSimple_stmt_list?: (ctx: Simple_stmt_listContext) => Result;
}

