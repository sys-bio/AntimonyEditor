// Generated from /Users/evaliu/Documents/AntimonyEditor/src/languages/AntimonyGrammar.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { ModelContext } from "./AntimonyGrammarParser";
import { Var_nameContext } from "./AntimonyGrammarParser";
import { In_compContext } from "./AntimonyGrammarParser";
import { NamemaybeinContext } from "./AntimonyGrammarParser";
import { EmptyContext } from "./AntimonyGrammarParser";
import { Reaction_nameContext } from "./AntimonyGrammarParser";
import { ReactionContext } from "./AntimonyGrammarParser";
import { Species_listContext } from "./AntimonyGrammarParser";
import { SpeciesContext } from "./AntimonyGrammarParser";
import { SumContext } from "./AntimonyGrammarParser";
import { ProductContext } from "./AntimonyGrammarParser";
import { AtomContext } from "./AntimonyGrammarParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `AntimonyGrammarParser`.
 */
export interface AntimonyGrammarListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `AntimonyGrammarParser.model`.
	 * @param ctx the parse tree
	 */
	enterModel?: (ctx: ModelContext) => void;
	/**
	 * Exit a parse tree produced by `AntimonyGrammarParser.model`.
	 * @param ctx the parse tree
	 */
	exitModel?: (ctx: ModelContext) => void;

	/**
	 * Enter a parse tree produced by `AntimonyGrammarParser.var_name`.
	 * @param ctx the parse tree
	 */
	enterVar_name?: (ctx: Var_nameContext) => void;
	/**
	 * Exit a parse tree produced by `AntimonyGrammarParser.var_name`.
	 * @param ctx the parse tree
	 */
	exitVar_name?: (ctx: Var_nameContext) => void;

	/**
	 * Enter a parse tree produced by `AntimonyGrammarParser.in_comp`.
	 * @param ctx the parse tree
	 */
	enterIn_comp?: (ctx: In_compContext) => void;
	/**
	 * Exit a parse tree produced by `AntimonyGrammarParser.in_comp`.
	 * @param ctx the parse tree
	 */
	exitIn_comp?: (ctx: In_compContext) => void;

	/**
	 * Enter a parse tree produced by `AntimonyGrammarParser.namemaybein`.
	 * @param ctx the parse tree
	 */
	enterNamemaybein?: (ctx: NamemaybeinContext) => void;
	/**
	 * Exit a parse tree produced by `AntimonyGrammarParser.namemaybein`.
	 * @param ctx the parse tree
	 */
	exitNamemaybein?: (ctx: NamemaybeinContext) => void;

	/**
	 * Enter a parse tree produced by `AntimonyGrammarParser.empty`.
	 * @param ctx the parse tree
	 */
	enterEmpty?: (ctx: EmptyContext) => void;
	/**
	 * Exit a parse tree produced by `AntimonyGrammarParser.empty`.
	 * @param ctx the parse tree
	 */
	exitEmpty?: (ctx: EmptyContext) => void;

	/**
	 * Enter a parse tree produced by `AntimonyGrammarParser.reaction_name`.
	 * @param ctx the parse tree
	 */
	enterReaction_name?: (ctx: Reaction_nameContext) => void;
	/**
	 * Exit a parse tree produced by `AntimonyGrammarParser.reaction_name`.
	 * @param ctx the parse tree
	 */
	exitReaction_name?: (ctx: Reaction_nameContext) => void;

	/**
	 * Enter a parse tree produced by `AntimonyGrammarParser.reaction`.
	 * @param ctx the parse tree
	 */
	enterReaction?: (ctx: ReactionContext) => void;
	/**
	 * Exit a parse tree produced by `AntimonyGrammarParser.reaction`.
	 * @param ctx the parse tree
	 */
	exitReaction?: (ctx: ReactionContext) => void;

	/**
	 * Enter a parse tree produced by `AntimonyGrammarParser.species_list`.
	 * @param ctx the parse tree
	 */
	enterSpecies_list?: (ctx: Species_listContext) => void;
	/**
	 * Exit a parse tree produced by `AntimonyGrammarParser.species_list`.
	 * @param ctx the parse tree
	 */
	exitSpecies_list?: (ctx: Species_listContext) => void;

	/**
	 * Enter a parse tree produced by `AntimonyGrammarParser.species`.
	 * @param ctx the parse tree
	 */
	enterSpecies?: (ctx: SpeciesContext) => void;
	/**
	 * Exit a parse tree produced by `AntimonyGrammarParser.species`.
	 * @param ctx the parse tree
	 */
	exitSpecies?: (ctx: SpeciesContext) => void;

	/**
	 * Enter a parse tree produced by `AntimonyGrammarParser.sum`.
	 * @param ctx the parse tree
	 */
	enterSum?: (ctx: SumContext) => void;
	/**
	 * Exit a parse tree produced by `AntimonyGrammarParser.sum`.
	 * @param ctx the parse tree
	 */
	exitSum?: (ctx: SumContext) => void;

	/**
	 * Enter a parse tree produced by `AntimonyGrammarParser.product`.
	 * @param ctx the parse tree
	 */
	enterProduct?: (ctx: ProductContext) => void;
	/**
	 * Exit a parse tree produced by `AntimonyGrammarParser.product`.
	 * @param ctx the parse tree
	 */
	exitProduct?: (ctx: ProductContext) => void;

	/**
	 * Enter a parse tree produced by `AntimonyGrammarParser.atom`.
	 * @param ctx the parse tree
	 */
	enterAtom?: (ctx: AtomContext) => void;
	/**
	 * Exit a parse tree produced by `AntimonyGrammarParser.atom`.
	 * @param ctx the parse tree
	 */
	exitAtom?: (ctx: AtomContext) => void;
}

