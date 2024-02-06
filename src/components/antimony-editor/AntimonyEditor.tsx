import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { antimonyLanguage } from '../../languages/antlr/AntimonyLanguage';
import { antimonyTheme } from '../../languages/AntimonyTheme';
import CustomButton from '../CustomButton';
import './AntimonyEditor.css';
import { getBiomodels, getModel } from '../../features/BrowseBiomodels';
import Loader from '../Loader';
import ModelParser from '../../languages/ModelParser';
import handleDownload from '../../features/HandleDownload';
import { IDBPDatabase, DBSchema } from 'idb';

/**
 * @description AntimonyEditorProps interface
 * @interface
 * @property {string} content - The content of the editor
 * @property {string} fileName - The name of the file
 */
interface AntimonyEditorProps {
  content: string;
  fileName: string;
}

/**
 * @description IndexedDB schema
 * @interface
 * @property {object} files - The files object
 * @property {string} files.key - The key of the files object
 * @property {object} files.value - The value of the files object
 * @property {string} files.value.name - The name of the file
 * @property {string} files.value.content - The content of the file
 * @extends DBSchema
 */
interface MyDB extends DBSchema {
  files: {
    key: string;
    value: { name: string; content: string };
  };
}

/**
 * @description Declare global variables
 * @global
 * @property {string} antimonyString - The Antimony string
 * @property {string} sbmlString - The SBML string
 * @property {function} processAntimony - The processAntimony function
 */
declare global {
  interface Window {
    antimonyString: string; // Define the antimonyString variable
    sbmlString: string; // Define the sbmlString variable
    antimonyActive: boolean; // Define the antimonyActive variable
    processAntimony?: () => void; // Define the processAntimony function
  }
}

/**
 * @description AntimonyEditor component
 * @param content - AntimonyEditorProp
 * @param fileName - AntimonyEditorProp
 * @param database - IDBPDatabase<MyDB>
 * @example
 * <AntimonyEditor content={content} fileName={fileName} database={database} />
 * @returns - AntimonyEditor component
 */
const AntimonyEditor: React.FC<AntimonyEditorProps & { database: IDBPDatabase<MyDB> }> = ({ content, fileName, database }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [chosenModel, setChosenModel] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  // const [originalContent, setOriginalContent] = useState<string>(content); // Track the original content
  const [newContent, setNewContent] = useState<string>(content); // Track the new content
  const [selectedFile, setSelectedFile] = useState<string>('')

  /**
   * @description Loads the editor and sets the language, theme, and content
   */
  useEffect(() => {
    if (editorRef.current) {
      // Load the custom language
      monaco.languages.register({ id: 'antimony' });
      monaco.languages.setMonarchTokensProvider('antimony', antimonyLanguage);

      // Load the custom theme
      monaco.editor.defineTheme('antimonyTheme', antimonyTheme);
      monaco.editor.setTheme('antimonyTheme');

      // Retrieve content and file name from IndexedDB
      database.transaction('files').objectStore('files').get(fileName).then((data) => {
        if (data) {
          // setOriginalContent(data.content);
          setNewContent(data.content);
          setSelectedFile(data.name);
          editor.setValue(data.content);
        }
      });

      // Create the editor
      const editor = monaco.editor.create(editorRef.current, {
        bracketPairColorization: { enabled: true }, // Enable bracket pair colorization
        value: content,
        language: 'antimony',
      });

      window.antimonyActive = true;

      // Set language configuration for bracket pair colorization
      monaco.languages.setLanguageConfiguration('antimony', {
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
        ],
      });

      // setOriginalContent(editor.getValue());

      // Delay the model parser to avoid parsing while the user is typing
      let typingTimer: any;
      const delayedModelParser = (editor: monaco.editor.IStandaloneCodeEditor) => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          ModelParser(editor, true);
        }, 300);
      };

      // Parse the model whenever the user types
      editor.onDidChangeModelContent(() => {
        setNewContent(editor.getValue());
        delayedModelParser(editor);
      });

      getBiomodels(setLoading, setChosenModel);

      setEditorInstance(editor);

      setSelectedFile(fileName);

      // Set the antimonyString variable to the editor content
      window.antimonyString = editor.getValue();

      return () => editor.dispose();
    }
  }, [content, database, fileName]);

  /**
   * @description Saves the name and content of the file selected to IndexedDB
   */
  useEffect(() => {
    if (database && editorInstance) {
      setNewContent(editorInstance.getValue());
      const transaction = database.transaction('files', 'readwrite');
      transaction.objectStore('files').put({
        name: selectedFile,
        content: newContent,
      });
    }
  }, [newContent, selectedFile, database, editorInstance]);

  /**
   * @description Handles displaying the dropdown when a user searches for a model
   */
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

  /**
   * @description Handles conversion from Antimony to SBML
   */
  const handleConversion = () => {
    try {
      if (window.processAntimony) {
        window.processAntimony();
      } else {
        console.error('processAntimony function not found in the global scope.');
      }
    } catch (err) {
      console.log('Conversion error:', err);
    }
  };

  return (
    <div>
      <div className='menu'>
        <button className='button' onClick={() => handleDownload(editorInstance, fileName)}>Save File to Downloads Folder</button>
        {/* <button className='button' onClick={save}> Save Changes </button> */}
        {/* <CustomButton name={'Create Annotations'} /> */}
        <CustomButton name={'Navigate to Edit Annotations'} />
        {/* <CustomButton name={'Insert Rate Law'} />
        <CustomButton name={'Annotated Variable Highlight Off'} /> */}
        <button className='button' onClick={handleConversion}>Convert Antimony to SBML</button>
        <input id='biomodel-browse' type='text' placeholder='Search for a model' />
        <ul id='dropdown' />
        <Loader loading={loading} />
      </div>
      <div className="code-editor" ref={editorRef}></div>
    </div>
  );
};

export default AntimonyEditor;
