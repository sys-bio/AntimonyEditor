import React, { useRef, useEffect, useState } from "react";
import * as monaco from "monaco-editor";
import { antimonyLanguage } from "../../language-handler/antlr/AntimonyLanguage";
import { antimonyTheme } from "../../language-handler/AntimonyTheme";
// import CustomButton from '../CustomButton';
import "./AntimonyEditor.css";
import { getBiomodels, getModel } from "../../features/BrowseBiomodels";
import Loader from "../Loader";
import CreateAnnotationModal from "../create-annotation/CreateAnnotationModal";
import ModelSemanticsChecker from "../../language-handler/ModelSemanticChecker";
import handleDownload from "../../features/HandleDownload";
import { IDBPDatabase, DBSchema } from "idb";
import { SrcPosition, SrcRange } from "../../language-handler/Types";

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
    title: string; // Define the title variable
    authors: string[]; // Define the authors variable
    citation: string | null; // Define the citation variable
    date: string; // Define the date variable
    journal: string; // Define the journal variable
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
const AntimonyEditor: React.FC<AntimonyEditorProps & { database: IDBPDatabase<MyDB> }> = ({
  content,
  fileName,
  database,
  handleFileUpload,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [chosenModel, setChosenModel] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] = useState<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  // const [originalContent, setOriginalContent] = useState<string>(content); // Track the original content
  const [newContent, setNewContent] = useState<string>(content); // Track the new content
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [annotHighlightedOn, setAnnotHighlightedOn] = useState<boolean>(false);
  const [annotationAddPosition, setAnnotationAddPosition] = useState<SrcPosition | null>(null);
  const [varToAnnotate, setVarToAnnotate] = useState<string | null>(null);

  /**
   * @description Loads the editor and sets the language, theme, and content
   */
  useEffect(() => {
    console.log(database)
    if (editorRef.current) {
      let editor: any;
      // Load the custom language
      monaco.languages.register({ id: "antimony" });
      monaco.languages.setMonarchTokensProvider("antimony", antimonyLanguage);

      // Load the custom theme
      monaco.editor.defineTheme("antimonyTheme", antimonyTheme);
      monaco.editor.setTheme("antimonyTheme");
      // Retrieve content and file name from IndexedDB
      database
        .transaction("files")
        .objectStore("files")
        .get(fileName)
        .then((data) => {
          if (data) {
            setNewContent(data.content);
            window.selectedFile = data.name;
            editor.setValue(data.content);
          }
        });

      if (fileName.includes(".xml")) {
        // Create the editor
        editor = monaco.editor.create(editorRef.current, {
          bracketPairColorization: { enabled: true }, // Enable bracket pair colorization
          value: content,
          language: "xml",
          automaticLayout: true,
        });
        
        // Set the antimonyString variable to the editor content
        window.sbmlString = editor.getValue();
      } else {
        editor = monaco.editor.create(editorRef.current, {
          bracketPairColorization: { enabled: true }, // Enable bracket pair colorization
          value: content,
          language: "antimony",
          automaticLayout: true,
        });
        window.antimonyActive = true;

        // Set the antimonyString variable to the editor content
        window.antimonyString = editor.getValue();
      }

      // Adds the create annotations option to the context menu
      // Checks if the cursor is on an actual variable or not
      editor.addAction({
        // An unique identifier of the contributed action.
        id: "create-annotation",

        // A label of the action that will be presented to the user.
        label: "Create Annotations",

        // An optional array of keybindings for the action.
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10,
          // chord
          monaco.KeyMod.chord(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM
          ),
        ],

        // A precondition for this action.
        precondition: null,

        // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
        keybindingContext: null,

        contextMenuGroupId: "navigation",

        contextMenuOrder: 1,

        // Method that will be executed when the action is triggered.
        // @param editor The editor instance is passed in as a convenience
        run: function (ed: monaco.editor.IStandaloneCodeEditor) {
          const position = ed.getPosition();
          if (position) {
            const word = ed.getModel()?.getWordAtPosition(position);

            if (word) {
              // Check if variable with id word.word exists at the given position range.
              // If it does, use the stored variable info to create a hover.
              let start: SrcPosition = new SrcPosition(position.lineNumber, word.startColumn);
              let end: SrcPosition = new SrcPosition(position.lineNumber, word.endColumn);
              let srcRange: SrcRange = new SrcRange(start, end);

              // Check that user cursor is over an actual variable.
              let ST = ModelSemanticsChecker(ed, false, false);
              let varAndAnnotationPositionInfo = ST.hasVarAtLocation(word.word, srcRange);
              if (varAndAnnotationPositionInfo) {
                setModalVisible(true);
                setAnnotationAddPosition(varAndAnnotationPositionInfo.annotationPositon);
                setVarToAnnotate(word.word);
              } else {
                alert("Please select a variable to annotate.");
              }
            } else {
              alert("Please select a variable to annotate.");
            }
          }
        },
      });

      // Adds the "Highlight Unannotated Variables" option to the context menu.
      // Checks if the cursor is on an actual variable or not.
      editor.addAction({
        // An unique identifier of the contributed action.
        id: "highlight-annotation",

        // A label of the action that will be presented to the user.
        label: `Highlight Unannotated Variables ${annotHighlightedOn ? "Off" : "On"}`,

        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10],

        // A precondition for this action.
        precondition: null,

        // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
        keybindingContext: null,

        contextMenuGroupId: "navigation",

        contextMenuOrder: 1.5,

        run: function (editor: monaco.editor.IStandaloneCodeEditor) {
          setAnnotHighlightedOn((prevAnnotHighlightedOn) => !prevAnnotHighlightedOn);
        },
      });

      // Set language configuration for bracket pair colorization
      monaco.languages.setLanguageConfiguration("antimony", {
        comments: {
          lineComment: "//",
        },
        brackets: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ],
      });

      // setOriginalContent(editor.getValue());

      // Delay the model parser to avoid parsing while the user is typing
      let typingTimer: any;
      const delayedModelParser = (editor: monaco.editor.IStandaloneCodeEditor) => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          // ModelParser(editor, true);
          ModelSemanticsChecker(editor, annotHighlightedOn, true);
        }, 600);
      };

      // Parse the model whenever the user types
      editor.onDidChangeModelContent(() => {
        setNewContent(editor.getValue());
        delayedModelParser(editor);
      });

      // editor.onDidChangeCursorPosition(() => {
      //   console.log(editor.getPosition());
      // })

      getBiomodels(setLoading, setChosenModel);

      setEditorInstance(editor);

      setSelectedFile(fileName);

      return () => editor.dispose();
    }
  }, [annotHighlightedOn, content, database, fileName]);

  useEffect(() => {
    if (editorInstance) {
      ModelSemanticsChecker(editorInstance, annotHighlightedOn, false);
    }
  }, [annotHighlightedOn, editorInstance]);

  /**
   * @description Saves the name and content of the file selected to IndexedDB
   */
  useEffect(() => {
    if (database && editorInstance) {
      setNewContent(editorInstance.getValue());
      const transaction = database.transaction("files", "readwrite");
      transaction.objectStore("files").put({
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
      const dropdown = document.getElementById("biomddropdown");
      dropdown!.style.display = "none";
      setLoading(true);
      if (chosenModel === "") {
        setLoading(false);
        return;
      }
      getModel(chosenModel).then((model) => {
        window.title = model.title;
        window.authors = model.authors;
        window.url = model.url;
        window.citation = model.citation;
        window.date = model.date;
        window.journal = model.journal;
        window.fileName = model.modelId;
        window.sbmlString = model.sbmlData;
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
        console.error("processAntimony function not found in the global scope.");
      }
    } catch (err) {
      console.log("Conversion error:", err);
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
        console.error("processSBML function not found in the global scope.");
      }
    } catch (err) {
      console.log("Conversion error:", err);
    }
  };

  const handleButtonClick = () => {
    if (dropdownRef.current) {
      setDropdownVisible(!isDropdownVisible);
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownVisible(false);
    }
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="menu">
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileUpload}
          accept=".ant,.xml,.txt"
        />
        <label htmlFor="file-upload" className="file-upload-label">
          Load File(s)
        </label>
        {/* <button className='button' onClick={save}> Save Changes </button> */}
        {/* <button className='btn'>Navigate to Edit Annotations</button> */}
        {/* <CustomButton name={'Insert Rate Law'} />
        <CustomButton name={'Annotated Variable Highlight Off'} /> */}
        <div className="menu-middle">
          <Loader loading={loading} />
          <div>
            <input id="biomodel-browse" type="text" placeholder="Search biomodels" />
            <div id="biomddropdown">
              <ul />
            </div>
          </div>
          <div className="dropdown" ref={dropdownRef}>
            <button onClick={handleButtonClick} className="dropbtn">
              Antimony ↔ SBML
            </button>
            <div id="myDropdown" className={`dropdown-content ${isDropdownVisible ? "show" : ""}`}>
              <button className="convert-button" onClick={handleConversionAnt}>
                Antimony → SBML
              </button>
              <button className="convert-button" onClick={handleConversionSBML}>
                SBML → Antimony
              </button>
            </div>
          </div>
        </div>
        <button
          className="download-button"
          onClick={() => handleDownload(editorInstance, fileName)}
        >
          Save File to Downloads Folder
        </button>
      </div>
      <div className="code-editor" ref={editorRef}></div>
      {isModalVisible && (
        <div ref={modalRef}>
          <CreateAnnotationModal
            onClose={() => setModalVisible(false)}
            annotationAddPosition={annotationAddPosition}
            editorInstance={editorInstance}
            varToAnnotate={varToAnnotate}
          />
        </div>
      )}
    </>
  );
};

export default AntimonyEditor;
