import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { antimonyLanguage } from './languages/AntimonyLanguage';
import { antimonyTheme } from './languages/AntimonyTheme';
import { parseAntimonyModel } from './languages/AntimonyParser'
import CustomButton from './components/CustomButton';
import './AntimonyEditor.css';
import { searchModels } from './features/BrowseBiomodels';

interface AntimonyEditorProps {
  content: string;
}

const AntimonyEditor: React.FC<AntimonyEditorProps> = ({ content }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

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

      const biomodelBrowse = document.getElementById('biomodel-browse') as HTMLInputElement;
      const dropdown = document.getElementById('dropdown');

      biomodelBrowse.addEventListener('keyup', async (val) => {
        const biomodel = val;
        if ((val.target as HTMLInputElement).value.length < 3) {
          dropdown!.innerHTML = "";
          return;
        }
        const results = await searchModels(biomodel);
        console.log(results)
      });

      return () => editor.dispose();
    }
  }, [content]);

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
        <CustomButton name={'Browse Biomodels'} />
      </div>
      <div className="code-editor" ref={editorRef} style={{ height: '80vh' }}></div>
    </div>
  );
};

async function searchModel(query: any) {
  console.log(query)
  const queryText = query.target.value.trim()
  console.log(queryText)
}

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
