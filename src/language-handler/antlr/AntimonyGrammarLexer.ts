// Generated from src/language-handler/antlr/AntimonyGrammar.g4 by ANTLR 4.9.0-SNAPSHOT


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
	public static readonly T__11 = 12;
	public static readonly T__12 = 13;
	public static readonly T__13 = 14;
	public static readonly T__14 = 15;
	public static readonly T__15 = 16;
	public static readonly T__16 = 17;
	public static readonly T__17 = 18;
	public static readonly T__18 = 19;
	public static readonly T__19 = 20;
	public static readonly T__20 = 21;
	public static readonly T__21 = 22;
	public static readonly T__22 = 23;
	public static readonly T__23 = 24;
	public static readonly T__24 = 25;
	public static readonly T__25 = 26;
	public static readonly T__26 = 27;
	public static readonly T__27 = 28;
	public static readonly T__28 = 29;
	public static readonly T__29 = 30;
	public static readonly T__30 = 31;
	public static readonly END = 32;
	public static readonly ARROW = 33;
	public static readonly INTERACTION_SYMBOL = 34;
	public static readonly NUMBER = 35;
	public static readonly BOOLEAN = 36;
	public static readonly COMPARE = 37;
	public static readonly LOGICAL = 38;
	public static readonly SBOTERM = 39;
	public static readonly AEQ = 40;
	public static readonly ANNOT_KEYWORD = 41;
	public static readonly VAR_MODIFIER = 42;
	public static readonly SUB_MODIFIER = 43;
	public static readonly TYPE_MODIFIER = 44;
	public static readonly COMMENT = 45;
	public static readonly NAME = 46;
	public static readonly CNAME = 47;
	public static readonly LETTER = 48;
	public static readonly WORD = 49;
	public static readonly LCASE_LETTER = 50;
	public static readonly UCASE_LETTER = 51;
	public static readonly DIGIT = 52;
	public static readonly NEWLINE = 53;
	public static readonly WS = 54;
	public static readonly ESCAPED_STRING = 55;

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
		"T__9", "T__10", "T__11", "T__12", "T__13", "T__14", "T__15", "T__16", 
		"T__17", "T__18", "T__19", "T__20", "T__21", "T__22", "T__23", "T__24", 
		"T__25", "T__26", "T__27", "T__28", "T__29", "T__30", "END", "ARROW", 
		"INTERACTION_SYMBOL", "NUMBER", "BOOLEAN", "COMPARE", "LOGICAL", "SBOTERM", 
		"AEQ", "ANNOT_KEYWORD", "VAR_MODIFIER", "SUB_MODIFIER", "TYPE_MODIFIER", 
		"COMMENT", "NAME", "CNAME", "LETTER", "WORD", "LCASE_LETTER", "UCASE_LETTER", 
		"DIGIT", "NEWLINE", "WS", "ESCAPED_STRING",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'model'", "'module'", "'*'", "'()'", "'$'", "'in'", "'at'", 
		"':'", "'after'", "','", "'t0'", "'='", "'priority'", "'fromTrigger'", 
		"'persistent'", "';'", "'+'", "'.sboTerm'", "'''", "'unit'", "'has'", 
		"'('", "')'", "'-'", "'/'", "'^'", "'exp'", "'e'", "'import'", "'function'", 
		"'is'", "'end'", undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, "':='", undefined, undefined, "'substanceOnly'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, "END", "ARROW", "INTERACTION_SYMBOL", 
		"NUMBER", "BOOLEAN", "COMPARE", "LOGICAL", "SBOTERM", "AEQ", "ANNOT_KEYWORD", 
		"VAR_MODIFIER", "SUB_MODIFIER", "TYPE_MODIFIER", "COMMENT", "NAME", "CNAME", 
		"LETTER", "WORD", "LCASE_LETTER", "UCASE_LETTER", "DIGIT", "NEWLINE", 
		"WS", "ESCAPED_STRING",
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

	private static readonly _serializedATNSegments: number = 2;
	private static readonly _serializedATNSegment0: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x029\u035B\b\x01" +
		"\x04\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06" +
		"\x04\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r" +
		"\t\r\x04\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t" +
		"\x12\x04\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t" +
		"\x17\x04\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t" +
		"\x1C\x04\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t" +
		"\"\x04#\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04" +
		"+\t+\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x040\t0\x041\t1\x042\t2\x043\t3\x04" +
		"4\t4\x045\t5\x046\t6\x047\t7\x048\t8\x03\x02\x03\x02\x03\x02\x03\x02\x03" +
		"\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x04\x03\x04\x03\x05\x03\x05\x03\x05\x03\x06\x03\x06\x03\x07\x03\x07\x03" +
		"\x07\x03\b\x03\b\x03\b\x03\t\x03\t\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n" +
		"\x03\v\x03\v\x03\f\x03\f\x03\f\x03\r\x03\r\x03\x0E\x03\x0E\x03\x0E\x03" +
		"\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x0F\x03" +
		"\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03" +
		"\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03" +
		"\x10\x03\x10\x03\x11\x03\x11\x03\x12\x03\x12\x03\x13\x03\x13\x03\x13\x03" +
		"\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x14\x03\x14\x03\x15\x03" +
		"\x15\x03\x15\x03\x15\x03\x15\x03\x16\x03\x16\x03\x16\x03\x16\x03\x17\x03" +
		"\x17\x03\x18\x03\x18\x03\x19\x03\x19\x03\x1A\x03\x1A\x03\x1B\x03\x1B\x03" +
		"\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1D\x03\x1D\x03\x1E\x03\x1E\x03\x1E\x03" +
		"\x1E\x03\x1E\x03\x1E\x03\x1E\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03" +
		"\x1F\x03\x1F\x03\x1F\x03\x1F\x03 \x03 \x03 \x03!\x03!\x03!\x03!\x03\"" +
		"\x03\"\x03\"\x03\"\x05\"\xFE\n\"\x03#\x03#\x03#\x03#\x03#\x03#\x05#\u0106" +
		"\n#\x03$\x06$\u0109\n$\r$\x0E$\u010A\x03$\x03$\x06$\u010F\n$\r$\x0E$\u0110" +
		"\x05$\u0113\n$\x03$\x03$\x06$\u0117\n$\r$\x0E$\u0118\x05$\u011B\n$\x03" +
		"%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03" +
		"%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x05%\u0138" +
		"\n%\x03&\x03&\x03&\x03&\x03&\x03&\x03&\x05&\u0141\n&\x03\'\x03\'\x03\'" +
		"\x03\'\x05\'\u0147\n\'\x03(\x03(\x03(\x03(\x03(\x03(\x03(\x05(\u0150\n" +
		"(\x03)\x03)\x03)\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03*\x03" +
		"*\x03*\x03*\x03*\x03*\x03*\x05*\u02A7\n*\x03+\x03+\x03+\x03+\x03+\x03" +
		"+\x03+\x03+\x05+\u02B1\n+\x03,\x03,\x03,\x03,\x03,\x03,\x03,\x03,\x03" +
		",\x03,\x03,\x03,\x03,\x03,\x03-\x03-\x03-\x03-\x03-\x03-\x03-\x03-\x03" +
		"-\x03-\x03-\x03-\x03-\x03-\x03-\x03-\x03-\x03-\x03-\x03-\x03-\x03-\x03" +
		"-\x03-\x03-\x05-\u02DA\n-\x03.\x03.\x03.\x03.\x07.\u02E0\n.\f.\x0E.\u02E3" +
		"\v.\x03.\x03.\x03.\x03.\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03" +
		"/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03" +
		"/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03" +
		"/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03" +
		"/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x05/\u0329" +
		"\n/\x03/\x03/\x030\x030\x050\u032F\n0\x030\x030\x030\x070\u0334\n0\f0" +
		"\x0E0\u0337\v0\x031\x031\x051\u033B\n1\x032\x062\u033E\n2\r2\x0E2\u033F" +
		"\x033\x033\x034\x034\x035\x035\x036\x036\x037\x067\u034B\n7\r7\x0E7\u034C" +
		"\x037\x037\x038\x038\x038\x038\x078\u0355\n8\f8\x0E8\u0358\v8\x038\x03" +
		"8\x02\x02\x029\x03\x02\x03\x05\x02\x04\x07\x02\x05\t\x02\x06\v\x02\x07" +
		"\r\x02\b\x0F\x02\t\x11\x02\n\x13\x02\v\x15\x02\f\x17\x02\r\x19\x02\x0E" +
		"\x1B\x02\x0F\x1D\x02\x10\x1F\x02\x11!\x02\x12#\x02\x13%\x02\x14\'\x02" +
		"\x15)\x02\x16+\x02\x17-\x02\x18/\x02\x191\x02\x1A3\x02\x1B5\x02\x1C7\x02" +
		"\x1D9\x02\x1E;\x02\x1F=\x02 ?\x02!A\x02\"C\x02#E\x02$G\x02%I\x02&K\x02" +
		"\'M\x02(O\x02)Q\x02*S\x02+U\x02,W\x02-Y\x02.[\x02/]\x020_\x021a\x022c" +
		"\x023e\x024g\x025i\x026k\x027m\x028o\x029\x03\x02\t\x03\x022;\x04\x02" +
		">>@@\x04\x02\f\f\x0F\x0F\x03\x02c|\x03\x02C\\\x04\x02\v\v\"\"\x05\x02" +
		"\f\f\x0F\x0F^^\x02\u03A5\x02\x03\x03\x02\x02\x02\x02\x05\x03\x02\x02\x02" +
		"\x02\x07\x03\x02\x02\x02\x02\t\x03\x02\x02\x02\x02\v\x03\x02\x02\x02\x02" +
		"\r\x03\x02\x02\x02\x02\x0F\x03\x02\x02\x02\x02\x11\x03\x02\x02\x02\x02" +
		"\x13\x03\x02\x02\x02\x02\x15\x03\x02\x02\x02\x02\x17\x03\x02\x02\x02\x02" +
		"\x19\x03\x02\x02\x02\x02\x1B\x03\x02\x02\x02\x02\x1D\x03\x02\x02\x02\x02" +
		"\x1F\x03\x02\x02\x02\x02!\x03\x02\x02\x02\x02#\x03\x02\x02\x02\x02%\x03" +
		"\x02\x02\x02\x02\'\x03\x02\x02\x02\x02)\x03\x02\x02\x02\x02+\x03\x02\x02" +
		"\x02\x02-\x03\x02\x02\x02\x02/\x03\x02\x02\x02\x021\x03\x02\x02\x02\x02" +
		"3\x03\x02\x02\x02\x025\x03\x02\x02\x02\x027\x03\x02\x02\x02\x029\x03\x02" +
		"\x02\x02\x02;\x03\x02\x02\x02\x02=\x03\x02\x02\x02\x02?\x03\x02\x02\x02" +
		"\x02A\x03\x02\x02\x02\x02C\x03\x02\x02\x02\x02E\x03\x02\x02\x02\x02G\x03" +
		"\x02\x02\x02\x02I\x03\x02\x02\x02\x02K\x03\x02\x02\x02\x02M\x03\x02\x02" +
		"\x02\x02O\x03\x02\x02\x02\x02Q\x03\x02\x02\x02\x02S\x03\x02\x02\x02\x02" +
		"U\x03\x02\x02\x02\x02W\x03\x02\x02\x02\x02Y\x03\x02\x02\x02\x02[\x03\x02" +
		"\x02\x02\x02]\x03\x02\x02\x02\x02_\x03\x02\x02\x02\x02a\x03\x02\x02\x02" +
		"\x02c\x03\x02\x02\x02\x02e\x03\x02\x02\x02\x02g\x03\x02\x02\x02\x02i\x03" +
		"\x02\x02\x02\x02k\x03\x02\x02\x02\x02m\x03\x02\x02\x02\x02o\x03\x02\x02" +
		"\x02\x03q\x03\x02\x02\x02\x05w\x03\x02\x02\x02\x07~\x03\x02\x02\x02\t" +
		"\x80\x03\x02\x02\x02\v\x83\x03\x02\x02\x02\r\x85\x03\x02\x02\x02\x0F\x88" +
		"\x03\x02\x02\x02\x11\x8B\x03\x02\x02\x02\x13\x8D\x03\x02\x02\x02\x15\x93" +
		"\x03\x02\x02\x02\x17\x95\x03\x02\x02\x02\x19\x98\x03\x02\x02\x02\x1B\x9A" +
		"\x03\x02\x02\x02\x1D\xA3\x03\x02\x02\x02\x1F\xAF\x03\x02\x02\x02!\xBA" +
		"\x03\x02\x02\x02#\xBC\x03\x02\x02\x02%\xBE\x03\x02\x02\x02\'\xC7\x03\x02" +
		"\x02\x02)\xC9\x03\x02\x02\x02+\xCE\x03\x02\x02\x02-\xD2\x03\x02\x02\x02" +
		"/\xD4\x03\x02\x02\x021\xD6\x03\x02\x02\x023\xD8\x03\x02\x02\x025\xDA\x03" +
		"\x02\x02\x027\xDC\x03\x02\x02\x029\xE0\x03\x02\x02\x02;\xE2\x03\x02\x02" +
		"\x02=\xE9\x03\x02\x02\x02?\xF2\x03\x02\x02\x02A\xF5\x03\x02\x02\x02C\xFD" +
		"\x03\x02\x02\x02E\u0105\x03\x02\x02\x02G\u011A\x03\x02\x02\x02I\u0137" +
		"\x03\x02\x02\x02K\u0140\x03\x02\x02\x02M\u0146\x03\x02\x02\x02O\u014F" +
		"\x03\x02\x02\x02Q\u0151\x03\x02\x02\x02S\u02A6\x03\x02\x02\x02U\u02B0" +
		"\x03\x02\x02\x02W\u02B2\x03\x02\x02\x02Y\u02D9\x03\x02\x02\x02[\u02DB" +
		"\x03\x02\x02\x02]\u0328\x03\x02\x02\x02_\u032E\x03\x02\x02\x02a\u033A" +
		"\x03\x02\x02\x02c\u033D\x03\x02\x02\x02e\u0341\x03\x02\x02\x02g\u0343" +
		"\x03\x02\x02\x02i\u0345\x03\x02\x02\x02k\u0347\x03\x02\x02\x02m\u034A" +
		"\x03\x02\x02\x02o\u0350\x03\x02\x02\x02qr\x07o\x02\x02rs\x07q\x02\x02" +
		"st\x07f\x02\x02tu\x07g\x02\x02uv\x07n\x02\x02v\x04\x03\x02\x02\x02wx\x07" +
		"o\x02\x02xy\x07q\x02\x02yz\x07f\x02\x02z{\x07w\x02\x02{|\x07n\x02\x02" +
		"|}\x07g\x02\x02}\x06\x03\x02\x02\x02~\x7F\x07,\x02\x02\x7F\b\x03\x02\x02" +
		"\x02\x80\x81\x07*\x02\x02\x81\x82\x07+\x02\x02\x82\n\x03\x02\x02\x02\x83" +
		"\x84\x07&\x02\x02\x84\f\x03\x02\x02\x02\x85\x86\x07k\x02\x02\x86\x87\x07" +
		"p\x02\x02\x87\x0E\x03\x02\x02\x02\x88\x89\x07c\x02\x02\x89\x8A\x07v\x02" +
		"\x02\x8A\x10\x03\x02\x02\x02\x8B\x8C\x07<\x02\x02\x8C\x12\x03\x02\x02" +
		"\x02\x8D\x8E\x07c\x02\x02\x8E\x8F\x07h\x02\x02\x8F\x90\x07v\x02\x02\x90" +
		"\x91\x07g\x02\x02\x91\x92\x07t\x02\x02\x92\x14\x03\x02\x02\x02\x93\x94" +
		"\x07.\x02\x02\x94\x16\x03\x02\x02\x02\x95\x96\x07v\x02\x02\x96\x97\x07" +
		"2\x02\x02\x97\x18\x03\x02\x02\x02\x98\x99\x07?\x02\x02\x99\x1A\x03\x02" +
		"\x02\x02\x9A\x9B\x07r\x02\x02\x9B\x9C\x07t\x02\x02\x9C\x9D\x07k\x02\x02" +
		"\x9D\x9E\x07q\x02\x02\x9E\x9F\x07t\x02\x02\x9F\xA0\x07k\x02\x02\xA0\xA1" +
		"\x07v\x02\x02\xA1\xA2\x07{\x02\x02\xA2\x1C\x03\x02\x02\x02\xA3\xA4\x07" +
		"h\x02\x02\xA4\xA5\x07t\x02\x02\xA5\xA6\x07q\x02\x02\xA6\xA7\x07o\x02\x02" +
		"\xA7\xA8\x07V\x02\x02\xA8\xA9\x07t\x02\x02\xA9\xAA\x07k\x02\x02\xAA\xAB" +
		"\x07i\x02\x02\xAB\xAC\x07i\x02\x02\xAC\xAD\x07g\x02\x02\xAD\xAE\x07t\x02" +
		"\x02\xAE\x1E\x03\x02\x02\x02\xAF\xB0\x07r\x02\x02\xB0\xB1\x07g\x02\x02" +
		"\xB1\xB2\x07t\x02\x02\xB2\xB3\x07u\x02\x02\xB3\xB4\x07k\x02\x02\xB4\xB5" +
		"\x07u\x02\x02\xB5\xB6\x07v\x02\x02\xB6\xB7\x07g\x02\x02\xB7\xB8\x07p\x02" +
		"\x02\xB8\xB9\x07v\x02\x02\xB9 \x03\x02\x02\x02\xBA\xBB\x07=\x02\x02\xBB" +
		"\"\x03\x02\x02\x02\xBC\xBD\x07-\x02\x02\xBD$\x03\x02\x02\x02\xBE\xBF\x07" +
		"0\x02\x02\xBF\xC0\x07u\x02\x02\xC0\xC1\x07d\x02\x02\xC1\xC2\x07q\x02\x02" +
		"\xC2\xC3\x07V\x02\x02\xC3\xC4\x07g\x02\x02\xC4\xC5\x07t\x02\x02\xC5\xC6" +
		"\x07o\x02\x02\xC6&\x03\x02\x02\x02\xC7\xC8\x07)\x02\x02\xC8(\x03\x02\x02" +
		"\x02\xC9\xCA\x07w\x02\x02\xCA\xCB\x07p\x02\x02\xCB\xCC\x07k\x02\x02\xCC" +
		"\xCD\x07v\x02\x02\xCD*\x03\x02\x02\x02\xCE\xCF\x07j\x02\x02\xCF\xD0\x07" +
		"c\x02\x02\xD0\xD1\x07u\x02\x02\xD1,\x03\x02\x02\x02\xD2\xD3\x07*\x02\x02" +
		"\xD3.\x03\x02\x02\x02\xD4\xD5\x07+\x02\x02\xD50\x03\x02\x02\x02\xD6\xD7" +
		"\x07/\x02\x02\xD72\x03\x02\x02\x02\xD8\xD9\x071\x02\x02\xD94\x03\x02\x02" +
		"\x02\xDA\xDB\x07`\x02\x02\xDB6\x03\x02\x02\x02\xDC\xDD\x07g\x02\x02\xDD" +
		"\xDE\x07z\x02\x02\xDE\xDF\x07r\x02\x02\xDF8\x03\x02\x02\x02\xE0\xE1\x07" +
		"g\x02\x02\xE1:\x03\x02\x02\x02\xE2\xE3\x07k\x02\x02\xE3\xE4\x07o\x02\x02" +
		"\xE4\xE5\x07r\x02\x02\xE5\xE6\x07q\x02\x02\xE6\xE7\x07t\x02\x02\xE7\xE8" +
		"\x07v\x02\x02\xE8<\x03\x02\x02\x02\xE9\xEA\x07h\x02\x02\xEA\xEB\x07w\x02" +
		"\x02\xEB\xEC\x07p\x02\x02\xEC\xED\x07e\x02\x02\xED\xEE\x07v\x02\x02\xEE" +
		"\xEF\x07k\x02\x02\xEF\xF0\x07q\x02\x02\xF0\xF1\x07p\x02\x02\xF1>\x03\x02" +
		"\x02\x02\xF2\xF3\x07k\x02\x02\xF3\xF4\x07u\x02\x02\xF4@\x03\x02\x02\x02" +
		"\xF5\xF6\x07g\x02\x02\xF6\xF7\x07p\x02\x02\xF7\xF8\x07f\x02\x02\xF8B\x03" +
		"\x02\x02\x02\xF9\xFA\x07/\x02\x02\xFA\xFE\x07@\x02\x02\xFB\xFC\x07?\x02" +
		"\x02\xFC\xFE\x07@\x02\x02\xFD\xF9\x03\x02\x02\x02\xFD\xFB\x03\x02\x02" +
		"\x02\xFED\x03\x02\x02\x02\xFF\u0100\x07/\x02\x02\u0100\u0106\x07q\x02" +
		"\x02\u0101\u0102\x07/\x02\x02\u0102\u0106\x07~\x02\x02\u0103\u0104\x07" +
		"/\x02\x02\u0104\u0106\x07*\x02\x02\u0105\xFF\x03\x02\x02\x02\u0105\u0101" +
		"\x03\x02\x02\x02\u0105\u0103\x03\x02\x02\x02\u0106F\x03\x02\x02\x02\u0107" +
		"\u0109\t\x02\x02\x02\u0108\u0107\x03\x02\x02\x02\u0109\u010A\x03\x02\x02" +
		"\x02\u010A\u0108\x03\x02\x02\x02\u010A\u010B\x03\x02\x02\x02\u010B\u0112" +
		"\x03\x02\x02\x02\u010C\u010E\x070\x02\x02\u010D\u010F\t\x02\x02\x02\u010E" +
		"\u010D\x03\x02\x02\x02\u010F\u0110\x03\x02\x02\x02\u0110\u010E\x03\x02" +
		"\x02\x02\u0110\u0111\x03\x02\x02\x02\u0111\u0113\x03\x02\x02\x02\u0112" +
		"\u010C\x03\x02\x02\x02\u0112\u0113\x03\x02\x02\x02\u0113\u011B\x03\x02" +
		"\x02\x02\u0114\u0116\x070\x02\x02\u0115\u0117\t\x02\x02\x02\u0116\u0115" +
		"\x03\x02\x02\x02\u0117\u0118\x03\x02\x02\x02\u0118\u0116\x03\x02\x02\x02" +
		"\u0118\u0119\x03\x02\x02\x02\u0119\u011B\x03\x02\x02\x02\u011A\u0108\x03" +
		"\x02\x02\x02\u011A\u0114\x03\x02\x02\x02\u011BH\x03\x02\x02\x02\u011C" +
		"\u011D\x07v\x02\x02\u011D\u011E\x07t\x02\x02\u011E\u011F\x07w\x02\x02" +
		"\u011F\u0138\x07g\x02\x02\u0120\u0121\x07h\x02\x02\u0121\u0122\x07c\x02" +
		"\x02\u0122\u0123\x07n\x02\x02\u0123\u0124\x07u\x02\x02\u0124\u0138\x07" +
		"g\x02\x02\u0125\u0126\x07V\x02\x02\u0126\u0127\x07t\x02\x02\u0127\u0128" +
		"\x07w\x02\x02\u0128\u0138\x07g\x02\x02\u0129\u012A\x07H\x02\x02\u012A" +
		"\u012B\x07c\x02\x02\u012B\u012C\x07n\x02\x02\u012C\u012D\x07u\x02\x02" +
		"\u012D\u0138\x07g\x02\x02\u012E\u012F\x07V\x02\x02\u012F\u0130\x07T\x02" +
		"\x02\u0130\u0131\x07W\x02\x02\u0131\u0138\x07G\x02\x02\u0132\u0133\x07" +
		"H\x02\x02\u0133\u0134\x07C\x02\x02\u0134\u0135\x07N\x02\x02\u0135\u0136" +
		"\x07U\x02\x02\u0136\u0138\x07G\x02\x02\u0137\u011C\x03\x02\x02\x02\u0137" +
		"\u0120\x03\x02\x02\x02\u0137\u0125\x03\x02\x02\x02\u0137\u0129\x03\x02" +
		"\x02\x02\u0137\u012E\x03\x02\x02\x02\u0137\u0132\x03\x02\x02\x02\u0138" +
		"J\x03\x02\x02\x02\u0139\u013A\x07@\x02\x02\u013A\u0141\x07?\x02\x02\u013B" +
		"\u013C\x07>\x02\x02\u013C\u0141\x07?\x02\x02\u013D\u0141\t\x03\x02\x02" +
		"\u013E\u013F\x07?\x02\x02\u013F\u0141\x07?\x02\x02\u0140\u0139\x03\x02" +
		"\x02\x02\u0140\u013B\x03\x02\x02\x02\u0140\u013D\x03\x02\x02\x02\u0140" +
		"\u013E\x03\x02\x02\x02\u0141L\x03\x02\x02\x02\u0142\u0143\x07(\x02\x02" +
		"\u0143\u0147\x07(\x02\x02\u0144\u0145\x07~\x02\x02\u0145\u0147\x07~\x02" +
		"\x02\u0146\u0142\x03\x02\x02\x02\u0146\u0144\x03\x02\x02\x02\u0147N\x03" +
		"\x02\x02\x02\u0148\u0150\x05G$\x02\u0149\u014A\x07U\x02\x02\u014A\u014B" +
		"\x07D\x02\x02\u014B\u014C\x07Q\x02\x02\u014C\u014D\x07<\x02\x02\u014D" +
		"\u014E\x03\x02\x02\x02\u014E\u0150\x05G$\x02\u014F\u0148\x03\x02\x02\x02" +
		"\u014F\u0149\x03\x02\x02\x02\u0150P\x03\x02\x02\x02\u0151\u0152\x07<\x02" +
		"\x02\u0152\u0153\x07?\x02\x02\u0153R\x03\x02\x02\x02\u0154\u0155\x07k" +
		"\x02\x02\u0155\u0156\x07f\x02\x02\u0156\u0157\x07g\x02\x02\u0157\u0158" +
		"\x07p\x02\x02\u0158\u0159\x07v\x02\x02\u0159\u015A\x07k\x02\x02\u015A" +
		"\u015B\x07v\x02\x02\u015B\u02A7\x07{\x02\x02\u015C\u015D\x07k\x02\x02" +
		"\u015D\u02A7\x07u\x02\x02\u015E\u015F\x07d\x02\x02\u015F\u0160\x07k\x02" +
		"\x02\u0160\u0161\x07q\x02\x02\u0161\u0162\x07n\x02\x02\u0162\u0163\x07" +
		"q\x02\x02\u0163\u0164\x07i\x02\x02\u0164\u0165\x07k\x02\x02\u0165\u0166" +
		"\x07e\x02\x02\u0166\u0167\x07c\x02\x02\u0167\u0168\x07n\x02\x02\u0168" +
		"\u0169\x07a\x02\x02\u0169\u016A\x07g\x02\x02\u016A\u016B\x07p\x02\x02" +
		"\u016B\u016C\x07v\x02\x02\u016C\u016D\x07k\x02\x02\u016D\u016E\x07v\x02" +
		"\x02\u016E\u016F\x07{\x02\x02\u016F\u0170\x07a\x02\x02\u0170\u0171\x07" +
		"k\x02\x02\u0171\u02A7\x07u\x02\x02\u0172\u0173\x07o\x02\x02\u0173\u0174" +
		"\x07q\x02\x02\u0174\u0175\x07f\x02\x02\u0175\u0176\x07g\x02\x02\u0176" +
		"\u0177\x07n\x02\x02\u0177\u0178\x07a\x02\x02\u0178\u0179\x07g\x02\x02" +
		"\u0179\u017A\x07p\x02\x02\u017A\u017B\x07v\x02\x02\u017B\u017C\x07k\x02" +
		"\x02\u017C\u017D\x07v\x02\x02\u017D\u017E\x07{\x02\x02\u017E\u017F\x07" +
		"a\x02\x02\u017F\u0180\x07k\x02\x02\u0180\u02A7\x07u\x02\x02\u0181\u0182" +
		"\x07o\x02\x02\u0182\u0183\x07q\x02\x02\u0183\u0184\x07f\x02\x02\u0184" +
		"\u0185\x07g\x02\x02\u0185\u0186\x07n\x02\x02\u0186\u0187\x07a\x02\x02" +
		"\u0187\u0188\x07u\x02\x02\u0188\u0189\x07q\x02\x02\u0189\u018A\x07w\x02" +
		"\x02\u018A\u018B\x07t\x02\x02\u018B\u018C\x07e\x02\x02\u018C\u02A7\x07" +
		"g\x02\x02\u018D\u018E\x07j\x02\x02\u018E\u018F\x07c\x02\x02\u018F\u0190" +
		"\x07u\x02\x02\u0190\u0191\x07R\x02\x02\u0191\u0192\x07c\x02\x02\u0192" +
		"\u0193\x07t\x02\x02\u0193\u02A7\x07v\x02\x02\u0194\u0195\x07r\x02\x02" +
		"\u0195\u0196\x07c\x02\x02\u0196\u0197\x07t\x02\x02\u0197\u02A7\x07v\x02" +
		"\x02\u0198\u0199\x07r\x02\x02\u0199\u019A\x07c\x02\x02\u019A\u019B\x07" +
		"t\x02\x02\u019B\u019C\x07v\x02\x02\u019C\u019D\x07j\x02\x02\u019D\u019E" +
		"\x07q\x02\x02\u019E\u019F\x07q\x02\x02\u019F\u02A7\x07f\x02\x02\u01A0" +
		"\u01A1\x07k\x02\x02\u01A1\u01A2\x07u\x02\x02\u01A2\u01A3\x07R\x02\x02" +
		"\u01A3\u01A4\x07c\x02\x02\u01A4\u01A5\x07t\x02\x02\u01A5\u01A6\x07v\x02" +
		"\x02\u01A6\u01A7\x07Q\x02\x02\u01A7\u02A7\x07h\x02\x02\u01A8\u01A9\x07" +
		"k\x02\x02\u01A9\u01AA\x07u\x02\x02\u01AA\u01AB\x07X\x02\x02\u01AB\u01AC" +
		"\x07g\x02\x02\u01AC\u01AD\x07t\x02\x02\u01AD\u01AE\x07u\x02\x02\u01AE" +
		"\u01AF\x07k\x02\x02\u01AF\u01B0\x07q\x02\x02\u01B0\u01B1\x07p\x02\x02" +
		"\u01B1\u01B2\x07Q\x02\x02\u01B2\u02A7\x07h\x02\x02\u01B3\u01B4\x07j\x02" +
		"\x02\u01B4\u01B5\x07{\x02\x02\u01B5\u01B6\x07r\x02\x02\u01B6\u01B7\x07" +
		"g\x02\x02\u01B7\u01B8\x07t\x02\x02\u01B8\u01B9\x07p\x02\x02\u01B9\u01BA" +
		"\x07{\x02\x02\u01BA\u02A7\x07o\x02\x02\u01BB\u01BC\x07d\x02\x02\u01BC" +
		"\u01BD\x07k\x02\x02\u01BD\u01BE\x07q\x02\x02\u01BE\u01BF\x07n\x02\x02" +
		"\u01BF\u01C0\x07q\x02\x02\u01C0\u01C1\x07i\x02\x02\u01C1\u01C2\x07k\x02" +
		"\x02\u01C2\u01C3\x07e\x02\x02\u01C3\u01C4\x07c\x02\x02\u01C4\u01C5\x07" +
		"n\x02\x02\u01C5\u01C6\x07a\x02\x02\u01C6\u01C7\x07u\x02\x02\u01C7\u01C8" +
		"\x07{\x02\x02\u01C8\u01C9\x07u\x02\x02\u01C9\u01CA\x07v\x02\x02\u01CA" +
		"\u01CB\x07g\x02\x02\u01CB\u02A7\x07o\x02\x02\u01CC\u01CD\x07j\x02\x02" +
		"\u01CD\u01CE\x07c\x02\x02\u01CE\u01CF\x07u\x02\x02\u01CF\u01D0\x07X\x02" +
		"\x02\u01D0\u01D1\x07g\x02\x02\u01D1\u01D2\x07t\x02\x02\u01D2\u01D3\x07" +
		"u\x02\x02\u01D3\u01D4\x07k\x02\x02\u01D4\u01D5\x07q\x02\x02\u01D5\u02A7" +
		"\x07p\x02\x02\u01D6\u01D7\x07x\x02\x02\u01D7\u01D8\x07g\x02\x02\u01D8" +
		"\u01D9\x07t\x02\x02\u01D9\u01DA\x07u\x02\x02\u01DA\u01DB\x07k\x02\x02" +
		"\u01DB\u01DC\x07q\x02\x02\u01DC\u02A7\x07p\x02\x02\u01DD\u01DE\x07k\x02" +
		"\x02\u01DE\u01DF\x07u\x02\x02\u01DF\u01E0\x07J\x02\x02\u01E0\u01E1\x07" +
		"q\x02\x02\u01E1\u01E2\x07o\x02\x02\u01E2\u01E3\x07q\x02\x02\u01E3\u01E4" +
		"\x07n\x02\x02\u01E4\u01E5\x07q\x02\x02\u01E5\u01E6\x07i\x02\x02\u01E6" +
		"\u01E7\x07V\x02\x02\u01E7\u02A7\x07q\x02\x02\u01E8\u01E9\x07j\x02\x02" +
		"\u01E9\u01EA\x07q\x02\x02\u01EA\u01EB";
	private static readonly _serializedATNSegment1: string =
		"\x07o\x02\x02\u01EB\u01EC\x07q\x02\x02\u01EC\u01ED\x07n\x02\x02\u01ED" +
		"\u01EE\x07q\x02\x02\u01EE\u02A7\x07i\x02\x02\u01EF\u01F0\x07k\x02\x02" +
		"\u01F0\u01F1\x07u\x02\x02\u01F1\u01F2\x07F\x02\x02\u01F2\u01F3\x07g\x02" +
		"\x02\u01F3\u01F4\x07u\x02\x02\u01F4\u01F5\x07e\x02\x02\u01F5\u01F6\x07" +
		"t\x02\x02\u01F6\u01F7\x07k\x02\x02\u01F7\u01F8\x07d\x02\x02\u01F8\u01F9" +
		"\x07g\x02\x02\u01F9\u01FA\x07f\x02\x02\u01FA\u01FB\x07D\x02\x02\u01FB" +
		"\u02A7\x07{\x02\x02\u01FC\u01FD\x07f\x02\x02\u01FD\u01FE\x07g\x02\x02" +
		"\u01FE\u01FF\x07u\x02\x02\u01FF\u0200\x07e\x02\x02\u0200\u0201\x07t\x02" +
		"\x02\u0201\u0202\x07k\x02\x02\u0202\u0203\x07r\x02\x02\u0203\u0204\x07" +
		"v\x02\x02\u0204\u0205\x07k\x02\x02\u0205\u0206\x07q\x02\x02\u0206\u02A7" +
		"\x07p\x02\x02\u0207\u0208\x07r\x02\x02\u0208\u0209\x07w\x02\x02\u0209" +
		"\u020A\x07d\x02\x02\u020A\u020B\x07n\x02\x02\u020B\u020C\x07k\x02\x02" +
		"\u020C\u020D\x07e\x02\x02\u020D\u020E\x07c\x02\x02\u020E\u020F\x07v\x02" +
		"\x02\u020F\u0210\x07k\x02\x02\u0210\u0211\x07q\x02\x02\u0211\u02A7\x07" +
		"p\x02\x02\u0212\u0213\x07k\x02\x02\u0213\u0214\x07u\x02\x02\u0214\u0215" +
		"\x07G\x02\x02\u0215\u0216\x07p\x02\x02\u0216\u0217\x07e\x02\x02\u0217" +
		"\u0218\x07q\x02\x02\u0218\u0219\x07f\x02\x02\u0219\u021A\x07g\x02\x02" +
		"\u021A\u021B\x07f\x02\x02\u021B\u021C\x07D\x02\x02\u021C\u02A7\x07{\x02" +
		"\x02\u021D\u021E\x07g\x02\x02\u021E\u021F\x07p\x02\x02\u021F\u0220\x07" +
		"e\x02\x02\u0220\u0221\x07q\x02\x02\u0221\u0222\x07f\x02\x02\u0222\u0223" +
		"\x07g\x02\x02\u0223\u02A7\x07t\x02\x02\u0224\u0225\x07g\x02\x02\u0225" +
		"\u0226\x07p\x02\x02\u0226\u0227\x07e\x02\x02\u0227\u0228\x07q\x02\x02" +
		"\u0228\u0229\x07f\x02\x02\u0229\u022A\x07g\x02\x02\u022A\u02A7\x07u\x02" +
		"\x02\u022B\u022C\x07g\x02\x02\u022C\u022D\x07p\x02\x02\u022D\u022E\x07" +
		"e\x02\x02\u022E\u022F\x07q\x02\x02\u022F\u0230\x07f\x02\x02\u0230\u0231" +
		"\x07g\x02\x02\u0231\u0232\x07o\x02\x02\u0232\u0233\x07g\x02\x02\u0233" +
		"\u0234\x07p\x02\x02\u0234\u02A7\x07v\x02\x02\u0235\u0236\x07q\x02\x02" +
		"\u0236\u0237\x07e\x02\x02\u0237\u0238\x07e\x02\x02\u0238\u0239\x07w\x02" +
		"\x02\u0239\u023A\x07t\x02\x02\u023A\u023B\x07u\x02\x02\u023B\u023C\x07" +
		"K\x02\x02\u023C\u02A7\x07p\x02\x02\u023D\u023E\x07e\x02\x02\u023E\u023F" +
		"\x07q\x02\x02\u023F\u0240\x07p\x02\x02\u0240\u0241\x07v\x02\x02\u0241" +
		"\u0242\x07c\x02\x02\u0242\u0243\x07k\x02\x02\u0243\u0244\x07p\x02\x02" +
		"\u0244\u0245\x07g\x02\x02\u0245\u02A7\x07t\x02\x02\u0246\u0247\x07j\x02" +
		"\x02\u0247\u0248\x07c\x02\x02\u0248\u0249\x07u\x02\x02\u0249\u024A\x07" +
		"R\x02\x02\u024A\u024B\x07t\x02\x02\u024B\u024C\x07q\x02\x02\u024C\u024D" +
		"\x07r\x02\x02\u024D\u024E\x07g\x02\x02\u024E\u024F\x07t\x02\x02\u024F" +
		"\u0250\x07v\x02\x02\u0250\u02A7\x07{\x02\x02\u0251\u0252\x07r\x02\x02" +
		"\u0252\u0253\x07t\x02\x02\u0253\u0254\x07q\x02\x02\u0254\u0255\x07r\x02" +
		"\x02\u0255\u0256\x07g\x02\x02\u0256\u0257\x07t\x02\x02\u0257\u0258\x07" +
		"v\x02\x02\u0258\u02A7\x07{\x02\x02\u0259\u025A\x07r\x02\x02\u025A\u025B" +
		"\x07t\x02\x02\u025B\u025C\x07q\x02\x02\u025C\u025D\x07r\x02\x02\u025D" +
		"\u025E\x07g\x02\x02\u025E\u025F\x07t\x02\x02\u025F\u0260\x07v\x02\x02" +
		"\u0260\u0261\x07{\x02\x02\u0261\u0262\x07D\x02\x02\u0262\u0263\x07g\x02" +
		"\x02\u0263\u0264\x07c\x02\x02\u0264\u0265\x07t\x02\x02\u0265\u0266\x07" +
		"g\x02\x02\u0266\u02A7\x07t\x02\x02\u0267\u0268\x07k\x02\x02\u0268\u0269" +
		"\x07u\x02\x02\u0269\u026A\x07R\x02\x02\u026A\u026B\x07t\x02\x02\u026B" +
		"\u026C\x07q\x02\x02\u026C\u026D\x07r\x02\x02\u026D\u026E\x07g\x02\x02" +
		"\u026E\u026F\x07t\x02\x02\u026F\u0270\x07v\x02\x02\u0270\u0271\x07{\x02" +
		"\x02\u0271\u0272\x07Q\x02\x02\u0272\u02A7\x07h\x02\x02\u0273\u0274\x07" +
		"j\x02\x02\u0274\u0275\x07c\x02\x02\u0275\u0276\x07u\x02\x02\u0276\u0277" +
		"\x07V\x02\x02\u0277\u0278\x07c\x02\x02\u0278\u0279\x07z\x02\x02\u0279" +
		"\u027A\x07q\x02\x02\u027A\u02A7\x07p\x02\x02\u027B\u027C\x07v\x02\x02" +
		"\u027C\u027D\x07c\x02\x02\u027D\u027E\x07z\x02\x02\u027E\u027F\x07q\x02" +
		"\x02\u027F\u02A7\x07p\x02\x02\u0280\u0281\x07q\x02\x02\u0281\u0282\x07" +
		"t\x02\x02\u0282\u0283\x07k\x02\x02\u0283\u0284\x07i\x02\x02\u0284\u0285" +
		"\x07k\x02\x02\u0285\u02A7\x07p\x02\x02\u0286\u0287\x07k\x02\x02\u0287" +
		"\u0288\x07u\x02\x02\u0288\u0289\x07F\x02\x02\u0289\u028A\x07g\x02\x02" +
		"\u028A\u028B\x07t\x02\x02\u028B\u028C\x07k\x02\x02\u028C\u028D\x07x\x02" +
		"\x02\u028D\u028E\x07g\x02\x02\u028E\u028F\x07f\x02\x02\u028F\u0290\x07" +
		"H\x02\x02\u0290\u0291\x07t\x02\x02\u0291\u0292\x07q\x02\x02\u0292\u02A7" +
		"\x07o\x02\x02\u0293\u0294\x07j\x02\x02\u0294\u0295\x07c\x02\x02\u0295" +
		"\u0296\x07u\x02\x02\u0296\u0297\x07K\x02\x02\u0297\u0298\x07p\x02\x02" +
		"\u0298\u0299\x07u\x02\x02\u0299\u029A\x07v\x02\x02\u029A\u029B\x07c\x02" +
		"\x02\u029B\u029C\x07p\x02\x02\u029C\u029D\x07e\x02\x02\u029D\u02A7\x07" +
		"g\x02\x02\u029E\u029F\x07k\x02\x02\u029F\u02A0\x07p\x02\x02\u02A0\u02A1" +
		"\x07u\x02\x02\u02A1\u02A2\x07v\x02\x02\u02A2\u02A3\x07c\x02\x02\u02A3" +
		"\u02A4\x07p\x02\x02\u02A4\u02A5\x07e\x02\x02\u02A5\u02A7\x07g\x02\x02" +
		"\u02A6\u0154\x03\x02\x02\x02\u02A6\u015C\x03\x02\x02\x02\u02A6\u015E\x03" +
		"\x02\x02\x02\u02A6\u0172\x03\x02\x02\x02\u02A6\u0181\x03\x02\x02\x02\u02A6" +
		"\u018D\x03\x02\x02\x02\u02A6\u0194\x03\x02\x02\x02\u02A6\u0198\x03\x02" +
		"\x02\x02\u02A6\u01A0\x03\x02\x02\x02\u02A6\u01A8\x03\x02\x02\x02\u02A6" +
		"\u01B3\x03\x02\x02\x02\u02A6\u01BB\x03\x02\x02\x02\u02A6\u01CC\x03\x02" +
		"\x02\x02\u02A6\u01D6\x03\x02\x02\x02\u02A6\u01DD\x03\x02\x02\x02\u02A6" +
		"\u01E8\x03\x02\x02\x02\u02A6\u01EF\x03\x02\x02\x02\u02A6\u01FC\x03\x02" +
		"\x02\x02\u02A6\u0207\x03\x02\x02\x02\u02A6\u0212\x03\x02\x02\x02\u02A6" +
		"\u021D\x03\x02\x02\x02\u02A6\u0224\x03\x02\x02\x02\u02A6\u022B\x03\x02" +
		"\x02\x02\u02A6\u0235\x03\x02\x02\x02\u02A6\u023D\x03\x02\x02\x02\u02A6" +
		"\u0246\x03\x02\x02\x02\u02A6\u0251\x03\x02\x02\x02\u02A6\u0259\x03\x02" +
		"\x02\x02\u02A6\u0267\x03\x02\x02\x02\u02A6\u0273\x03\x02\x02\x02\u02A6" +
		"\u027B\x03\x02\x02\x02\u02A6\u0280\x03\x02\x02\x02\u02A6\u0286\x03\x02" +
		"\x02\x02\u02A6\u0293\x03\x02\x02\x02\u02A6\u029E\x03\x02\x02\x02\u02A7" +
		"T\x03\x02\x02\x02\u02A8\u02A9\x07x\x02\x02\u02A9\u02AA\x07c\x02\x02\u02AA" +
		"\u02B1\x07t\x02\x02\u02AB\u02AC\x07e\x02\x02\u02AC\u02AD\x07q\x02\x02" +
		"\u02AD\u02AE\x07p\x02\x02\u02AE\u02AF\x07u\x02\x02\u02AF\u02B1\x07v\x02" +
		"\x02\u02B0\u02A8\x03\x02\x02\x02\u02B0\u02AB\x03\x02\x02\x02\u02B1V\x03" +
		"\x02\x02\x02\u02B2\u02B3\x07u\x02\x02\u02B3\u02B4\x07w\x02\x02\u02B4\u02B5" +
		"\x07d\x02\x02\u02B5\u02B6\x07u\x02\x02\u02B6\u02B7\x07v\x02\x02\u02B7" +
		"\u02B8\x07c\x02\x02\u02B8\u02B9\x07p\x02\x02\u02B9\u02BA\x07e\x02\x02" +
		"\u02BA\u02BB\x07g\x02\x02\u02BB\u02BC\x07Q\x02\x02\u02BC\u02BD\x07p\x02" +
		"\x02\u02BD\u02BE\x07n\x02\x02\u02BE\u02BF\x07{\x02\x02\u02BFX\x03\x02" +
		"\x02\x02\u02C0\u02C1\x07u\x02\x02\u02C1\u02C2\x07r\x02\x02\u02C2\u02C3" +
		"\x07g\x02\x02\u02C3\u02C4\x07e\x02\x02\u02C4\u02C5\x07k\x02\x02\u02C5" +
		"\u02C6\x07g\x02\x02\u02C6\u02DA\x07u\x02\x02\u02C7\u02C8\x07e\x02\x02" +
		"\u02C8\u02C9\x07q\x02\x02\u02C9\u02CA\x07o\x02\x02\u02CA\u02CB\x07r\x02" +
		"\x02\u02CB\u02CC\x07c\x02\x02\u02CC\u02CD\x07t\x02\x02\u02CD\u02CE\x07" +
		"v\x02\x02\u02CE\u02CF\x07o\x02\x02\u02CF\u02D0\x07g\x02\x02\u02D0\u02D1" +
		"\x07p\x02\x02\u02D1\u02DA\x07v\x02\x02\u02D2\u02D3\x07h\x02\x02\u02D3" +
		"\u02D4\x07q\x02\x02\u02D4\u02D5\x07t\x02\x02\u02D5\u02D6\x07o\x02\x02" +
		"\u02D6\u02D7\x07w\x02\x02\u02D7\u02D8\x07n\x02\x02\u02D8\u02DA\x07c\x02" +
		"\x02\u02D9\u02C0\x03\x02\x02\x02\u02D9\u02C7\x03\x02\x02\x02\u02D9\u02D2" +
		"\x03\x02\x02\x02\u02DAZ\x03\x02\x02\x02\u02DB\u02DC\x071\x02\x02\u02DC" +
		"\u02DD\x071\x02\x02\u02DD\u02E1\x03\x02\x02\x02\u02DE\u02E0\n\x04\x02" +
		"\x02\u02DF\u02DE\x03\x02\x02\x02\u02E0\u02E3\x03\x02\x02\x02\u02E1\u02DF" +
		"\x03\x02\x02\x02\u02E1\u02E2\x03\x02\x02\x02\u02E2\u02E4\x03\x02\x02\x02" +
		"\u02E3\u02E1\x03\x02\x02\x02\u02E4\u02E5\x05k6\x02\u02E5\u02E6\x03\x02" +
		"\x02\x02\u02E6\u02E7\b.\x02\x02\u02E7\\\x03\x02\x02\x02\u02E8\u02E9\x07" +
		"u\x02\x02\u02E9\u02EA\x07r\x02\x02\u02EA\u02EB\x07g\x02\x02\u02EB\u02EC" +
		"\x07e\x02\x02\u02EC\u02ED\x07k\x02\x02\u02ED\u02EE\x07g\x02\x02\u02EE" +
		"\u0329\x07u\x02\x02\u02EF\u02F0\x07e\x02\x02\u02F0\u02F1\x07q\x02\x02" +
		"\u02F1\u02F2\x07o\x02\x02\u02F2\u02F3\x07r\x02\x02\u02F3\u02F4\x07c\x02" +
		"\x02\u02F4\u02F5\x07t\x02\x02\u02F5\u02F6\x07v\x02\x02\u02F6\u02F7\x07" +
		"o\x02\x02\u02F7\u02F8\x07g\x02\x02\u02F8\u02F9\x07p\x02\x02\u02F9\u0329" +
		"\x07v\x02\x02\u02FA\u02FB\x07x\x02\x02\u02FB\u02FC\x07c\x02\x02\u02FC" +
		"\u0329\x07t\x02\x02\u02FD\u02FE\x07e\x02\x02\u02FE\u02FF\x07q\x02\x02" +
		"\u02FF\u0300\x07p\x02\x02\u0300\u0301\x07u\x02\x02\u0301\u0329\x07v\x02" +
		"\x02\u0302\u0303\x07h\x02\x02\u0303\u0304\x07q\x02\x02\u0304\u0305\x07" +
		"t\x02\x02\u0305\u0306\x07o\x02\x02\u0306\u0307\x07w\x02\x02\u0307\u0308" +
		"\x07n\x02\x02\u0308\u0329\x07c\x02\x02\u0309\u030A\x07h\x02\x02\u030A" +
		"\u030B\x07w\x02\x02\u030B\u030C\x07p\x02\x02\u030C\u030D\x07e\x02\x02" +
		"\u030D\u030E\x07v\x02\x02\u030E\u030F\x07k\x02\x02\u030F\u0310\x07q\x02" +
		"\x02\u0310\u0329\x07p\x02\x02\u0311\u0312\x07g\x02\x02\u0312\u0313\x07" +
		"p\x02\x02\u0313\u0329\x07f\x02\x02\u0314\u0315\x07o\x02\x02\u0315\u0316" +
		"\x07q\x02\x02\u0316\u0317\x07f\x02\x02\u0317\u0318\x07g\x02\x02\u0318" +
		"\u0329\x07n\x02\x02\u0319\u031A\x07u\x02\x02\u031A\u031B\x07w\x02\x02" +
		"\u031B\u031C\x07d\x02\x02\u031C\u031D\x07u\x02\x02\u031D\u031E\x07v\x02" +
		"\x02\u031E\u031F\x07c\x02\x02\u031F\u0320\x07p\x02\x02\u0320\u0321\x07" +
		"e\x02\x02\u0321\u0322\x07g\x02\x02\u0322\u0323\x07Q\x02\x02\u0323\u0324" +
		"\x07p\x02\x02\u0324\u0325\x07n\x02\x02\u0325\u0329\x07{\x02\x02\u0326" +
		"\u0327\x07k\x02\x02\u0327\u0329\x07p\x02\x02\u0328\u02E8\x03\x02\x02\x02" +
		"\u0328\u02EF\x03\x02\x02\x02\u0328\u02FA\x03\x02\x02\x02\u0328\u02FD\x03" +
		"\x02\x02\x02\u0328\u0302\x03\x02\x02\x02\u0328\u0309\x03\x02\x02\x02\u0328" +
		"\u0311\x03\x02\x02\x02\u0328\u0314\x03\x02\x02\x02\u0328\u0319\x03\x02" +
		"\x02\x02\u0328\u0326\x03\x02\x02\x02\u0328\u0329\x03\x02\x02\x02\u0329" +
		"\u032A\x03\x02\x02\x02\u032A\u032B\x05_0\x02\u032B^\x03\x02\x02\x02\u032C" +
		"\u032F\x07a\x02\x02\u032D\u032F\x05a1\x02\u032E\u032C\x03\x02\x02\x02" +
		"\u032E\u032D\x03\x02\x02\x02\u032F\u0335\x03\x02\x02\x02\u0330\u0334\x07" +
		"a\x02\x02\u0331\u0334\x05a1\x02\u0332\u0334\x05i5\x02\u0333\u0330\x03" +
		"\x02\x02\x02\u0333\u0331\x03\x02\x02\x02\u0333\u0332\x03\x02\x02\x02\u0334" +
		"\u0337\x03\x02\x02\x02\u0335\u0333\x03\x02\x02\x02\u0335\u0336\x03\x02" +
		"\x02\x02\u0336`\x03\x02\x02\x02\u0337\u0335\x03\x02\x02\x02\u0338\u033B" +
		"\x05g4\x02\u0339\u033B\x05e3\x02\u033A\u0338\x03\x02\x02\x02\u033A\u0339" +
		"\x03\x02\x02\x02\u033Bb\x03\x02\x02\x02\u033C\u033E\x05a1\x02\u033D\u033C" +
		"\x03\x02\x02\x02\u033E\u033F\x03\x02\x02\x02\u033F\u033D\x03\x02\x02\x02" +
		"\u033F\u0340\x03\x02\x02\x02\u0340d\x03\x02\x02\x02\u0341\u0342\t\x05" +
		"\x02\x02\u0342f\x03\x02\x02\x02\u0343\u0344\t\x06\x02\x02\u0344h\x03\x02" +
		"\x02\x02\u0345\u0346\t\x02\x02\x02\u0346j\x03\x02\x02\x02\u0347\u0348" +
		"\t\x04\x02\x02\u0348l\x03\x02\x02\x02\u0349\u034B\t\x07\x02\x02\u034A" +
		"\u0349\x03\x02\x02\x02\u034B\u034C\x03\x02\x02\x02\u034C\u034A\x03\x02" +
		"\x02\x02\u034C\u034D\x03\x02\x02\x02\u034D\u034E\x03\x02\x02\x02\u034E" +
		"\u034F\b7\x02\x02\u034Fn\x03\x02\x02\x02\u0350\u0356\x07$\x02\x02\u0351" +
		"\u0355\n\b\x02\x02\u0352\u0353\x07^\x02\x02\u0353\u0355\v\x02\x02\x02" +
		"\u0354\u0351\x03\x02\x02\x02\u0354\u0352\x03\x02\x02\x02\u0355\u0358\x03" +
		"\x02\x02\x02\u0356\u0354\x03\x02\x02\x02\u0356\u0357\x03\x02\x02\x02\u0357" +
		"\u0359\x03\x02\x02\x02\u0358\u0356\x03\x02\x02\x02\u0359\u035A\x07$\x02" +
		"\x02\u035Ap\x03\x02\x02\x02\x1B\x02\xFD\u0105\u010A\u0110\u0112\u0118" +
		"\u011A\u0137\u0140\u0146\u014F\u02A6\u02B0\u02D9\u02E1\u0328\u032E\u0333" +
		"\u0335\u033A\u033F\u034C\u0354\u0356\x03\b\x02\x02";
	public static readonly _serializedATN: string = Utils.join(
		[
			AntimonyGrammarLexer._serializedATNSegment0,
			AntimonyGrammarLexer._serializedATNSegment1,
		],
		"",
	);
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!AntimonyGrammarLexer.__ATN) {
			AntimonyGrammarLexer.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(AntimonyGrammarLexer._serializedATN));
		}

		return AntimonyGrammarLexer.__ATN;
	}

}

