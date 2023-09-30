import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { antimonyLanguage } from './languages/antlr/AntimonyLanguage';
import { antimonyTheme } from './languages/AntimonyTheme';
import { parseAntimonyModel } from './languages/AntimonyParser'
import CustomButton from './components/CustomButton';
import './AntimonyEditor.css';
import { getModel, searchModels } from './features/BrowseBiomodels';
import libantimony from './libAntimony/libantimony.js';
import Loader from './components/Loader';
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { AntimonyGrammarLexer } from './languages/antlr/AntimonyGrammarLexer';
import { Annot_listContext, AnnotationContext, AntimonyGrammarParser, AssignmentContext, Decl_itemContext, DeclarationContext, In_compContext, NamemaybeinContext, Reaction_nameContext, SpeciesContext, Unit_declarationContext } from './languages/antlr/AntimonyGrammarParser';
import { AntimonyGrammarListener } from './languages/antlr/AntimonyGrammarListener'
import { ModelContext } from './languages/antlr/AntimonyGrammarParser'
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'

interface AntimonyEditorProps {
  content: string;
}

// var loadAntimonyString; // libantimony function
// var loadString;   // 		"
// var loadSBMLString; //		"
// var getSBMLString; //		"
// var getAntimonyString; //	"
// var getCompSBMLString; //	"
// var clearPreviousLoads; //	"
// var getLastError; //		"
// var getWarnings;  //		"
// var getSBMLInfoMessages; //	"
// var getSBMLWarnings; //		"
// var freeAll;      //		"
// var jsFree;         // emscripten function
// var jsAllocateUTF8; //  	

// try {
//   libantimony().then((libantimony: any) => {
//     //	Format: libantimony.cwrap( function name, return type, input param array of types).
//     loadString = libantimony.cwrap("loadString", "number", ["number"]);
//     loadAntimonyString = libantimony.cwrap("loadAntimonyString", "number", [
//       "number",
//     ]);
//     loadSBMLString = libantimony.cwrap("loadSBMLString", "number", [
//       "number",
//     ]);
//     getSBMLString = libantimony.cwrap("getSBMLString", "string", ["null"]);
//     getAntimonyString = libantimony.cwrap("getAntimonyString", "string", [
//       "null",
//     ]);
//     getCompSBMLString = libantimony.cwrap("getCompSBMLString", "string", [
//       "string",
//     ]);
//     clearPreviousLoads = libantimony.cwrap("clearPreviousLoads", "null", [
//       "null",
//     ]);
//     getLastError = libantimony.cwrap("getLastError", "string", ["null"]);
//     getWarnings = libantimony.cwrap("getWarnings", "string", ["null"]);
//     getSBMLInfoMessages = libantimony.cwrap("getSBMLInfoMessages", "string", [
//       "string",
//     ]);
//     getSBMLWarnings = libantimony.cwrap("getSBMLWarnings", "string", [
//       "string",
//     ]);
//     freeAll = libantimony.cwrap("freeAll", "null", ["null"]);

//     jsFree = (strPtr: any) => libantimony._free(strPtr);
//     jsAllocateUTF8 = (newStr: any) => libantimony.allocateUTF8(newStr);
//   });
// } catch (err) {
//   console.log("Load libantimony error: ", err);
// }

const AntimonyEditor: React.FC<AntimonyEditorProps> = ({ content }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [chosenModel, setChosenModel] = useState<string | null>(null);
  
  function getBiomodels() {
    const biomodelBrowse = document.getElementById('biomodel-browse') as HTMLInputElement;
    const dropdown = document.getElementById('dropdown');
    var biomodels: any;
    var chosenModel: any;
  
    biomodelBrowse.addEventListener('keyup', async (val) => {
      const biomodel = val;
      if ((val.target as HTMLInputElement).value.length < 3) {
        dropdown!.innerHTML = "";
        return;
      }
      setTimeout(async () => {
        setLoading(true);
        dropdown!.innerHTML = "";
        biomodels = await searchModels(biomodel);
        // If no models found, display "No models found"
        if (biomodels.models.size === 0) {
          setLoading(false);
          biomodels = null;
          const li = document.createElement('li');
          li.innerHTML = "No models found";
          dropdown!.innerHTML = "";
          dropdown!.appendChild(li);
          return;
        }
        // Otherwise, display the models in the dropdown
        dropdown!.style.display = "block";
        biomodels.models.forEach(function (model: any) {
          setLoading(false);
          const a = document.createElement('a');
          a.addEventListener('click', () => {
            biomodelBrowse.value = "";
            dropdown!.innerHTML = "";
            chosenModel = model.id;
            setChosenModel(chosenModel);
          });
          a.innerHTML = model.name + ": " + model.id + "\n";
          dropdown!.appendChild(a);
        });
      }, 300);
    });
  }
  
  useEffect(() => {
    if (editorRef.current) {
      // Load the custom language
      monaco.languages.register({ id: 'antimony' });
      monaco.languages.setMonarchTokensProvider('antimony', antimonyLanguage);

      // Load the custom theme
      monaco.editor.defineTheme('antimonyTheme', antimonyTheme);
      monaco.editor.setTheme('antimonyTheme');

      const editor = monaco.editor.create(editorRef.current, {
        bracketPairColorization: { enabled: true }, // Enable bracket pair colorization
        value: content,
        language: 'antimony',
      });

      // Set language configuration for bracket pair colorization
      monaco.languages.setLanguageConfiguration('antimony', {
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
          // Add any other bracket pairs used in your language, including nested ones
        ],
      });

      parseAntimony(editor.getValue());

      editor.onDidChangeModelContent(() => {
        parseAntimony(editor.getValue());
      });

      // Create the lexer and parser
      let inputStream = new ANTLRInputStream(editor.getValue());
      let lexer = new AntimonyGrammarLexer(inputStream);
      let tokenStream = new CommonTokenStream(lexer);
      let parser = new AntimonyGrammarParser(tokenStream);

      // Parse the input, where `compilationUnit` is whatever entry point you defined
      let tree = parser.root();

      class VariableInfo {
        label?: string;
        modifiers?: string;
        assignment?: string;
        initializations?: string[] = [];
        compartments?: string;
        annotations?: string[] = [];
      }
      
      var variables: Map<string, VariableInfo> = new Map<string, VariableInfo>();

      var annotatedVar: string[] = [];

      class AntimonySyntax implements AntimonyGrammarListener {
        enterModel(ctx: ModelContext) {
          const modelName = ctx.NAME().text; // Get the model name
          const modelInfo = new VariableInfo();

          let variable = variables.get(modelName);
          if (!variable) {
            modelInfo.label = 'Model';
            variables.set(modelName, modelInfo);
          } else {
            variable.label = 'Model';
          }
        };

        enterSpecies(ctx: SpeciesContext) {
          const speciesInfo = new VariableInfo();
          speciesInfo.label = 'Species';

          let variable = variables.get(ctx.text);

          if (!variable) {
            variables.set(ctx.text, speciesInfo);
          } else {
            variable.label = 'Species';
          }
        };

        enterReaction_name (ctx: Reaction_nameContext) {
          const reactionName = ctx.namemaybein().text; // Get reaction name
          const reactionInfo = new VariableInfo();

          let variable = variables.get(reactionName);

          if (!variable) {
            reactionInfo.label = 'Reaction'
            variables.set(reactionName, reactionInfo)
          } else {
            variable.label = 'Reaction';
          }
        };

        enterDeclaration (ctx: DeclarationContext) {
          const varType = ctx.decl_modifiers().text; // Get modifier
          if (varType == 'compartment') {
            ctx.decl_item().forEach((item) => {
              const varName = item.namemaybein().var_name().text; // Get variable name
              let variable = variables.get(varName);
              if (variable) {
                variable.label = 'Compartment';
              } else {
                let variableInfo = new VariableInfo();
                variableInfo.label = 'Compartment';
                variables.set(varName, variableInfo);
              }
            });
          }
          ctx.decl_item().forEach((item) => {
            const varName = item.namemaybein().var_name().text; // Get variable name
            let variable = variables.get(varName);
            if (variable) {
              variable.modifiers = varType;
            } else {
              let variableInfo = new VariableInfo();
              variableInfo.modifiers = varType;
              variables.set(varName, variableInfo);
            }
          });
        };

        enterAssignment (ctx: AssignmentContext) {
          const varName = ctx.namemaybein().var_name().text; // Get variable name
          const varAssignment = ctx.sum().text; // Get assignment
          let variable = variables.get(varName);
          if (variable && varAssignment) {
            variable.assignment = varAssignment;
          } else if (!variable && varAssignment) {
            let variableInfo = new VariableInfo();
            variableInfo.assignment = varAssignment;
            variables.set(varName, variableInfo);
          }
        };

        enterUnit_declaration (ctx: Unit_declarationContext) {
          const varName = ctx.var_name().text; // Get variable name
          const varSum = ctx.sum().text; // Get sum
          let variable = variables.get(varName);
          if (variable && varSum) {
            variable.assignment = varSum;
            variable.label = 'Unit';
            variable.modifiers = 'unit';
          } else if (!variable && varSum) {
            let variableInfo = new VariableInfo();
            variableInfo.assignment = varSum;
            variableInfo.label = 'Unit';
            variableInfo.modifiers = 'unit';
            variables.set(varName, variableInfo);
          }
        };

        enterNamemaybein(ctx: NamemaybeinContext) {
          const varName = ctx.var_name().text; // Get the species name
          const compartmentCtx = ctx.in_comp();
          const compartment = compartmentCtx ? compartmentCtx.var_name().text : undefined; // Get compartment
      
          let variable = variables.get(varName);
      
          if (variable && compartment) {
            variable.compartments = compartment;
          } else if (!variable && compartment) {
            const variableInfo = new VariableInfo();
            variableInfo.compartments = compartment;
            variables.set(varName, variableInfo);
          }
        }

        enterAnnotation(ctx: AnnotationContext) {
          const varName = ctx.var_name().text; // Get the species name
          const annotationlink = ctx.ESCAPED_STRING().text; // Get the annotation

          if (annotatedVar.includes(varName)) {
            return;
          } else {
            annotatedVar.push(varName);
          }

          let variable = variables.get(varName);
          if (variable) {
            variable.annotations?.push(annotationlink);
          } else {
            const annotationInfo = new VariableInfo();
            annotationInfo.annotations?.push(annotationlink);
            variables.set(varName, annotationInfo);
          }
        };


        // other enterX functions...
      }
      console.log(variables)
      console.log(annotatedVar)

      // Create the listener
      const listener: AntimonyGrammarListener = new AntimonySyntax();
      // Use the entry point for listeners
      ParseTreeWalker.DEFAULT.walk(listener, tree)

      // console.log('tree:' + tree.toStringTree(parser))

      getBiomodels();

      return () => editor.dispose();
    }
  }, [content]);

  useEffect(() => {
    if (chosenModel) {
      const dropdown = document.getElementById('dropdown');
      dropdown!.style.display = "none";
      setLoading(true);
      getModel(chosenModel).then((model) => {
        setLoading(false);
        const editor = monaco.editor.getModels()[0];
        editor.setValue(model);
      });
    }
  }, [chosenModel]);

  return (
    <div>
      <div className='menu'>
        {/* <button className='button' onClick={save}> Save Changes </button> */}
        <CustomButton name={'Create Annotations'} />
        <CustomButton name={'Navigate to Edit Annotations'} />
        <CustomButton name={'Insert Rate Law'} />
        <CustomButton name={'Convert to SBML'} />
        <CustomButton name={'Annotated Variable Highlight Off'} />
        <input id='biomodel-browse' type='text' placeholder='Search for a model' />
        <ul id='dropdown' />
        <Loader loading={loading} />
      </div>
      <div className="code-editor" ref={editorRef} style={{ height: '80vh' }}></div>
    </div>
  );
};

function parseAntimony(editorVal: string) {
  let parsedModel = parseAntimonyModel(editorVal);

  // Register the hover provider
  monaco.languages.registerHoverProvider('antimony', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      let hoverContents: monaco.IMarkdownString[] = [];
  
      if (word) {
        if (parsedModel.displays.has(word.word)){
          const displayName = parsedModel.displays.get(word.word);
          hoverContents.push(
            { supportHtml: true,
              value: `<span style="color:#f2ab7c;">"${displayName?.name}"</span>`})
        }
        if (parsedModel.species.has(word.word)) {
          const speciesInfo = parsedModel.species.get(word.word);
          hoverContents.push(
            { supportHtml: true,
              value: `(<span style="color:#FD7F20;">**species**</span>) ${speciesInfo?.name}`},
            { supportHtml: true,
              value: `In <span style="color:#BC96CA;">**compartment**</span>: ${speciesInfo?.compartment}` }
          );
        }
        if (parsedModel.units.has(word.word)) {
          const unitInfo = parsedModel.units.get(word.word);
          hoverContents.push(
            { supportHtml: true,
              value: `(<span style="color:#4954F5;">**unit**</span>) ${unitInfo?.name}` },
            { value: `${unitInfo?.unit}` });
        }
        if (parsedModel.functions.has(word.word)) {
          const functionInfo = parsedModel.functions.get(word.word);
          hoverContents.push(
            { supportHtml: true,
              value: `(<span style="color:#8185C9;">**function**</span>) ${functionInfo?.name}` },
            { value: `${functionInfo?.function}` });
        }
        if (parsedModel.reactions.has(word.word)) {
          const reactInfo = parsedModel.reactions.get(word.word);
          hoverContents.push(
            { supportHtml: true,
              value: `(<span style="color:#4DC5B9;">**reaction**</span>) ${reactInfo?.name}` });
        }
        if (parsedModel.initializations.has(word.word)) {
          const initializationInfo = parsedModel.initializations.get(word.word);
          hoverContents.push(
            { supportHtml: true,
              value: `Initialized Value: <span style="color:#DEF9CB;">${initializationInfo?.value}</span>` });
        }
        if (parsedModel.annotations.has(word.word)) {
          const annotationInfo = parsedModel.annotations.get(word.word);
          const annots = annotationInfo?.annotation.split(',');
          if (annots) {
            for (let i = 0; i < annots.length; i++) {
              hoverContents.push({ value: `${annots[i]}` });
            }
          }
        }
        return {
          range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
          contents: hoverContents,
        };
      }
  
      return null;
    },
  });
}

export default AntimonyEditor;
