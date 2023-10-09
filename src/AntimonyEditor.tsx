import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { antimonyLanguage } from './languages/antlr/AntimonyLanguage';
import { antimonyTheme } from './languages/AntimonyTheme';
import CustomButton from './components/CustomButton';
import './AntimonyEditor.css';
import { getModel, searchModels } from './features/BrowseBiomodels';
import libantimony from './libAntimony/libantimony.js';
import Loader from './components/Loader';
import ModelParser from './languages/ModelParser';
import handleDownload from './features/HandleDownload';

interface AntimonyEditorProps {
  content: string;
  fileName: string;
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

let currentHoverDisposable: monaco.IDisposable | null = null;

const AntimonyEditor: React.FC<AntimonyEditorProps> = ({ content, fileName }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [chosenModel, setChosenModel] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [originalContent, setOriginalContent] = useState<string>(content); // Track the original content
  const [newContent, setNewContent] = useState<string>(content); // Track the new content

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

      // Create the editor
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

      // Set the hover provider
      ModelParser(editor)

      setOriginalContent(editor.getValue());

      editor.onDidChangeModelContent(() => {
        // Dispose of the current hover provider if it exists
        // if (currentHoverDisposable) {
        //   currentHoverDisposable.dispose();
        //   currentHoverDisposable = null;
        // }
        
        setNewContent(editor.getValue())
        ModelParser(editor)
      });

      getBiomodels();

      setEditorInstance(editor)

      return () => editor.dispose();
    }
  }, [content]);

  useEffect(() => {
    // Display dropdown when a user searches for a model
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
        <button className='button' onClick={() => handleDownload(editorInstance, fileName)}>Download File</button>
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

export default AntimonyEditor;
