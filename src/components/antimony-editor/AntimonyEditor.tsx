import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { antimonyLanguage } from '../../language-handler/antlr/AntimonyLanguage';
import { antimonyTheme } from '../../language-handler/AntimonyTheme';
import CustomButton from '../CustomButton';
import './AntimonyEditor.css';
import { getBiomodels, getModel } from '../../features/BrowseBiomodels';
import Loader from '../Loader';
import ModelParser from '../../language-handler/ModelParser';
import ModelSemanticsChecker from '../../language-handler/ModelSemanticChecker';
import handleDownload from '../../features/HandleDownload';
import { IDBPDatabase, DBSchema } from 'idb';

/**
 * @description AntimonyEditorProps interface
 * @interface
 * @property {string} content - The content of the editor
 * @property {string} fileName - The name of the file
 * @property {string} handleFileUpload - Handle the file upload
 */
interface AntimonyEditorProps {
  content: string;
  fileName: string;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
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
    sbmlResult: string; // Define the sbmlResult variable
    antimonyResult: string; // Define the antimonyResult variable
    antimonyActive: boolean; // Define the antimonyActive variable
    fileName: string; // Define the fileName variable
    url: string; // Define the link variable
    conversion: string; // Define the conversion variable
    processAntimony?: () => void; // Define the processAntimony function
    processSBML?: () => void; // Define the processSBML function
    selectedFile: string; // Define the selectedFile variable
  }
}

/**
 * @description AntimonyEditor component
 * @param content - AntimonyEditorProp
 * @param fileName - AntimonyEditorProp
 * @param database - IDBPDatabase<MyDB>
 * @param handleFileUpload - AntimonyEditorProp
 * @example - <AntimonyEditor content={content} fileName={fileName} database={database} />
 * @returns - AntimonyEditor component
 */
const AntimonyEditor: React.FC<AntimonyEditorProps & { database: IDBPDatabase<MyDB> }> = ({ content, fileName, database, handleFileUpload }) => {
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
      let editor: any;
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
          // setSelectedFile(data.name);
          window.selectedFile = data.name;
          editor.setValue(data.content);
        }
      });

      if (fileName.includes('.xml')) {
        // Create the editor
        editor = monaco.editor.create(editorRef.current, {
          bracketPairColorization: { enabled: true }, // Enable bracket pair colorization
          value: content,
          language: 'xml',
        });
        console.log('SBML Editor');
        // Set the antimonyString variable to the editor content
        window.sbmlString = editor.getValue();
      } else {
        editor = monaco.editor.create(editorRef.current, {
          bracketPairColorization: { enabled: true }, // Enable bracket pair colorization
          value: content,
          language: 'antimony',
        });
        window.antimonyActive = true;
        console.log('Antimony Editor');
        // Set the antimonyString variable to the editor content
        window.antimonyString = editor.getValue();
      }

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
          ModelSemanticsChecker(editor, true);
        }, 600);
      };

      // Parse the model whenever the user types
      editor.onDidChangeModelContent(() => {
        setNewContent(editor.getValue());
        delayedModelParser(editor);
      });

      getBiomodels(setLoading, setChosenModel);

      setEditorInstance(editor);

      setSelectedFile(fileName);

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
      if (chosenModel === '') {
        setLoading(false);
        return;
      }
      getModel(chosenModel).then((model) => {
        window.sbmlString = model[1];
        window.fileName = model[0];
        window.url = model[2];
        handleConversionSBML();
        setLoading(false);
      });
    }
  }, [chosenModel]);

  /**
   * @description Handles conversion from Antimony to SBML
   */
  const handleConversionAnt = () => {
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

  /**
   * @description Handles conversion from SBML to Antimony
   */
  const handleConversionSBML = () => {
    try {
      if (window.processSBML) {
        window.processSBML();
      } else {
        console.error('processSBML function not found in the global scope.');
      }
    } catch (err) {
      console.log('Conversion error:', err);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleButtonClick = () => {
    if (dropdownRef.current) {
      setDropdownVisible(!isDropdownVisible);
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className='menu'>
        <input id="file-upload" type="file" multiple onChange={handleFileUpload} />
        <label htmlFor="file-upload" className='file-upload-label'>Load File(s)</label>
        {/* <button className='button' onClick={save}> Save Changes </button> */}
        {/* <button className='btn'>Navigate to Edit Annotations</button> */}
        {/* <CustomButton name={'Insert Rate Law'} />
        <CustomButton name={'Annotated Variable Highlight Off'} /> */}
        <div className='menu-middle'>
          <div>
            <input id='biomodel-browse' type='text' placeholder='Search biomodels' />
            <ul id='dropdown' />
            <Loader loading={loading} />
          </div>
          <div className="dropdown" ref={dropdownRef}>
            <button onClick={handleButtonClick} className="dropbtn">
              Convert Antimony/SBML
            </button>
            <div id="myDropdown" className={`dropdown-content ${isDropdownVisible ? 'show' : ''}`}>
              <button className='convert-button' onClick={handleConversionAnt}>Antimony → SBML</button>
              <button className='convert-button' onClick={handleConversionSBML}>SBML → Antimony</button>
            </div>
          </div>
        </div>
        <button className='download-button' onClick={() => handleDownload(editorInstance, fileName)}>Save File to Downloads Folder</button>
      </div>
      <div className="code-editor" ref={editorRef}></div>
    </>
  );
};

export default AntimonyEditor;
