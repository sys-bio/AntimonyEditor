// Generated from /Users/evaliu/Documents/AntimonyEditor/src/languages/AntimonyGrammar.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { AntimonyGrammarListener } from "./AntimonyGrammarListener";
import { AntimonyGrammarVisitor } from "./AntimonyGrammarVisitor";


export class AntimonyGrammarParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly T__9 = 10;
	public static readonly T__10 = 11;
	public static readonly T__11 = 12;
	public static readonly T__12 = 13;
	public static readonly T__13 = 14;
	public static readonly T__14 = 15;
	public static readonly T__15 = 16;
	public static readonly T__16 = 17;
	public static readonly END = 18;
	public static readonly ARROW = 19;
	public static readonly AEQ = 20;
	public static readonly TYPE_MODIFIER = 21;
	public static readonly COMMENT = 22;
	public static readonly NAME = 23;
	public static readonly CNAME = 24;
	public static readonly LETTER = 25;
	public static readonly WORD = 26;
	public static readonly LCASE_LETTER = 27;
	public static readonly UCASE_LETTER = 28;
	public static readonly DIGIT = 29;
	public static readonly NUMBER = 30;
	public static readonly NEWLINE = 31;
	public static readonly WS = 32;
	public static readonly RULE_model = 0;
	public static readonly RULE_var_name = 1;
	public static readonly RULE_in_comp = 2;
	public static readonly RULE_namemaybein = 3;
	public static readonly RULE_empty = 4;
	public static readonly RULE_reaction_name = 5;
	public static readonly RULE_reaction = 6;
	public static readonly RULE_species_list = 7;
	public static readonly RULE_species = 8;
	public static readonly RULE_assignment = 9;
	public static readonly RULE_declaration = 10;
	public static readonly RULE_decl_modifiers = 11;
	public static readonly RULE_decl_item = 12;
	public static readonly RULE_decl_assignment = 13;
	public static readonly RULE_sum = 14;
	public static readonly RULE_product = 15;
	public static readonly RULE_power = 16;
	public static readonly RULE_atom = 17;
	public static readonly RULE_simple_stmt = 18;
	public static readonly RULE_small_stmt = 19;
	public static readonly RULE_simple_stmt_list = 20;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"model", "var_name", "in_comp", "namemaybein", "empty", "reaction_name", 
		"reaction", "species_list", "species", "assignment", "declaration", "decl_modifiers", 
		"decl_item", "decl_assignment", "sum", "product", "power", "atom", "simple_stmt", 
		"small_stmt", "simple_stmt_list",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'model'", "'module'", "'()'", "'$'", "'in'", "':'", "';'", 
		"'+'", "'='", "','", "'-'", "'*'", "'/'", "'^'", "'exp'", "'('", "')'", 
		"'end'", undefined, "':='",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, "END", "ARROW", "AEQ", "TYPE_MODIFIER", 
		"COMMENT", "NAME", "CNAME", "LETTER", "WORD", "LCASE_LETTER", "UCASE_LETTER", 
		"DIGIT", "NUMBER", "NEWLINE", "WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(AntimonyGrammarParser._LITERAL_NAMES, AntimonyGrammarParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return AntimonyGrammarParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "AntimonyGrammar.g4"; }

	// @Override
	public get ruleNames(): string[] { return AntimonyGrammarParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return AntimonyGrammarParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(AntimonyGrammarParser._ATN, this);
	}
	// @RuleVersion(0)
	public model(): ModelContext {
		let _localctx: ModelContext = new ModelContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, AntimonyGrammarParser.RULE_model);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 43;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AntimonyGrammarParser.NEWLINE) {
				{
				this.state = 42;
				this.match(AntimonyGrammarParser.NEWLINE);
				}
			}

			this.state = 46;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AntimonyGrammarParser.COMMENT) {
				{
				this.state = 45;
				this.match(AntimonyGrammarParser.COMMENT);
				}
			}

			this.state = 48;
			_la = this._input.LA(1);
			if (!(_la === AntimonyGrammarParser.T__0 || _la === AntimonyGrammarParser.T__1)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 49;
			this.match(AntimonyGrammarParser.NAME);
			this.state = 51;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AntimonyGrammarParser.T__2) {
				{
				this.state = 50;
				this.match(AntimonyGrammarParser.T__2);
				}
			}

			this.state = 53;
			this.simple_stmt_list();
			this.state = 54;
			this.match(AntimonyGrammarParser.END);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public var_name(): Var_nameContext {
		let _localctx: Var_nameContext = new Var_nameContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, AntimonyGrammarParser.RULE_var_name);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 57;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AntimonyGrammarParser.T__3) {
				{
				this.state = 56;
				this.match(AntimonyGrammarParser.T__3);
				}
			}

			this.state = 59;
			this.match(AntimonyGrammarParser.NAME);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public in_comp(): In_compContext {
		let _localctx: In_compContext = new In_compContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, AntimonyGrammarParser.RULE_in_comp);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 61;
			this.match(AntimonyGrammarParser.T__4);
			this.state = 62;
			this.var_name();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public namemaybein(): NamemaybeinContext {
		let _localctx: NamemaybeinContext = new NamemaybeinContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, AntimonyGrammarParser.RULE_namemaybein);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 64;
			this.var_name();
			this.state = 66;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AntimonyGrammarParser.T__4) {
				{
				this.state = 65;
				this.in_comp();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public empty(): EmptyContext {
		let _localctx: EmptyContext = new EmptyContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, AntimonyGrammarParser.RULE_empty);
		try {
			this.enterOuterAlt(_localctx, 1);
			// tslint:disable-next-line:no-empty
			{
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public reaction_name(): Reaction_nameContext {
		let _localctx: Reaction_nameContext = new Reaction_nameContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, AntimonyGrammarParser.RULE_reaction_name);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 70;
			this.namemaybein();
			this.state = 71;
			this.match(AntimonyGrammarParser.T__5);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public reaction(): ReactionContext {
		let _localctx: ReactionContext = new ReactionContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, AntimonyGrammarParser.RULE_reaction);
		let _la: number;
		try {
			this.state = 103;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 13, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 74;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 5, this._ctx) ) {
				case 1:
					{
					this.state = 73;
					this.reaction_name();
					}
					break;
				}
				this.state = 76;
				this.species_list();
				this.state = 77;
				this.match(AntimonyGrammarParser.ARROW);
				this.state = 79;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AntimonyGrammarParser.T__3) | (1 << AntimonyGrammarParser.NAME) | (1 << AntimonyGrammarParser.NUMBER))) !== 0)) {
					{
					this.state = 78;
					this.species_list();
					}
				}

				this.state = 81;
				this.match(AntimonyGrammarParser.T__6);
				this.state = 83;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AntimonyGrammarParser.T__3) | (1 << AntimonyGrammarParser.T__7) | (1 << AntimonyGrammarParser.T__10) | (1 << AntimonyGrammarParser.T__14) | (1 << AntimonyGrammarParser.T__15) | (1 << AntimonyGrammarParser.NAME) | (1 << AntimonyGrammarParser.NUMBER))) !== 0)) {
					{
					this.state = 82;
					this.sum(0);
					}
				}

				this.state = 86;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AntimonyGrammarParser.T__4) {
					{
					this.state = 85;
					this.in_comp();
					}
				}

				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 89;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 9, this._ctx) ) {
				case 1:
					{
					this.state = 88;
					this.reaction_name();
					}
					break;
				}
				this.state = 92;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AntimonyGrammarParser.T__3) | (1 << AntimonyGrammarParser.NAME) | (1 << AntimonyGrammarParser.NUMBER))) !== 0)) {
					{
					this.state = 91;
					this.species_list();
					}
				}

				this.state = 94;
				this.match(AntimonyGrammarParser.ARROW);
				this.state = 95;
				this.species_list();
				this.state = 96;
				this.match(AntimonyGrammarParser.T__6);
				this.state = 98;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AntimonyGrammarParser.T__3) | (1 << AntimonyGrammarParser.T__7) | (1 << AntimonyGrammarParser.T__10) | (1 << AntimonyGrammarParser.T__14) | (1 << AntimonyGrammarParser.T__15) | (1 << AntimonyGrammarParser.NAME) | (1 << AntimonyGrammarParser.NUMBER))) !== 0)) {
					{
					this.state = 97;
					this.sum(0);
					}
				}

				this.state = 101;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AntimonyGrammarParser.T__4) {
					{
					this.state = 100;
					this.in_comp();
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public species_list(): Species_listContext {
		let _localctx: Species_listContext = new Species_listContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, AntimonyGrammarParser.RULE_species_list);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 105;
			this.species();
			this.state = 110;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AntimonyGrammarParser.T__7) {
				{
				{
				this.state = 106;
				this.match(AntimonyGrammarParser.T__7);
				this.state = 107;
				this.species();
				}
				}
				this.state = 112;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public species(): SpeciesContext {
		let _localctx: SpeciesContext = new SpeciesContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, AntimonyGrammarParser.RULE_species);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 114;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AntimonyGrammarParser.NUMBER) {
				{
				this.state = 113;
				this.match(AntimonyGrammarParser.NUMBER);
				}
			}

			this.state = 117;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AntimonyGrammarParser.T__3) {
				{
				this.state = 116;
				this.match(AntimonyGrammarParser.T__3);
				}
			}

			this.state = 119;
			this.match(AntimonyGrammarParser.NAME);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public assignment(): AssignmentContext {
		let _localctx: AssignmentContext = new AssignmentContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, AntimonyGrammarParser.RULE_assignment);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 121;
			this.namemaybein();
			this.state = 122;
			_la = this._input.LA(1);
			if (!(_la === AntimonyGrammarParser.T__8 || _la === AntimonyGrammarParser.AEQ)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 123;
			this.sum(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declaration(): DeclarationContext {
		let _localctx: DeclarationContext = new DeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, AntimonyGrammarParser.RULE_declaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 125;
			this.decl_modifiers();
			this.state = 126;
			this.decl_item();
			this.state = 131;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AntimonyGrammarParser.T__9) {
				{
				{
				this.state = 127;
				this.match(AntimonyGrammarParser.T__9);
				this.state = 128;
				this.decl_item();
				}
				}
				this.state = 133;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public decl_modifiers(): Decl_modifiersContext {
		let _localctx: Decl_modifiersContext = new Decl_modifiersContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, AntimonyGrammarParser.RULE_decl_modifiers);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 134;
			this.match(AntimonyGrammarParser.TYPE_MODIFIER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public decl_item(): Decl_itemContext {
		let _localctx: Decl_itemContext = new Decl_itemContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, AntimonyGrammarParser.RULE_decl_item);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 136;
			this.namemaybein();
			this.state = 138;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AntimonyGrammarParser.T__8) {
				{
				this.state = 137;
				this.decl_assignment();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public decl_assignment(): Decl_assignmentContext {
		let _localctx: Decl_assignmentContext = new Decl_assignmentContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, AntimonyGrammarParser.RULE_decl_assignment);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 140;
			this.match(AntimonyGrammarParser.T__8);
			this.state = 141;
			this.sum(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sum(): SumContext;
	public sum(_p: number): SumContext;
	// @RuleVersion(0)
	public sum(_p?: number): SumContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: SumContext = new SumContext(this._ctx, _parentState);
		let _prevctx: SumContext = _localctx;
		let _startState: number = 28;
		this.enterRecursionRule(_localctx, 28, AntimonyGrammarParser.RULE_sum, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			{
			this.state = 144;
			this.product(0);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 154;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 20, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 152;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 19, this._ctx) ) {
					case 1:
						{
						_localctx = new SumContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, AntimonyGrammarParser.RULE_sum);
						this.state = 146;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 147;
						this.match(AntimonyGrammarParser.T__7);
						this.state = 148;
						this.product(0);
						}
						break;

					case 2:
						{
						_localctx = new SumContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, AntimonyGrammarParser.RULE_sum);
						this.state = 149;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 150;
						this.match(AntimonyGrammarParser.T__10);
						this.state = 151;
						this.product(0);
						}
						break;
					}
					}
				}
				this.state = 156;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 20, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public product(): ProductContext;
	public product(_p: number): ProductContext;
	// @RuleVersion(0)
	public product(_p?: number): ProductContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ProductContext = new ProductContext(this._ctx, _parentState);
		let _prevctx: ProductContext = _localctx;
		let _startState: number = 30;
		this.enterRecursionRule(_localctx, 30, AntimonyGrammarParser.RULE_product, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			{
			this.state = 158;
			this.power(0);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 168;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 22, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 166;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 21, this._ctx) ) {
					case 1:
						{
						_localctx = new ProductContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, AntimonyGrammarParser.RULE_product);
						this.state = 160;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 161;
						this.match(AntimonyGrammarParser.T__11);
						this.state = 162;
						this.power(0);
						}
						break;

					case 2:
						{
						_localctx = new ProductContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, AntimonyGrammarParser.RULE_product);
						this.state = 163;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 164;
						this.match(AntimonyGrammarParser.T__12);
						this.state = 165;
						this.power(0);
						}
						break;
					}
					}
				}
				this.state = 170;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 22, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public power(): PowerContext;
	public power(_p: number): PowerContext;
	// @RuleVersion(0)
	public power(_p?: number): PowerContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: PowerContext = new PowerContext(this._ctx, _parentState);
		let _prevctx: PowerContext = _localctx;
		let _startState: number = 32;
		this.enterRecursionRule(_localctx, 32, AntimonyGrammarParser.RULE_power, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 175;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case AntimonyGrammarParser.T__3:
			case AntimonyGrammarParser.T__7:
			case AntimonyGrammarParser.T__10:
			case AntimonyGrammarParser.T__15:
			case AntimonyGrammarParser.NAME:
			case AntimonyGrammarParser.NUMBER:
				{
				this.state = 172;
				this.atom();
				}
				break;
			case AntimonyGrammarParser.T__14:
				{
				this.state = 173;
				this.match(AntimonyGrammarParser.T__14);
				this.state = 174;
				this.atom();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 182;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 24, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					{
					_localctx = new PowerContext(_parentctx, _parentState);
					this.pushNewRecursionContext(_localctx, _startState, AntimonyGrammarParser.RULE_power);
					this.state = 177;
					if (!(this.precpred(this._ctx, 2))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
					}
					this.state = 178;
					this.match(AntimonyGrammarParser.T__13);
					this.state = 179;
					this.atom();
					}
					}
				}
				this.state = 184;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 24, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public atom(): AtomContext {
		let _localctx: AtomContext = new AtomContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, AntimonyGrammarParser.RULE_atom);
		try {
			this.state = 197;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 25, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 185;
				this.match(AntimonyGrammarParser.NUMBER);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 186;
				this.var_name();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 187;
				this.match(AntimonyGrammarParser.NUMBER);
				this.state = 188;
				this.var_name();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 189;
				this.match(AntimonyGrammarParser.T__10);
				this.state = 190;
				this.atom();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 191;
				this.match(AntimonyGrammarParser.T__7);
				this.state = 192;
				this.atom();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 193;
				this.match(AntimonyGrammarParser.T__15);
				this.state = 194;
				this.sum(0);
				this.state = 195;
				this.match(AntimonyGrammarParser.T__16);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public simple_stmt(): Simple_stmtContext {
		let _localctx: Simple_stmtContext = new Simple_stmtContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, AntimonyGrammarParser.RULE_simple_stmt);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 200;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AntimonyGrammarParser.T__3) | (1 << AntimonyGrammarParser.ARROW) | (1 << AntimonyGrammarParser.TYPE_MODIFIER) | (1 << AntimonyGrammarParser.NAME) | (1 << AntimonyGrammarParser.NUMBER))) !== 0)) {
				{
				this.state = 199;
				this.small_stmt();
				}
			}

			this.state = 202;
			_la = this._input.LA(1);
			if (!(_la === AntimonyGrammarParser.T__6 || _la === AntimonyGrammarParser.NEWLINE)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public small_stmt(): Small_stmtContext {
		let _localctx: Small_stmtContext = new Small_stmtContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, AntimonyGrammarParser.RULE_small_stmt);
		try {
			this.state = 207;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 27, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 204;
				this.reaction();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 205;
				this.assignment();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 206;
				this.declaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public simple_stmt_list(): Simple_stmt_listContext {
		let _localctx: Simple_stmt_listContext = new Simple_stmt_listContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, AntimonyGrammarParser.RULE_simple_stmt_list);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 210;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 209;
				this.simple_stmt();
				}
				}
				this.state = 212;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AntimonyGrammarParser.T__3) | (1 << AntimonyGrammarParser.T__6) | (1 << AntimonyGrammarParser.ARROW) | (1 << AntimonyGrammarParser.TYPE_MODIFIER) | (1 << AntimonyGrammarParser.NAME) | (1 << AntimonyGrammarParser.NUMBER) | (1 << AntimonyGrammarParser.NEWLINE))) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 14:
			return this.sum_sempred(_localctx as SumContext, predIndex);

		case 15:
			return this.product_sempred(_localctx as ProductContext, predIndex);

		case 16:
			return this.power_sempred(_localctx as PowerContext, predIndex);
		}
		return true;
	}
	private sum_sempred(_localctx: SumContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 2);

		case 1:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private product_sempred(_localctx: ProductContext, predIndex: number): boolean {
		switch (predIndex) {
		case 2:
			return this.precpred(this._ctx, 2);

		case 3:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private power_sempred(_localctx: PowerContext, predIndex: number): boolean {
		switch (predIndex) {
		case 4:
			return this.precpred(this._ctx, 2);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\"\xD9\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x03\x02\x05\x02." +
		"\n\x02\x03\x02\x05\x021\n\x02\x03\x02\x03\x02\x03\x02\x05\x026\n\x02\x03" +
		"\x02\x03\x02\x03\x02\x03\x03\x05\x03<\n\x03\x03\x03\x03\x03\x03\x04\x03" +
		"\x04\x03\x04\x03\x05\x03\x05\x05\x05E\n\x05\x03\x06\x03\x06\x03\x07\x03" +
		"\x07\x03\x07\x03\b\x05\bM\n\b\x03\b\x03\b\x03\b\x05\bR\n\b\x03\b\x03\b" +
		"\x05\bV\n\b\x03\b\x05\bY\n\b\x03\b\x05\b\\\n\b\x03\b\x05\b_\n\b\x03\b" +
		"\x03\b\x03\b\x03\b\x05\be\n\b\x03\b\x05\bh\n\b\x05\bj\n\b\x03\t\x03\t" +
		"\x03\t\x07\to\n\t\f\t\x0E\tr\v\t\x03\n\x05\nu\n\n\x03\n\x05\nx\n\n\x03" +
		"\n\x03\n\x03\v\x03\v\x03\v\x03\v\x03\f\x03\f\x03\f\x03\f\x07\f\x84\n\f" +
		"\f\f\x0E\f\x87\v\f\x03\r\x03\r\x03\x0E\x03\x0E\x05\x0E\x8D\n\x0E\x03\x0F" +
		"\x03\x0F\x03\x0F\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10" +
		"\x03\x10\x03\x10\x07\x10\x9B\n\x10\f\x10\x0E\x10\x9E\v\x10\x03\x11\x03" +
		"\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x07\x11\xA9" +
		"\n\x11\f\x11\x0E\x11\xAC\v\x11\x03\x12\x03\x12\x03\x12\x03\x12\x05\x12" +
		"\xB2\n\x12\x03\x12\x03\x12\x03\x12\x07\x12\xB7\n\x12\f\x12\x0E\x12\xBA" +
		"\v\x12\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13" +
		"\x03\x13\x03\x13\x03\x13\x03\x13\x05\x13\xC8\n\x13\x03\x14\x05\x14\xCB" +
		"\n\x14\x03\x14\x03\x14\x03\x15\x03\x15\x03\x15\x05\x15\xD2\n\x15\x03\x16" +
		"\x06\x16\xD5\n\x16\r\x16\x0E\x16\xD6\x03\x16\x02\x02\x05\x1E \"\x17\x02" +
		"\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02" +
		"\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02&\x02(\x02*\x02" +
		"\x02\x05\x03\x02\x03\x04\x04\x02\v\v\x16\x16\x04\x02\t\t!!\x02\xE5\x02" +
		"-\x03\x02\x02\x02\x04;\x03\x02\x02\x02\x06?\x03\x02\x02\x02\bB\x03\x02" +
		"\x02\x02\nF\x03\x02\x02\x02\fH\x03\x02\x02\x02\x0Ei\x03\x02\x02\x02\x10" +
		"k\x03\x02\x02\x02\x12t\x03\x02\x02\x02\x14{\x03\x02\x02\x02\x16\x7F\x03" +
		"\x02\x02\x02\x18\x88\x03\x02\x02\x02\x1A\x8A\x03\x02\x02\x02\x1C\x8E\x03" +
		"\x02\x02\x02\x1E\x91\x03\x02\x02\x02 \x9F\x03\x02\x02\x02\"\xB1\x03\x02" +
		"\x02\x02$\xC7\x03\x02\x02\x02&\xCA\x03\x02\x02\x02(\xD1\x03\x02\x02\x02" +
		"*\xD4\x03\x02\x02\x02,.\x07!\x02\x02-,\x03\x02\x02\x02-.\x03\x02\x02\x02" +
		".0\x03\x02\x02\x02/1\x07\x18\x02\x020/\x03\x02\x02\x0201\x03\x02\x02\x02" +
		"12\x03\x02\x02\x0223\t\x02\x02\x0235\x07\x19\x02\x0246\x07\x05\x02\x02" +
		"54\x03\x02\x02\x0256\x03\x02\x02\x0267\x03\x02\x02\x0278\x05*\x16\x02" +
		"89\x07\x14\x02\x029\x03\x03\x02\x02\x02:<\x07\x06\x02\x02;:\x03\x02\x02" +
		"\x02;<\x03\x02\x02\x02<=\x03\x02\x02\x02=>\x07\x19\x02\x02>\x05\x03\x02" +
		"\x02\x02?@\x07\x07\x02\x02@A\x05\x04\x03\x02A\x07\x03\x02\x02\x02BD\x05" +
		"\x04\x03\x02CE\x05\x06\x04\x02DC\x03\x02\x02\x02DE\x03\x02\x02\x02E\t" +
		"\x03\x02\x02\x02FG\x03\x02\x02\x02G\v\x03\x02\x02\x02HI\x05\b\x05\x02" +
		"IJ\x07\b\x02\x02J\r\x03\x02\x02\x02KM\x05\f\x07\x02LK\x03\x02\x02\x02" +
		"LM\x03\x02\x02\x02MN\x03\x02\x02\x02NO\x05\x10\t\x02OQ\x07\x15\x02\x02" +
		"PR\x05\x10\t\x02QP\x03\x02\x02\x02QR\x03\x02\x02\x02RS\x03\x02\x02\x02" +
		"SU\x07\t\x02\x02TV\x05\x1E\x10\x02UT\x03\x02\x02\x02UV\x03\x02\x02\x02" +
		"VX\x03\x02\x02\x02WY\x05\x06\x04\x02XW\x03\x02\x02\x02XY\x03\x02\x02\x02" +
		"Yj\x03\x02\x02\x02Z\\\x05\f\x07\x02[Z\x03\x02\x02\x02[\\\x03\x02\x02\x02" +
		"\\^\x03\x02\x02\x02]_\x05\x10\t\x02^]\x03\x02\x02\x02^_\x03\x02\x02\x02" +
		"_`\x03\x02\x02\x02`a\x07\x15\x02\x02ab\x05\x10\t\x02bd\x07\t\x02\x02c" +
		"e\x05\x1E\x10\x02dc\x03\x02\x02\x02de\x03\x02\x02\x02eg\x03\x02\x02\x02" +
		"fh\x05\x06\x04\x02gf\x03\x02\x02\x02gh\x03\x02\x02\x02hj\x03\x02\x02\x02" +
		"iL\x03\x02\x02\x02i[\x03\x02\x02\x02j\x0F\x03\x02\x02\x02kp\x05\x12\n" +
		"\x02lm\x07\n\x02\x02mo\x05\x12\n\x02nl\x03\x02\x02\x02or\x03\x02\x02\x02" +
		"pn\x03\x02\x02\x02pq\x03\x02\x02\x02q\x11\x03\x02\x02\x02rp\x03\x02\x02" +
		"\x02su\x07 \x02\x02ts\x03\x02\x02\x02tu\x03\x02\x02\x02uw\x03\x02\x02" +
		"\x02vx\x07\x06\x02\x02wv\x03\x02\x02\x02wx\x03\x02\x02\x02xy\x03\x02\x02" +
		"\x02yz\x07\x19\x02\x02z\x13\x03\x02\x02\x02{|\x05\b\x05\x02|}\t\x03\x02" +
		"\x02}~\x05\x1E\x10\x02~\x15\x03\x02\x02\x02\x7F\x80\x05\x18\r\x02\x80" +
		"\x85\x05\x1A\x0E\x02\x81\x82\x07\f\x02\x02\x82\x84\x05\x1A\x0E\x02\x83" +
		"\x81\x03\x02\x02\x02\x84\x87\x03\x02\x02\x02\x85\x83\x03\x02\x02\x02\x85" +
		"\x86\x03\x02\x02\x02\x86\x17\x03\x02\x02\x02\x87\x85\x03\x02\x02\x02\x88" +
		"\x89\x07\x17\x02\x02\x89\x19\x03\x02\x02\x02\x8A\x8C\x05\b\x05\x02\x8B" +
		"\x8D\x05\x1C\x0F\x02\x8C\x8B\x03\x02\x02\x02\x8C\x8D\x03\x02\x02\x02\x8D" +
		"\x1B\x03\x02\x02\x02\x8E\x8F\x07\v\x02\x02\x8F\x90\x05\x1E\x10\x02\x90" +
		"\x1D\x03\x02\x02\x02\x91\x92\b\x10\x01\x02\x92\x93\x05 \x11\x02\x93\x9C" +
		"\x03\x02\x02\x02\x94\x95\f\x04\x02\x02\x95\x96\x07\n\x02\x02\x96\x9B\x05" +
		" \x11\x02\x97\x98\f\x03\x02\x02\x98\x99\x07\r\x02\x02\x99\x9B\x05 \x11" +
		"\x02\x9A\x94\x03\x02\x02\x02\x9A\x97\x03\x02\x02\x02\x9B\x9E\x03\x02\x02" +
		"\x02\x9C\x9A\x03\x02\x02\x02\x9C\x9D\x03\x02\x02\x02\x9D\x1F\x03\x02\x02" +
		"\x02\x9E\x9C\x03\x02\x02\x02\x9F\xA0\b\x11\x01\x02\xA0\xA1\x05\"\x12\x02" +
		"\xA1\xAA\x03\x02\x02\x02\xA2\xA3\f\x04\x02\x02\xA3\xA4\x07\x0E\x02\x02" +
		"\xA4\xA9\x05\"\x12\x02\xA5\xA6\f\x03\x02\x02\xA6\xA7\x07\x0F\x02\x02\xA7" +
		"\xA9\x05\"\x12\x02\xA8\xA2\x03\x02\x02\x02\xA8\xA5\x03\x02\x02\x02\xA9" +
		"\xAC\x03\x02\x02\x02\xAA\xA8\x03\x02\x02\x02\xAA\xAB\x03\x02\x02\x02\xAB" +
		"!\x03\x02\x02\x02\xAC\xAA\x03\x02\x02\x02\xAD\xAE\b\x12\x01\x02\xAE\xB2" +
		"\x05$\x13\x02\xAF\xB0\x07\x11\x02\x02\xB0\xB2\x05$\x13\x02\xB1\xAD\x03" +
		"\x02\x02\x02\xB1\xAF\x03\x02\x02\x02\xB2\xB8\x03\x02\x02\x02\xB3\xB4\f" +
		"\x04\x02\x02\xB4\xB5\x07\x10\x02\x02\xB5\xB7\x05$\x13\x02\xB6\xB3\x03" +
		"\x02\x02\x02\xB7\xBA\x03\x02\x02\x02\xB8\xB6\x03\x02\x02\x02\xB8\xB9\x03" +
		"\x02\x02\x02\xB9#\x03\x02\x02\x02\xBA\xB8\x03\x02\x02\x02\xBB\xC8\x07" +
		" \x02\x02\xBC\xC8\x05\x04\x03\x02\xBD\xBE\x07 \x02\x02\xBE\xC8\x05\x04" +
		"\x03\x02\xBF\xC0\x07\r\x02\x02\xC0\xC8\x05$\x13\x02\xC1\xC2\x07\n\x02" +
		"\x02\xC2\xC8\x05$\x13\x02\xC3\xC4\x07\x12\x02\x02\xC4\xC5\x05\x1E\x10" +
		"\x02\xC5\xC6\x07\x13\x02\x02\xC6\xC8\x03\x02\x02\x02\xC7\xBB\x03\x02\x02" +
		"\x02\xC7\xBC\x03\x02\x02\x02\xC7\xBD\x03\x02\x02\x02\xC7\xBF\x03\x02\x02" +
		"\x02\xC7\xC1\x03\x02\x02\x02\xC7\xC3\x03\x02\x02\x02\xC8%\x03\x02\x02" +
		"\x02\xC9\xCB\x05(\x15\x02\xCA\xC9\x03\x02\x02\x02\xCA\xCB\x03\x02\x02" +
		"\x02\xCB\xCC\x03\x02\x02\x02\xCC\xCD\t\x04\x02\x02\xCD\'\x03\x02\x02\x02" +
		"\xCE\xD2\x05\x0E\b\x02\xCF\xD2\x05\x14\v\x02\xD0\xD2\x05\x16\f\x02\xD1" +
		"\xCE\x03\x02\x02\x02\xD1\xCF\x03\x02\x02\x02\xD1\xD0\x03\x02\x02\x02\xD2" +
		")\x03\x02\x02\x02\xD3\xD5\x05&\x14\x02\xD4\xD3\x03\x02\x02\x02\xD5\xD6" +
		"\x03\x02\x02\x02\xD6\xD4\x03\x02\x02\x02\xD6\xD7\x03\x02\x02\x02\xD7+" +
		"\x03\x02\x02\x02\x1F-05;DLQUX[^dgiptw\x85\x8C\x9A\x9C\xA8\xAA\xB1\xB8" +
		"\xC7\xCA\xD1\xD6";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!AntimonyGrammarParser.__ATN) {
			AntimonyGrammarParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(AntimonyGrammarParser._serializedATN));
		}

		return AntimonyGrammarParser.__ATN;
	}

}

export class ModelContext extends ParserRuleContext {
	public NAME(): TerminalNode { return this.getToken(AntimonyGrammarParser.NAME, 0); }
	public simple_stmt_list(): Simple_stmt_listContext {
		return this.getRuleContext(0, Simple_stmt_listContext);
	}
	public END(): TerminalNode { return this.getToken(AntimonyGrammarParser.END, 0); }
	public NEWLINE(): TerminalNode | undefined { return this.tryGetToken(AntimonyGrammarParser.NEWLINE, 0); }
	public COMMENT(): TerminalNode | undefined { return this.tryGetToken(AntimonyGrammarParser.COMMENT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_model; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterModel) {
			listener.enterModel(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitModel) {
			listener.exitModel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitModel) {
			return visitor.visitModel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Var_nameContext extends ParserRuleContext {
	public NAME(): TerminalNode { return this.getToken(AntimonyGrammarParser.NAME, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_var_name; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterVar_name) {
			listener.enterVar_name(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitVar_name) {
			listener.exitVar_name(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitVar_name) {
			return visitor.visitVar_name(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class In_compContext extends ParserRuleContext {
	public var_name(): Var_nameContext {
		return this.getRuleContext(0, Var_nameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_in_comp; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterIn_comp) {
			listener.enterIn_comp(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitIn_comp) {
			listener.exitIn_comp(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitIn_comp) {
			return visitor.visitIn_comp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NamemaybeinContext extends ParserRuleContext {
	public var_name(): Var_nameContext {
		return this.getRuleContext(0, Var_nameContext);
	}
	public in_comp(): In_compContext | undefined {
		return this.tryGetRuleContext(0, In_compContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_namemaybein; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterNamemaybein) {
			listener.enterNamemaybein(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitNamemaybein) {
			listener.exitNamemaybein(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitNamemaybein) {
			return visitor.visitNamemaybein(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EmptyContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_empty; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterEmpty) {
			listener.enterEmpty(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitEmpty) {
			listener.exitEmpty(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitEmpty) {
			return visitor.visitEmpty(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Reaction_nameContext extends ParserRuleContext {
	public namemaybein(): NamemaybeinContext {
		return this.getRuleContext(0, NamemaybeinContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_reaction_name; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterReaction_name) {
			listener.enterReaction_name(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitReaction_name) {
			listener.exitReaction_name(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitReaction_name) {
			return visitor.visitReaction_name(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReactionContext extends ParserRuleContext {
	public species_list(): Species_listContext[];
	public species_list(i: number): Species_listContext;
	public species_list(i?: number): Species_listContext | Species_listContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Species_listContext);
		} else {
			return this.getRuleContext(i, Species_listContext);
		}
	}
	public ARROW(): TerminalNode { return this.getToken(AntimonyGrammarParser.ARROW, 0); }
	public reaction_name(): Reaction_nameContext | undefined {
		return this.tryGetRuleContext(0, Reaction_nameContext);
	}
	public sum(): SumContext | undefined {
		return this.tryGetRuleContext(0, SumContext);
	}
	public in_comp(): In_compContext | undefined {
		return this.tryGetRuleContext(0, In_compContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_reaction; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterReaction) {
			listener.enterReaction(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitReaction) {
			listener.exitReaction(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitReaction) {
			return visitor.visitReaction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Species_listContext extends ParserRuleContext {
	public species(): SpeciesContext[];
	public species(i: number): SpeciesContext;
	public species(i?: number): SpeciesContext | SpeciesContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SpeciesContext);
		} else {
			return this.getRuleContext(i, SpeciesContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_species_list; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterSpecies_list) {
			listener.enterSpecies_list(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitSpecies_list) {
			listener.exitSpecies_list(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitSpecies_list) {
			return visitor.visitSpecies_list(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SpeciesContext extends ParserRuleContext {
	public NAME(): TerminalNode { return this.getToken(AntimonyGrammarParser.NAME, 0); }
	public NUMBER(): TerminalNode | undefined { return this.tryGetToken(AntimonyGrammarParser.NUMBER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_species; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterSpecies) {
			listener.enterSpecies(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitSpecies) {
			listener.exitSpecies(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitSpecies) {
			return visitor.visitSpecies(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentContext extends ParserRuleContext {
	public namemaybein(): NamemaybeinContext {
		return this.getRuleContext(0, NamemaybeinContext);
	}
	public sum(): SumContext {
		return this.getRuleContext(0, SumContext);
	}
	public AEQ(): TerminalNode { return this.getToken(AntimonyGrammarParser.AEQ, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_assignment; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterAssignment) {
			listener.enterAssignment(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitAssignment) {
			listener.exitAssignment(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitAssignment) {
			return visitor.visitAssignment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclarationContext extends ParserRuleContext {
	public decl_modifiers(): Decl_modifiersContext {
		return this.getRuleContext(0, Decl_modifiersContext);
	}
	public decl_item(): Decl_itemContext[];
	public decl_item(i: number): Decl_itemContext;
	public decl_item(i?: number): Decl_itemContext | Decl_itemContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Decl_itemContext);
		} else {
			return this.getRuleContext(i, Decl_itemContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_declaration; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterDeclaration) {
			listener.enterDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitDeclaration) {
			listener.exitDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitDeclaration) {
			return visitor.visitDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Decl_modifiersContext extends ParserRuleContext {
	public TYPE_MODIFIER(): TerminalNode { return this.getToken(AntimonyGrammarParser.TYPE_MODIFIER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_decl_modifiers; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterDecl_modifiers) {
			listener.enterDecl_modifiers(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitDecl_modifiers) {
			listener.exitDecl_modifiers(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitDecl_modifiers) {
			return visitor.visitDecl_modifiers(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Decl_itemContext extends ParserRuleContext {
	public namemaybein(): NamemaybeinContext {
		return this.getRuleContext(0, NamemaybeinContext);
	}
	public decl_assignment(): Decl_assignmentContext | undefined {
		return this.tryGetRuleContext(0, Decl_assignmentContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_decl_item; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterDecl_item) {
			listener.enterDecl_item(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitDecl_item) {
			listener.exitDecl_item(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitDecl_item) {
			return visitor.visitDecl_item(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Decl_assignmentContext extends ParserRuleContext {
	public sum(): SumContext {
		return this.getRuleContext(0, SumContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_decl_assignment; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterDecl_assignment) {
			listener.enterDecl_assignment(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitDecl_assignment) {
			listener.exitDecl_assignment(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitDecl_assignment) {
			return visitor.visitDecl_assignment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SumContext extends ParserRuleContext {
	public product(): ProductContext {
		return this.getRuleContext(0, ProductContext);
	}
	public sum(): SumContext | undefined {
		return this.tryGetRuleContext(0, SumContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_sum; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterSum) {
			listener.enterSum(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitSum) {
			listener.exitSum(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitSum) {
			return visitor.visitSum(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ProductContext extends ParserRuleContext {
	public power(): PowerContext {
		return this.getRuleContext(0, PowerContext);
	}
	public product(): ProductContext | undefined {
		return this.tryGetRuleContext(0, ProductContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_product; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterProduct) {
			listener.enterProduct(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitProduct) {
			listener.exitProduct(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitProduct) {
			return visitor.visitProduct(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PowerContext extends ParserRuleContext {
	public atom(): AtomContext {
		return this.getRuleContext(0, AtomContext);
	}
	public power(): PowerContext | undefined {
		return this.tryGetRuleContext(0, PowerContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_power; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterPower) {
			listener.enterPower(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitPower) {
			listener.exitPower(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitPower) {
			return visitor.visitPower(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AtomContext extends ParserRuleContext {
	public NUMBER(): TerminalNode | undefined { return this.tryGetToken(AntimonyGrammarParser.NUMBER, 0); }
	public var_name(): Var_nameContext | undefined {
		return this.tryGetRuleContext(0, Var_nameContext);
	}
	public atom(): AtomContext | undefined {
		return this.tryGetRuleContext(0, AtomContext);
	}
	public sum(): SumContext | undefined {
		return this.tryGetRuleContext(0, SumContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_atom; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterAtom) {
			listener.enterAtom(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitAtom) {
			listener.exitAtom(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitAtom) {
			return visitor.visitAtom(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Simple_stmtContext extends ParserRuleContext {
	public NEWLINE(): TerminalNode { return this.getToken(AntimonyGrammarParser.NEWLINE, 0); }
	public small_stmt(): Small_stmtContext | undefined {
		return this.tryGetRuleContext(0, Small_stmtContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_simple_stmt; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterSimple_stmt) {
			listener.enterSimple_stmt(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitSimple_stmt) {
			listener.exitSimple_stmt(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitSimple_stmt) {
			return visitor.visitSimple_stmt(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Small_stmtContext extends ParserRuleContext {
	public reaction(): ReactionContext | undefined {
		return this.tryGetRuleContext(0, ReactionContext);
	}
	public assignment(): AssignmentContext | undefined {
		return this.tryGetRuleContext(0, AssignmentContext);
	}
	public declaration(): DeclarationContext | undefined {
		return this.tryGetRuleContext(0, DeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_small_stmt; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterSmall_stmt) {
			listener.enterSmall_stmt(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitSmall_stmt) {
			listener.exitSmall_stmt(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitSmall_stmt) {
			return visitor.visitSmall_stmt(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Simple_stmt_listContext extends ParserRuleContext {
	public simple_stmt(): Simple_stmtContext[];
	public simple_stmt(i: number): Simple_stmtContext;
	public simple_stmt(i?: number): Simple_stmtContext | Simple_stmtContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Simple_stmtContext);
		} else {
			return this.getRuleContext(i, Simple_stmtContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AntimonyGrammarParser.RULE_simple_stmt_list; }
	// @Override
	public enterRule(listener: AntimonyGrammarListener): void {
		if (listener.enterSimple_stmt_list) {
			listener.enterSimple_stmt_list(this);
		}
	}
	// @Override
	public exitRule(listener: AntimonyGrammarListener): void {
		if (listener.exitSimple_stmt_list) {
			listener.exitSimple_stmt_list(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AntimonyGrammarVisitor<Result>): Result {
		if (visitor.visitSimple_stmt_list) {
			return visitor.visitSimple_stmt_list(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


