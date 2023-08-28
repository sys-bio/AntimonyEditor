// Generated from /Users/evaliu/Documents/AntimonyEditor/src/languages/AntimonyGrammar.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { CharStream } from "antlr4ts/CharStream";
import { Lexer } from "antlr4ts/Lexer";
import { LexerATNSimulator } from "antlr4ts/atn/LexerATNSimulator";
import { NotNull } from "antlr4ts/Decorators";
import { Override } from "antlr4ts/Decorators";
import { RuleContext } from "antlr4ts/RuleContext";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";


export class AntimonyGrammarLexer extends Lexer {
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

	// tslint:disable:no-trailing-whitespace
	public static readonly channelNames: string[] = [
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN",
	];

	// tslint:disable:no-trailing-whitespace
	public static readonly modeNames: string[] = [
		"DEFAULT_MODE",
	];

	public static readonly ruleNames: string[] = [
		"T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", "T__8", 
		"T__9", "T__10", "END", "ARROW", "NUMBER", "NAME", "NEWLINE", "WS",
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
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(AntimonyGrammarLexer._LITERAL_NAMES, AntimonyGrammarLexer._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return AntimonyGrammarLexer.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(AntimonyGrammarLexer._ATN, this);
	}

	// @Override
	public get grammarFileName(): string { return "AntimonyGrammar.g4"; }

	// @Override
	public get ruleNames(): string[] { return AntimonyGrammarLexer.ruleNames; }

	// @Override
	public get serializedATN(): string { return AntimonyGrammarLexer._serializedATN; }

	// @Override
	public get channelNames(): string[] { return AntimonyGrammarLexer.channelNames; }

	// @Override
	public get modeNames(): string[] { return AntimonyGrammarLexer.modeNames; }

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x02\x13k\b\x01\x04" +
		"\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04" +
		"\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r" +
		"\x04\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12" +
		"\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x04\x03\x04\x03\x05\x03\x05\x03\x05" +
		"\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x07\x03\x07\x03\b" +
		"\x03\b\x03\t\x03\t\x03\n\x03\n\x03\v\x03\v\x03\f\x03\f\x03\r\x03\r\x03" +
		"\r\x03\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x05\x0ER\n\x0E\x03\x0F\x06\x0F" +
		"U\n\x0F\r\x0F\x0E\x0FV\x03\x10\x03\x10\x07\x10[\n\x10\f\x10\x0E\x10^\v" +
		"\x10\x03\x11\x05\x11a\n\x11\x03\x11\x03\x11\x03\x12\x06\x12f\n\x12\r\x12" +
		"\x0E\x12g\x03\x12\x03\x12\x02\x02\x02\x13\x03\x02\x03\x05\x02\x04\x07" +
		"\x02\x05\t\x02\x06\v\x02\x07\r\x02\b\x0F\x02\t\x11\x02\n\x13\x02\v\x15" +
		"\x02\f\x17\x02\r\x19\x02\x0E\x1B\x02\x0F\x1D\x02\x10\x1F\x02\x11!\x02" +
		"\x12#\x02\x13\x03\x02\x06\x03\x022;\x05\x02C\\aac|\x06\x022;C\\aac|\x05" +
		"\x02\v\f\x0F\x0F\"\"\x02o\x02\x03\x03\x02\x02\x02\x02\x05\x03\x02\x02" +
		"\x02\x02\x07\x03\x02\x02\x02\x02\t\x03\x02\x02\x02\x02\v\x03\x02\x02\x02" +
		"\x02\r\x03\x02\x02\x02\x02\x0F\x03\x02\x02\x02\x02\x11\x03\x02\x02\x02" +
		"\x02\x13\x03\x02\x02\x02\x02\x15\x03\x02\x02\x02\x02\x17\x03\x02\x02\x02" +
		"\x02\x19\x03\x02\x02\x02\x02\x1B\x03\x02\x02\x02\x02\x1D\x03\x02\x02\x02" +
		"\x02\x1F\x03\x02\x02\x02\x02!\x03\x02\x02\x02\x02#\x03\x02\x02\x02\x03" +
		"%\x03\x02\x02\x02\x05+\x03\x02\x02\x02\x072\x03\x02\x02\x02\t4\x03\x02" +
		"\x02\x02\v7\x03\x02\x02\x02\r=\x03\x02\x02\x02\x0F?\x03\x02\x02\x02\x11" +
		"A\x03\x02\x02\x02\x13C\x03\x02\x02\x02\x15E\x03\x02\x02\x02\x17G\x03\x02" +
		"\x02\x02\x19I\x03\x02\x02\x02\x1BQ\x03\x02\x02\x02\x1DT\x03\x02\x02\x02" +
		"\x1FX\x03\x02\x02\x02!`\x03\x02\x02\x02#e\x03\x02\x02\x02%&\x07o\x02\x02" +
		"&\'\x07q\x02\x02\'(\x07f\x02\x02()\x07g\x02\x02)*\x07n\x02\x02*\x04\x03" +
		"\x02\x02\x02+,\x07o\x02\x02,-\x07q\x02\x02-.\x07f\x02\x02./\x07w\x02\x02" +
		"/0\x07n\x02\x0201\x07g\x02\x021\x06\x03\x02\x02\x0223\x07&\x02\x023\b" +
		"\x03\x02\x02\x0245\x07k\x02\x0256\x07p\x02\x026\n\x03\x02\x02\x0278\x07" +
		"g\x02\x0289\x07o\x02\x029:\x07r\x02\x02:;\x07v\x02\x02;<\x07{\x02\x02" +
		"<\f\x03\x02\x02\x02=>\x07<\x02\x02>\x0E\x03\x02\x02\x02?@\x07=\x02\x02" +
		"@\x10\x03\x02\x02\x02AB\x07-\x02\x02B\x12\x03\x02\x02\x02CD\x07/\x02\x02" +
		"D\x14\x03\x02\x02\x02EF\x07,\x02\x02F\x16\x03\x02\x02\x02GH\x071\x02\x02" +
		"H\x18\x03\x02\x02\x02IJ\x07g\x02\x02JK\x07p\x02\x02KL\x07f\x02\x02L\x1A" +
		"\x03\x02\x02\x02MN\x07/\x02\x02NR\x07@\x02\x02OP\x07?\x02\x02PR\x07@\x02" +
		"\x02QM\x03\x02\x02\x02QO\x03\x02\x02\x02R\x1C\x03\x02\x02\x02SU\t\x02" +
		"\x02\x02TS\x03\x02\x02\x02UV\x03\x02\x02\x02VT\x03\x02\x02\x02VW\x03\x02" +
		"\x02\x02W\x1E\x03\x02\x02\x02X\\\t\x03\x02\x02Y[\t\x04\x02\x02ZY\x03\x02" +
		"\x02\x02[^\x03\x02\x02\x02\\Z\x03\x02\x02\x02\\]\x03\x02\x02\x02] \x03" +
		"\x02\x02\x02^\\\x03\x02\x02\x02_a\x07\x0F\x02\x02`_\x03\x02\x02\x02`a" +
		"\x03\x02\x02\x02ab\x03\x02\x02\x02bc\x07\f\x02\x02c\"\x03\x02\x02\x02" +
		"df\t\x05\x02\x02ed\x03\x02\x02\x02fg\x03\x02\x02\x02ge\x03\x02\x02\x02" +
		"gh\x03\x02\x02\x02hi\x03\x02\x02\x02ij\b\x12\x02\x02j$\x03\x02\x02\x02" +
		"\b\x02QV\\`g\x03\b\x02\x02";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!AntimonyGrammarLexer.__ATN) {
			AntimonyGrammarLexer.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(AntimonyGrammarLexer._serializedATN));
		}

		return AntimonyGrammarLexer.__ATN;
	}

}

