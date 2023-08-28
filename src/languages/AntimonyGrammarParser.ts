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
	public static readonly END = 12;
	public static readonly ARROW = 13;
	public static readonly NUMBER = 14;
	public static readonly NAME = 15;
	public static readonly NEWLINE = 16;
	public static readonly WS = 17;
	public static readonly RULE_model = 0;
	public static readonly RULE_var_name = 1;
	public static readonly RULE_in_comp = 2;
	public static readonly RULE_namemaybein = 3;
	public static readonly RULE_empty = 4;
	public static readonly RULE_reaction_name = 5;
	public static readonly RULE_reaction = 6;
	public static readonly RULE_species_list = 7;
	public static readonly RULE_species = 8;
	public static readonly RULE_sum = 9;
	public static readonly RULE_product = 10;
	public static readonly RULE_atom = 11;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"model", "var_name", "in_comp", "namemaybein", "empty", "reaction_name", 
		"reaction", "species_list", "species", "sum", "product", "atom",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'model'", "'module'", "'$'", "'in'", "'empty'", "':'", "';'", 
		"'+'", "'-'", "'*'", "'/'", "'end'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, "END", "ARROW", 
		"NUMBER", "NAME", "NEWLINE", "WS",
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
			this.state = 24;
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
			this.state = 25;
			this.match(AntimonyGrammarParser.NAME);
			this.state = 26;
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
			this.state = 29;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AntimonyGrammarParser.T__2) {
				{
				this.state = 28;
				this.match(AntimonyGrammarParser.T__2);
				}
			}

			this.state = 31;
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
			this.state = 33;
			this.match(AntimonyGrammarParser.T__3);
			this.state = 34;
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
			this.state = 36;
			this.var_name();
			this.state = 38;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AntimonyGrammarParser.T__3) {
				{
				this.state = 37;
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
			{
			this.state = 40;
			this.match(AntimonyGrammarParser.T__4);
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
			this.state = 42;
			this.namemaybein();
			this.state = 43;
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
			this.state = 75;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 10, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 46;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 2, this._ctx) ) {
				case 1:
					{
					this.state = 45;
					this.reaction_name();
					}
					break;
				}
				this.state = 48;
				this.species_list();
				this.state = 49;
				this.match(AntimonyGrammarParser.ARROW);
				this.state = 51;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AntimonyGrammarParser.T__2) | (1 << AntimonyGrammarParser.NUMBER) | (1 << AntimonyGrammarParser.NAME))) !== 0)) {
					{
					this.state = 50;
					this.species_list();
					}
				}

				this.state = 53;
				this.match(AntimonyGrammarParser.T__6);
				this.state = 55;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AntimonyGrammarParser.NUMBER || _la === AntimonyGrammarParser.NAME) {
					{
					this.state = 54;
					this.sum();
					}
				}

				this.state = 58;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AntimonyGrammarParser.T__3) {
					{
					this.state = 57;
					this.in_comp();
					}
				}

				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 61;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 6, this._ctx) ) {
				case 1:
					{
					this.state = 60;
					this.reaction_name();
					}
					break;
				}
				this.state = 64;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AntimonyGrammarParser.T__2) | (1 << AntimonyGrammarParser.NUMBER) | (1 << AntimonyGrammarParser.NAME))) !== 0)) {
					{
					this.state = 63;
					this.species_list();
					}
				}

				this.state = 66;
				this.match(AntimonyGrammarParser.ARROW);
				this.state = 67;
				this.species_list();
				this.state = 68;
				this.match(AntimonyGrammarParser.T__6);
				this.state = 70;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AntimonyGrammarParser.NUMBER || _la === AntimonyGrammarParser.NAME) {
					{
					this.state = 69;
					this.sum();
					}
				}

				this.state = 73;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AntimonyGrammarParser.T__3) {
					{
					this.state = 72;
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
			this.state = 77;
			this.species();
			this.state = 82;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AntimonyGrammarParser.T__7) {
				{
				{
				this.state = 78;
				this.match(AntimonyGrammarParser.T__7);
				this.state = 79;
				this.species();
				}
				}
				this.state = 84;
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
			this.state = 86;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AntimonyGrammarParser.NUMBER) {
				{
				this.state = 85;
				this.match(AntimonyGrammarParser.NUMBER);
				}
			}

			this.state = 89;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AntimonyGrammarParser.T__2) {
				{
				this.state = 88;
				this.match(AntimonyGrammarParser.T__2);
				}
			}

			this.state = 91;
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
	public sum(): SumContext {
		let _localctx: SumContext = new SumContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, AntimonyGrammarParser.RULE_sum);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 93;
			this.product();
			this.state = 98;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AntimonyGrammarParser.T__7 || _la === AntimonyGrammarParser.T__8) {
				{
				{
				this.state = 94;
				_la = this._input.LA(1);
				if (!(_la === AntimonyGrammarParser.T__7 || _la === AntimonyGrammarParser.T__8)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 95;
				this.product();
				}
				}
				this.state = 100;
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
	public product(): ProductContext {
		let _localctx: ProductContext = new ProductContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, AntimonyGrammarParser.RULE_product);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 101;
			this.atom();
			this.state = 106;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AntimonyGrammarParser.T__9 || _la === AntimonyGrammarParser.T__10) {
				{
				{
				this.state = 102;
				_la = this._input.LA(1);
				if (!(_la === AntimonyGrammarParser.T__9 || _la === AntimonyGrammarParser.T__10)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 103;
				this.atom();
				}
				}
				this.state = 108;
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
	public atom(): AtomContext {
		let _localctx: AtomContext = new AtomContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, AntimonyGrammarParser.RULE_atom);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 109;
			_la = this._input.LA(1);
			if (!(_la === AntimonyGrammarParser.NUMBER || _la === AntimonyGrammarParser.NAME)) {
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

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x13r\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x03" +
		"\x02\x03\x02\x03\x02\x03\x02\x03\x03\x05\x03 \n\x03\x03\x03\x03\x03\x03" +
		"\x04\x03\x04\x03\x04\x03\x05\x03\x05\x05\x05)\n\x05\x03\x06\x03\x06\x03" +
		"\x07\x03\x07\x03\x07\x03\b\x05\b1\n\b\x03\b\x03\b\x03\b\x05\b6\n\b\x03" +
		"\b\x03\b\x05\b:\n\b\x03\b\x05\b=\n\b\x03\b\x05\b@\n\b\x03\b\x05\bC\n\b" +
		"\x03\b\x03\b\x03\b\x03\b\x05\bI\n\b\x03\b\x05\bL\n\b\x05\bN\n\b\x03\t" +
		"\x03\t\x03\t\x07\tS\n\t\f\t\x0E\tV\v\t\x03\n\x05\nY\n\n\x03\n\x05\n\\" +
		"\n\n\x03\n\x03\n\x03\v\x03\v\x03\v\x07\vc\n\v\f\v\x0E\vf\v\v\x03\f\x03" +
		"\f\x03\f\x07\fk\n\f\f\f\x0E\fn\v\f\x03\r\x03\r\x03\r\x02\x02\x02\x0E\x02" +
		"\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02" +
		"\x16\x02\x18\x02\x02\x06\x03\x02\x03\x04\x03\x02\n\v\x03\x02\f\r\x03\x02" +
		"\x10\x11\x02u\x02\x1A\x03\x02\x02\x02\x04\x1F\x03\x02\x02\x02\x06#\x03" +
		"\x02\x02\x02\b&\x03\x02\x02\x02\n*\x03\x02\x02\x02\f,\x03\x02\x02\x02" +
		"\x0EM\x03\x02\x02\x02\x10O\x03\x02\x02\x02\x12X\x03\x02\x02\x02\x14_\x03" +
		"\x02\x02\x02\x16g\x03\x02\x02\x02\x18o\x03\x02\x02\x02\x1A\x1B\t\x02\x02" +
		"\x02\x1B\x1C\x07\x11\x02\x02\x1C\x1D\x07\x0E\x02\x02\x1D\x03\x03\x02\x02" +
		"\x02\x1E \x07\x05\x02\x02\x1F\x1E\x03\x02\x02\x02\x1F \x03\x02\x02\x02" +
		" !\x03\x02\x02\x02!\"\x07\x11\x02\x02\"\x05\x03\x02\x02\x02#$\x07\x06" +
		"\x02\x02$%\x05\x04\x03\x02%\x07\x03\x02\x02\x02&(\x05\x04\x03\x02\')\x05" +
		"\x06\x04\x02(\'\x03\x02\x02\x02()\x03\x02\x02\x02)\t\x03\x02\x02\x02*" +
		"+\x07\x07\x02\x02+\v\x03\x02\x02\x02,-\x05\b\x05\x02-.\x07\b\x02\x02." +
		"\r\x03\x02\x02\x02/1\x05\f\x07\x020/\x03\x02\x02\x0201\x03\x02\x02\x02" +
		"12\x03\x02\x02\x0223\x05\x10\t\x0235\x07\x0F\x02\x0246\x05\x10\t\x025" +
		"4\x03\x02\x02\x0256\x03\x02\x02\x0267\x03\x02\x02\x0279\x07\t\x02\x02" +
		"8:\x05\x14\v\x0298\x03\x02\x02\x029:\x03\x02\x02\x02:<\x03\x02\x02\x02" +
		";=\x05\x06\x04\x02<;\x03\x02\x02\x02<=\x03\x02\x02\x02=N\x03\x02\x02\x02" +
		">@\x05\f\x07\x02?>\x03\x02\x02\x02?@\x03\x02\x02\x02@B\x03\x02\x02\x02" +
		"AC\x05\x10\t\x02BA\x03\x02\x02\x02BC\x03\x02\x02\x02CD\x03\x02\x02\x02" +
		"DE\x07\x0F\x02\x02EF\x05\x10\t\x02FH\x07\t\x02\x02GI\x05\x14\v\x02HG\x03" +
		"\x02\x02\x02HI\x03\x02\x02\x02IK\x03\x02\x02\x02JL\x05\x06\x04\x02KJ\x03" +
		"\x02\x02\x02KL\x03\x02\x02\x02LN\x03\x02\x02\x02M0\x03\x02\x02\x02M?\x03" +
		"\x02\x02\x02N\x0F\x03\x02\x02\x02OT\x05\x12\n\x02PQ\x07\n\x02\x02QS\x05" +
		"\x12\n\x02RP\x03\x02\x02\x02SV\x03\x02\x02\x02TR\x03\x02\x02\x02TU\x03" +
		"\x02\x02\x02U\x11\x03\x02\x02\x02VT\x03\x02\x02\x02WY\x07\x10\x02\x02" +
		"XW\x03\x02\x02\x02XY\x03\x02\x02\x02Y[\x03\x02\x02\x02Z\\\x07\x05\x02" +
		"\x02[Z\x03\x02\x02\x02[\\\x03\x02\x02\x02\\]\x03\x02\x02\x02]^\x07\x11" +
		"\x02\x02^\x13\x03\x02\x02\x02_d\x05\x16\f\x02`a\t\x03\x02\x02ac\x05\x16" +
		"\f\x02b`\x03\x02\x02\x02cf\x03\x02\x02\x02db\x03\x02\x02\x02de\x03\x02" +
		"\x02\x02e\x15\x03\x02\x02\x02fd\x03\x02\x02\x02gl\x05\x18\r\x02hi\t\x04" +
		"\x02\x02ik\x05\x18\r\x02jh\x03\x02\x02\x02kn\x03\x02\x02\x02lj\x03\x02" +
		"\x02\x02lm\x03\x02\x02\x02m\x17\x03\x02\x02\x02nl\x03\x02\x02\x02op\t" +
		"\x05\x02\x02p\x19\x03\x02\x02\x02\x12\x1F(059<?BHKMTX[dl";
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
	public END(): TerminalNode { return this.getToken(AntimonyGrammarParser.END, 0); }
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


export class SumContext extends ParserRuleContext {
	public product(): ProductContext[];
	public product(i: number): ProductContext;
	public product(i?: number): ProductContext | ProductContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ProductContext);
		} else {
			return this.getRuleContext(i, ProductContext);
		}
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
	public atom(): AtomContext[];
	public atom(i: number): AtomContext;
	public atom(i?: number): AtomContext | AtomContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AtomContext);
		} else {
			return this.getRuleContext(i, AtomContext);
		}
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


export class AtomContext extends ParserRuleContext {
	public NUMBER(): TerminalNode | undefined { return this.tryGetToken(AntimonyGrammarParser.NUMBER, 0); }
	public NAME(): TerminalNode | undefined { return this.tryGetToken(AntimonyGrammarParser.NAME, 0); }
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


