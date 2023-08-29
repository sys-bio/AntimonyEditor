// Generated from /Users/evaliu/Documents/AntimonyEditor/src/languages/AntimonyGrammar.g4 by ANTLR 4.9.2
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class AntimonyGrammarParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.9.2", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, T__6=7, T__7=8, T__8=9, 
		T__9=10, T__10=11, T__11=12, T__12=13, T__13=14, T__14=15, T__15=16, T__16=17, 
		END=18, ARROW=19, AEQ=20, TYPE_MODIFIER=21, COMMENT=22, NAME=23, CNAME=24, 
		LETTER=25, WORD=26, LCASE_LETTER=27, UCASE_LETTER=28, DIGIT=29, NUMBER=30, 
		NEWLINE=31, WS=32;
	public static final int
		RULE_model = 0, RULE_var_name = 1, RULE_in_comp = 2, RULE_namemaybein = 3, 
		RULE_empty = 4, RULE_reaction_name = 5, RULE_reaction = 6, RULE_species_list = 7, 
		RULE_species = 8, RULE_assignment = 9, RULE_declaration = 10, RULE_decl_modifiers = 11, 
		RULE_decl_item = 12, RULE_decl_assignment = 13, RULE_sum = 14, RULE_product = 15, 
		RULE_power = 16, RULE_atom = 17, RULE_simple_stmt = 18, RULE_small_stmt = 19, 
		RULE_simple_stmt_list = 20;
	private static String[] makeRuleNames() {
		return new String[] {
			"model", "var_name", "in_comp", "namemaybein", "empty", "reaction_name", 
			"reaction", "species_list", "species", "assignment", "declaration", "decl_modifiers", 
			"decl_item", "decl_assignment", "sum", "product", "power", "atom", "simple_stmt", 
			"small_stmt", "simple_stmt_list"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'model'", "'module'", "'()'", "'$'", "'in'", "':'", "';'", "'+'", 
			"'='", "','", "'-'", "'*'", "'/'", "'^'", "'exp'", "'('", "')'", "'end'", 
			null, "':='"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, "END", "ARROW", "AEQ", "TYPE_MODIFIER", 
			"COMMENT", "NAME", "CNAME", "LETTER", "WORD", "LCASE_LETTER", "UCASE_LETTER", 
			"DIGIT", "NUMBER", "NEWLINE", "WS"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "AntimonyGrammar.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public AntimonyGrammarParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	public static class ModelContext extends ParserRuleContext {
		public TerminalNode NAME() { return getToken(AntimonyGrammarParser.NAME, 0); }
		public Simple_stmt_listContext simple_stmt_list() {
			return getRuleContext(Simple_stmt_listContext.class,0);
		}
		public TerminalNode END() { return getToken(AntimonyGrammarParser.END, 0); }
		public TerminalNode NEWLINE() { return getToken(AntimonyGrammarParser.NEWLINE, 0); }
		public TerminalNode COMMENT() { return getToken(AntimonyGrammarParser.COMMENT, 0); }
		public ModelContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_model; }
	}

	public final ModelContext model() throws RecognitionException {
		ModelContext _localctx = new ModelContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_model);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(43);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NEWLINE) {
				{
				setState(42);
				match(NEWLINE);
				}
			}

			setState(46);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==COMMENT) {
				{
				setState(45);
				match(COMMENT);
				}
			}

			setState(48);
			_la = _input.LA(1);
			if ( !(_la==T__0 || _la==T__1) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(49);
			match(NAME);
			setState(51);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==T__2) {
				{
				setState(50);
				match(T__2);
				}
			}

			setState(53);
			simple_stmt_list();
			setState(54);
			match(END);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Var_nameContext extends ParserRuleContext {
		public TerminalNode NAME() { return getToken(AntimonyGrammarParser.NAME, 0); }
		public Var_nameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_var_name; }
	}

	public final Var_nameContext var_name() throws RecognitionException {
		Var_nameContext _localctx = new Var_nameContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_var_name);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(57);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==T__3) {
				{
				setState(56);
				match(T__3);
				}
			}

			setState(59);
			match(NAME);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class In_compContext extends ParserRuleContext {
		public Var_nameContext var_name() {
			return getRuleContext(Var_nameContext.class,0);
		}
		public In_compContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_in_comp; }
	}

	public final In_compContext in_comp() throws RecognitionException {
		In_compContext _localctx = new In_compContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_in_comp);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(61);
			match(T__4);
			setState(62);
			var_name();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NamemaybeinContext extends ParserRuleContext {
		public Var_nameContext var_name() {
			return getRuleContext(Var_nameContext.class,0);
		}
		public In_compContext in_comp() {
			return getRuleContext(In_compContext.class,0);
		}
		public NamemaybeinContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_namemaybein; }
	}

	public final NamemaybeinContext namemaybein() throws RecognitionException {
		NamemaybeinContext _localctx = new NamemaybeinContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_namemaybein);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(64);
			var_name();
			setState(66);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==T__4) {
				{
				setState(65);
				in_comp();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EmptyContext extends ParserRuleContext {
		public EmptyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_empty; }
	}

	public final EmptyContext empty() throws RecognitionException {
		EmptyContext _localctx = new EmptyContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_empty);
		try {
			enterOuterAlt(_localctx, 1);
			{
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Reaction_nameContext extends ParserRuleContext {
		public NamemaybeinContext namemaybein() {
			return getRuleContext(NamemaybeinContext.class,0);
		}
		public Reaction_nameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_reaction_name; }
	}

	public final Reaction_nameContext reaction_name() throws RecognitionException {
		Reaction_nameContext _localctx = new Reaction_nameContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_reaction_name);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(70);
			namemaybein();
			setState(71);
			match(T__5);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ReactionContext extends ParserRuleContext {
		public List<Species_listContext> species_list() {
			return getRuleContexts(Species_listContext.class);
		}
		public Species_listContext species_list(int i) {
			return getRuleContext(Species_listContext.class,i);
		}
		public TerminalNode ARROW() { return getToken(AntimonyGrammarParser.ARROW, 0); }
		public Reaction_nameContext reaction_name() {
			return getRuleContext(Reaction_nameContext.class,0);
		}
		public SumContext sum() {
			return getRuleContext(SumContext.class,0);
		}
		public In_compContext in_comp() {
			return getRuleContext(In_compContext.class,0);
		}
		public ReactionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_reaction; }
	}

	public final ReactionContext reaction() throws RecognitionException {
		ReactionContext _localctx = new ReactionContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_reaction);
		int _la;
		try {
			setState(103);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,13,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(74);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,5,_ctx) ) {
				case 1:
					{
					setState(73);
					reaction_name();
					}
					break;
				}
				setState(76);
				species_list();
				setState(77);
				match(ARROW);
				setState(79);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__3) | (1L << NAME) | (1L << NUMBER))) != 0)) {
					{
					setState(78);
					species_list();
					}
				}

				setState(81);
				match(T__6);
				setState(83);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__3) | (1L << T__7) | (1L << T__10) | (1L << T__14) | (1L << T__15) | (1L << NAME) | (1L << NUMBER))) != 0)) {
					{
					setState(82);
					sum(0);
					}
				}

				setState(86);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==T__4) {
					{
					setState(85);
					in_comp();
					}
				}

				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(89);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,9,_ctx) ) {
				case 1:
					{
					setState(88);
					reaction_name();
					}
					break;
				}
				setState(92);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__3) | (1L << NAME) | (1L << NUMBER))) != 0)) {
					{
					setState(91);
					species_list();
					}
				}

				setState(94);
				match(ARROW);
				setState(95);
				species_list();
				setState(96);
				match(T__6);
				setState(98);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__3) | (1L << T__7) | (1L << T__10) | (1L << T__14) | (1L << T__15) | (1L << NAME) | (1L << NUMBER))) != 0)) {
					{
					setState(97);
					sum(0);
					}
				}

				setState(101);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==T__4) {
					{
					setState(100);
					in_comp();
					}
				}

				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Species_listContext extends ParserRuleContext {
		public List<SpeciesContext> species() {
			return getRuleContexts(SpeciesContext.class);
		}
		public SpeciesContext species(int i) {
			return getRuleContext(SpeciesContext.class,i);
		}
		public Species_listContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_species_list; }
	}

	public final Species_listContext species_list() throws RecognitionException {
		Species_listContext _localctx = new Species_listContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_species_list);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(105);
			species();
			setState(110);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__7) {
				{
				{
				setState(106);
				match(T__7);
				setState(107);
				species();
				}
				}
				setState(112);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SpeciesContext extends ParserRuleContext {
		public TerminalNode NAME() { return getToken(AntimonyGrammarParser.NAME, 0); }
		public TerminalNode NUMBER() { return getToken(AntimonyGrammarParser.NUMBER, 0); }
		public SpeciesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_species; }
	}

	public final SpeciesContext species() throws RecognitionException {
		SpeciesContext _localctx = new SpeciesContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_species);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(114);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NUMBER) {
				{
				setState(113);
				match(NUMBER);
				}
			}

			setState(117);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==T__3) {
				{
				setState(116);
				match(T__3);
				}
			}

			setState(119);
			match(NAME);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AssignmentContext extends ParserRuleContext {
		public NamemaybeinContext namemaybein() {
			return getRuleContext(NamemaybeinContext.class,0);
		}
		public SumContext sum() {
			return getRuleContext(SumContext.class,0);
		}
		public TerminalNode AEQ() { return getToken(AntimonyGrammarParser.AEQ, 0); }
		public AssignmentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_assignment; }
	}

	public final AssignmentContext assignment() throws RecognitionException {
		AssignmentContext _localctx = new AssignmentContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_assignment);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(121);
			namemaybein();
			setState(122);
			_la = _input.LA(1);
			if ( !(_la==T__8 || _la==AEQ) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(123);
			sum(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DeclarationContext extends ParserRuleContext {
		public Decl_modifiersContext decl_modifiers() {
			return getRuleContext(Decl_modifiersContext.class,0);
		}
		public List<Decl_itemContext> decl_item() {
			return getRuleContexts(Decl_itemContext.class);
		}
		public Decl_itemContext decl_item(int i) {
			return getRuleContext(Decl_itemContext.class,i);
		}
		public DeclarationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_declaration; }
	}

	public final DeclarationContext declaration() throws RecognitionException {
		DeclarationContext _localctx = new DeclarationContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_declaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(125);
			decl_modifiers();
			setState(126);
			decl_item();
			setState(131);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__9) {
				{
				{
				setState(127);
				match(T__9);
				setState(128);
				decl_item();
				}
				}
				setState(133);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Decl_modifiersContext extends ParserRuleContext {
		public TerminalNode TYPE_MODIFIER() { return getToken(AntimonyGrammarParser.TYPE_MODIFIER, 0); }
		public Decl_modifiersContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_decl_modifiers; }
	}

	public final Decl_modifiersContext decl_modifiers() throws RecognitionException {
		Decl_modifiersContext _localctx = new Decl_modifiersContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_decl_modifiers);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(134);
			match(TYPE_MODIFIER);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Decl_itemContext extends ParserRuleContext {
		public NamemaybeinContext namemaybein() {
			return getRuleContext(NamemaybeinContext.class,0);
		}
		public Decl_assignmentContext decl_assignment() {
			return getRuleContext(Decl_assignmentContext.class,0);
		}
		public Decl_itemContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_decl_item; }
	}

	public final Decl_itemContext decl_item() throws RecognitionException {
		Decl_itemContext _localctx = new Decl_itemContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_decl_item);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(136);
			namemaybein();
			setState(138);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==T__8) {
				{
				setState(137);
				decl_assignment();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Decl_assignmentContext extends ParserRuleContext {
		public SumContext sum() {
			return getRuleContext(SumContext.class,0);
		}
		public Decl_assignmentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_decl_assignment; }
	}

	public final Decl_assignmentContext decl_assignment() throws RecognitionException {
		Decl_assignmentContext _localctx = new Decl_assignmentContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_decl_assignment);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(140);
			match(T__8);
			setState(141);
			sum(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SumContext extends ParserRuleContext {
		public ProductContext product() {
			return getRuleContext(ProductContext.class,0);
		}
		public SumContext sum() {
			return getRuleContext(SumContext.class,0);
		}
		public SumContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sum; }
	}

	public final SumContext sum() throws RecognitionException {
		return sum(0);
	}

	private SumContext sum(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		SumContext _localctx = new SumContext(_ctx, _parentState);
		SumContext _prevctx = _localctx;
		int _startState = 28;
		enterRecursionRule(_localctx, 28, RULE_sum, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(144);
			product(0);
			}
			_ctx.stop = _input.LT(-1);
			setState(154);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,20,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(152);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,19,_ctx) ) {
					case 1:
						{
						_localctx = new SumContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_sum);
						setState(146);
						if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
						setState(147);
						match(T__7);
						setState(148);
						product(0);
						}
						break;
					case 2:
						{
						_localctx = new SumContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_sum);
						setState(149);
						if (!(precpred(_ctx, 1))) throw new FailedPredicateException(this, "precpred(_ctx, 1)");
						setState(150);
						match(T__10);
						setState(151);
						product(0);
						}
						break;
					}
					} 
				}
				setState(156);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,20,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public static class ProductContext extends ParserRuleContext {
		public PowerContext power() {
			return getRuleContext(PowerContext.class,0);
		}
		public ProductContext product() {
			return getRuleContext(ProductContext.class,0);
		}
		public ProductContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_product; }
	}

	public final ProductContext product() throws RecognitionException {
		return product(0);
	}

	private ProductContext product(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		ProductContext _localctx = new ProductContext(_ctx, _parentState);
		ProductContext _prevctx = _localctx;
		int _startState = 30;
		enterRecursionRule(_localctx, 30, RULE_product, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(158);
			power(0);
			}
			_ctx.stop = _input.LT(-1);
			setState(168);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,22,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(166);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,21,_ctx) ) {
					case 1:
						{
						_localctx = new ProductContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_product);
						setState(160);
						if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
						setState(161);
						match(T__11);
						setState(162);
						power(0);
						}
						break;
					case 2:
						{
						_localctx = new ProductContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_product);
						setState(163);
						if (!(precpred(_ctx, 1))) throw new FailedPredicateException(this, "precpred(_ctx, 1)");
						setState(164);
						match(T__12);
						setState(165);
						power(0);
						}
						break;
					}
					} 
				}
				setState(170);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,22,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public static class PowerContext extends ParserRuleContext {
		public AtomContext atom() {
			return getRuleContext(AtomContext.class,0);
		}
		public PowerContext power() {
			return getRuleContext(PowerContext.class,0);
		}
		public PowerContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_power; }
	}

	public final PowerContext power() throws RecognitionException {
		return power(0);
	}

	private PowerContext power(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		PowerContext _localctx = new PowerContext(_ctx, _parentState);
		PowerContext _prevctx = _localctx;
		int _startState = 32;
		enterRecursionRule(_localctx, 32, RULE_power, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(175);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case T__3:
			case T__7:
			case T__10:
			case T__15:
			case NAME:
			case NUMBER:
				{
				setState(172);
				atom();
				}
				break;
			case T__14:
				{
				setState(173);
				match(T__14);
				setState(174);
				atom();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			_ctx.stop = _input.LT(-1);
			setState(182);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,24,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					{
					_localctx = new PowerContext(_parentctx, _parentState);
					pushNewRecursionContext(_localctx, _startState, RULE_power);
					setState(177);
					if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
					setState(178);
					match(T__13);
					setState(179);
					atom();
					}
					} 
				}
				setState(184);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,24,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public static class AtomContext extends ParserRuleContext {
		public TerminalNode NUMBER() { return getToken(AntimonyGrammarParser.NUMBER, 0); }
		public Var_nameContext var_name() {
			return getRuleContext(Var_nameContext.class,0);
		}
		public AtomContext atom() {
			return getRuleContext(AtomContext.class,0);
		}
		public SumContext sum() {
			return getRuleContext(SumContext.class,0);
		}
		public AtomContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_atom; }
	}

	public final AtomContext atom() throws RecognitionException {
		AtomContext _localctx = new AtomContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_atom);
		try {
			setState(197);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,25,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(185);
				match(NUMBER);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(186);
				var_name();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(187);
				match(NUMBER);
				setState(188);
				var_name();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(189);
				match(T__10);
				setState(190);
				atom();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(191);
				match(T__7);
				setState(192);
				atom();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(193);
				match(T__15);
				setState(194);
				sum(0);
				setState(195);
				match(T__16);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Simple_stmtContext extends ParserRuleContext {
		public TerminalNode NEWLINE() { return getToken(AntimonyGrammarParser.NEWLINE, 0); }
		public Small_stmtContext small_stmt() {
			return getRuleContext(Small_stmtContext.class,0);
		}
		public Simple_stmtContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_simple_stmt; }
	}

	public final Simple_stmtContext simple_stmt() throws RecognitionException {
		Simple_stmtContext _localctx = new Simple_stmtContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_simple_stmt);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(200);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__3) | (1L << ARROW) | (1L << TYPE_MODIFIER) | (1L << NAME) | (1L << NUMBER))) != 0)) {
				{
				setState(199);
				small_stmt();
				}
			}

			setState(202);
			_la = _input.LA(1);
			if ( !(_la==T__6 || _la==NEWLINE) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Small_stmtContext extends ParserRuleContext {
		public ReactionContext reaction() {
			return getRuleContext(ReactionContext.class,0);
		}
		public AssignmentContext assignment() {
			return getRuleContext(AssignmentContext.class,0);
		}
		public DeclarationContext declaration() {
			return getRuleContext(DeclarationContext.class,0);
		}
		public Small_stmtContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_small_stmt; }
	}

	public final Small_stmtContext small_stmt() throws RecognitionException {
		Small_stmtContext _localctx = new Small_stmtContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_small_stmt);
		try {
			setState(207);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,27,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(204);
				reaction();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(205);
				assignment();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(206);
				declaration();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Simple_stmt_listContext extends ParserRuleContext {
		public List<Simple_stmtContext> simple_stmt() {
			return getRuleContexts(Simple_stmtContext.class);
		}
		public Simple_stmtContext simple_stmt(int i) {
			return getRuleContext(Simple_stmtContext.class,i);
		}
		public Simple_stmt_listContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_simple_stmt_list; }
	}

	public final Simple_stmt_listContext simple_stmt_list() throws RecognitionException {
		Simple_stmt_listContext _localctx = new Simple_stmt_listContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_simple_stmt_list);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(210); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(209);
				simple_stmt();
				}
				}
				setState(212); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__3) | (1L << T__6) | (1L << ARROW) | (1L << TYPE_MODIFIER) | (1L << NAME) | (1L << NUMBER) | (1L << NEWLINE))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 14:
			return sum_sempred((SumContext)_localctx, predIndex);
		case 15:
			return product_sempred((ProductContext)_localctx, predIndex);
		case 16:
			return power_sempred((PowerContext)_localctx, predIndex);
		}
		return true;
	}
	private boolean sum_sempred(SumContext _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return precpred(_ctx, 2);
		case 1:
			return precpred(_ctx, 1);
		}
		return true;
	}
	private boolean product_sempred(ProductContext _localctx, int predIndex) {
		switch (predIndex) {
		case 2:
			return precpred(_ctx, 2);
		case 3:
			return precpred(_ctx, 1);
		}
		return true;
	}
	private boolean power_sempred(PowerContext _localctx, int predIndex) {
		switch (predIndex) {
		case 4:
			return precpred(_ctx, 2);
		}
		return true;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\"\u00d9\4\2\t\2\4"+
		"\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13\t"+
		"\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22\t\22"+
		"\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\3\2\5\2.\n\2\3\2\5\2\61\n\2\3"+
		"\2\3\2\3\2\5\2\66\n\2\3\2\3\2\3\2\3\3\5\3<\n\3\3\3\3\3\3\4\3\4\3\4\3\5"+
		"\3\5\5\5E\n\5\3\6\3\6\3\7\3\7\3\7\3\b\5\bM\n\b\3\b\3\b\3\b\5\bR\n\b\3"+
		"\b\3\b\5\bV\n\b\3\b\5\bY\n\b\3\b\5\b\\\n\b\3\b\5\b_\n\b\3\b\3\b\3\b\3"+
		"\b\5\be\n\b\3\b\5\bh\n\b\5\bj\n\b\3\t\3\t\3\t\7\to\n\t\f\t\16\tr\13\t"+
		"\3\n\5\nu\n\n\3\n\5\nx\n\n\3\n\3\n\3\13\3\13\3\13\3\13\3\f\3\f\3\f\3\f"+
		"\7\f\u0084\n\f\f\f\16\f\u0087\13\f\3\r\3\r\3\16\3\16\5\16\u008d\n\16\3"+
		"\17\3\17\3\17\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20\7\20\u009b"+
		"\n\20\f\20\16\20\u009e\13\20\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3"+
		"\21\7\21\u00a9\n\21\f\21\16\21\u00ac\13\21\3\22\3\22\3\22\3\22\5\22\u00b2"+
		"\n\22\3\22\3\22\3\22\7\22\u00b7\n\22\f\22\16\22\u00ba\13\22\3\23\3\23"+
		"\3\23\3\23\3\23\3\23\3\23\3\23\3\23\3\23\3\23\3\23\5\23\u00c8\n\23\3\24"+
		"\5\24\u00cb\n\24\3\24\3\24\3\25\3\25\3\25\5\25\u00d2\n\25\3\26\6\26\u00d5"+
		"\n\26\r\26\16\26\u00d6\3\26\2\5\36 \"\27\2\4\6\b\n\f\16\20\22\24\26\30"+
		"\32\34\36 \"$&(*\2\5\3\2\3\4\4\2\13\13\26\26\4\2\t\t!!\2\u00e5\2-\3\2"+
		"\2\2\4;\3\2\2\2\6?\3\2\2\2\bB\3\2\2\2\nF\3\2\2\2\fH\3\2\2\2\16i\3\2\2"+
		"\2\20k\3\2\2\2\22t\3\2\2\2\24{\3\2\2\2\26\177\3\2\2\2\30\u0088\3\2\2\2"+
		"\32\u008a\3\2\2\2\34\u008e\3\2\2\2\36\u0091\3\2\2\2 \u009f\3\2\2\2\"\u00b1"+
		"\3\2\2\2$\u00c7\3\2\2\2&\u00ca\3\2\2\2(\u00d1\3\2\2\2*\u00d4\3\2\2\2,"+
		".\7!\2\2-,\3\2\2\2-.\3\2\2\2.\60\3\2\2\2/\61\7\30\2\2\60/\3\2\2\2\60\61"+
		"\3\2\2\2\61\62\3\2\2\2\62\63\t\2\2\2\63\65\7\31\2\2\64\66\7\5\2\2\65\64"+
		"\3\2\2\2\65\66\3\2\2\2\66\67\3\2\2\2\678\5*\26\289\7\24\2\29\3\3\2\2\2"+
		":<\7\6\2\2;:\3\2\2\2;<\3\2\2\2<=\3\2\2\2=>\7\31\2\2>\5\3\2\2\2?@\7\7\2"+
		"\2@A\5\4\3\2A\7\3\2\2\2BD\5\4\3\2CE\5\6\4\2DC\3\2\2\2DE\3\2\2\2E\t\3\2"+
		"\2\2FG\3\2\2\2G\13\3\2\2\2HI\5\b\5\2IJ\7\b\2\2J\r\3\2\2\2KM\5\f\7\2LK"+
		"\3\2\2\2LM\3\2\2\2MN\3\2\2\2NO\5\20\t\2OQ\7\25\2\2PR\5\20\t\2QP\3\2\2"+
		"\2QR\3\2\2\2RS\3\2\2\2SU\7\t\2\2TV\5\36\20\2UT\3\2\2\2UV\3\2\2\2VX\3\2"+
		"\2\2WY\5\6\4\2XW\3\2\2\2XY\3\2\2\2Yj\3\2\2\2Z\\\5\f\7\2[Z\3\2\2\2[\\\3"+
		"\2\2\2\\^\3\2\2\2]_\5\20\t\2^]\3\2\2\2^_\3\2\2\2_`\3\2\2\2`a\7\25\2\2"+
		"ab\5\20\t\2bd\7\t\2\2ce\5\36\20\2dc\3\2\2\2de\3\2\2\2eg\3\2\2\2fh\5\6"+
		"\4\2gf\3\2\2\2gh\3\2\2\2hj\3\2\2\2iL\3\2\2\2i[\3\2\2\2j\17\3\2\2\2kp\5"+
		"\22\n\2lm\7\n\2\2mo\5\22\n\2nl\3\2\2\2or\3\2\2\2pn\3\2\2\2pq\3\2\2\2q"+
		"\21\3\2\2\2rp\3\2\2\2su\7 \2\2ts\3\2\2\2tu\3\2\2\2uw\3\2\2\2vx\7\6\2\2"+
		"wv\3\2\2\2wx\3\2\2\2xy\3\2\2\2yz\7\31\2\2z\23\3\2\2\2{|\5\b\5\2|}\t\3"+
		"\2\2}~\5\36\20\2~\25\3\2\2\2\177\u0080\5\30\r\2\u0080\u0085\5\32\16\2"+
		"\u0081\u0082\7\f\2\2\u0082\u0084\5\32\16\2\u0083\u0081\3\2\2\2\u0084\u0087"+
		"\3\2\2\2\u0085\u0083\3\2\2\2\u0085\u0086\3\2\2\2\u0086\27\3\2\2\2\u0087"+
		"\u0085\3\2\2\2\u0088\u0089\7\27\2\2\u0089\31\3\2\2\2\u008a\u008c\5\b\5"+
		"\2\u008b\u008d\5\34\17\2\u008c\u008b\3\2\2\2\u008c\u008d\3\2\2\2\u008d"+
		"\33\3\2\2\2\u008e\u008f\7\13\2\2\u008f\u0090\5\36\20\2\u0090\35\3\2\2"+
		"\2\u0091\u0092\b\20\1\2\u0092\u0093\5 \21\2\u0093\u009c\3\2\2\2\u0094"+
		"\u0095\f\4\2\2\u0095\u0096\7\n\2\2\u0096\u009b\5 \21\2\u0097\u0098\f\3"+
		"\2\2\u0098\u0099\7\r\2\2\u0099\u009b\5 \21\2\u009a\u0094\3\2\2\2\u009a"+
		"\u0097\3\2\2\2\u009b\u009e\3\2\2\2\u009c\u009a\3\2\2\2\u009c\u009d\3\2"+
		"\2\2\u009d\37\3\2\2\2\u009e\u009c\3\2\2\2\u009f\u00a0\b\21\1\2\u00a0\u00a1"+
		"\5\"\22\2\u00a1\u00aa\3\2\2\2\u00a2\u00a3\f\4\2\2\u00a3\u00a4\7\16\2\2"+
		"\u00a4\u00a9\5\"\22\2\u00a5\u00a6\f\3\2\2\u00a6\u00a7\7\17\2\2\u00a7\u00a9"+
		"\5\"\22\2\u00a8\u00a2\3\2\2\2\u00a8\u00a5\3\2\2\2\u00a9\u00ac\3\2\2\2"+
		"\u00aa\u00a8\3\2\2\2\u00aa\u00ab\3\2\2\2\u00ab!\3\2\2\2\u00ac\u00aa\3"+
		"\2\2\2\u00ad\u00ae\b\22\1\2\u00ae\u00b2\5$\23\2\u00af\u00b0\7\21\2\2\u00b0"+
		"\u00b2\5$\23\2\u00b1\u00ad\3\2\2\2\u00b1\u00af\3\2\2\2\u00b2\u00b8\3\2"+
		"\2\2\u00b3\u00b4\f\4\2\2\u00b4\u00b5\7\20\2\2\u00b5\u00b7\5$\23\2\u00b6"+
		"\u00b3\3\2\2\2\u00b7\u00ba\3\2\2\2\u00b8\u00b6\3\2\2\2\u00b8\u00b9\3\2"+
		"\2\2\u00b9#\3\2\2\2\u00ba\u00b8\3\2\2\2\u00bb\u00c8\7 \2\2\u00bc\u00c8"+
		"\5\4\3\2\u00bd\u00be\7 \2\2\u00be\u00c8\5\4\3\2\u00bf\u00c0\7\r\2\2\u00c0"+
		"\u00c8\5$\23\2\u00c1\u00c2\7\n\2\2\u00c2\u00c8\5$\23\2\u00c3\u00c4\7\22"+
		"\2\2\u00c4\u00c5\5\36\20\2\u00c5\u00c6\7\23\2\2\u00c6\u00c8\3\2\2\2\u00c7"+
		"\u00bb\3\2\2\2\u00c7\u00bc\3\2\2\2\u00c7\u00bd\3\2\2\2\u00c7\u00bf\3\2"+
		"\2\2\u00c7\u00c1\3\2\2\2\u00c7\u00c3\3\2\2\2\u00c8%\3\2\2\2\u00c9\u00cb"+
		"\5(\25\2\u00ca\u00c9\3\2\2\2\u00ca\u00cb\3\2\2\2\u00cb\u00cc\3\2\2\2\u00cc"+
		"\u00cd\t\4\2\2\u00cd\'\3\2\2\2\u00ce\u00d2\5\16\b\2\u00cf\u00d2\5\24\13"+
		"\2\u00d0\u00d2\5\26\f\2\u00d1\u00ce\3\2\2\2\u00d1\u00cf\3\2\2\2\u00d1"+
		"\u00d0\3\2\2\2\u00d2)\3\2\2\2\u00d3\u00d5\5&\24\2\u00d4\u00d3\3\2\2\2"+
		"\u00d5\u00d6\3\2\2\2\u00d6\u00d4\3\2\2\2\u00d6\u00d7\3\2\2\2\u00d7+\3"+
		"\2\2\2\37-\60\65;DLQUX[^dgiptw\u0085\u008c\u009a\u009c\u00a8\u00aa\u00b1"+
		"\u00b8\u00c7\u00ca\u00d1\u00d6";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}