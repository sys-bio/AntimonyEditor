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
import { Annot_listContext, AnnotationContext, AntimonyGrammarParser, SpeciesContext } from './languages/antlr/AntimonyGrammarParser';
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

      class SpeciesInfo {
        declarations?: string[] = [];
        initializations?: string[] = [];
        compartments?: string[] = [];
        annotations?: string[] = [];
      }
      
      var species: Map<string, SpeciesInfo> = new Map<string, SpeciesInfo>();

      class AntimonySyntax implements AntimonyGrammarListener {
        
        // Entering parser rule
        enterModel(context: ModelContext) {
          console.log(`Model start line number ${context._start.line}`)
          // model.addModel(context.text)
        }

        enterSpecies(ctx: SpeciesContext) {
          species.set(ctx.text, {})
        };

        enterAnnotation(ctx: AnnotationContext) {
          const speciesName = ctx.var_name().text; // Get the species name
          const annotationlink = ctx.ESCAPED_STRING().text; // Get the ANNOT_KEYWORD

          console.log("species " + speciesName)
          console.log("ann " + annotationlink)

          const specKey = species.get(speciesName)

          if (specKey) {
            specKey.annotations?.push(annotationlink)
            console.log(specKey)
          }

        };
        // other enterX functions...
      }
      console.log(species)

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
