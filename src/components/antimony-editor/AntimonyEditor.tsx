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
import { IDBPDatabase, DBSchema } from "idb";
import { SrcPosition, SrcRange } from "../../language-handler/Types";

/**
 * @description AntimonyEditorProps interface
 * @interface
 * @property {string} content - The content of the editor
 * @property {string} fileName - The name of the file
 * @property {object} editorInstance - The current editor instance
 * @property {function} setEditorInstance - The function to set the current editor instance
 * @property {object} selectedFilePosition -
 * @property {function} handleSelectedPosition -
 * @property {function} handleConversionSBML - Handle the SBML to Antimony file conversion
 */
interface AntimonyEditorProps {
  content: string;
  fileName: string;
  editorInstance: monaco.editor.IStandaloneCodeEditor | null;
  setEditorInstance: React.Dispatch<
    React.SetStateAction<monaco.editor.IStandaloneCodeEditor | null>
  >;
  selectedFilePosition: SrcPosition;
  handleSelectedPosition: (position: SrcPosition) => void;
  handleConversionSBML: () => void;
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
    modelId: string; // Define the modelId variable
    url: string; // Define the link variable
    biomodelsUrl: string; // Define the biomodels link variable
    biomodelsOptionSet: boolean; // Define the biomodelsOptionSet variable
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
 * @example - <AntimonyEditor content={content} fileName={fileName} database={database} />
 * @returns - AntimonyEditor component
 */
const AntimonyEditor: React.FC<AntimonyEditorProps & { database: IDBPDatabase<MyDB> }> = ({
  content,
  fileName,
  database,
  editorInstance,
  setEditorInstance,
  selectedFilePosition,
  handleSelectedPosition,
  handleConversionSBML,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [chosenModel, setChosenModel] = useState<string | null>(null);
  // const [originalContent, setOriginalContent] = useState<string>(content); // Track the original content
  const [newContent, setNewContent] = useState<string>(content); // Track the new content
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [annotHighlightedOn, setAnnotHighlightedOn] = useState<boolean>(false);
  const [annotationAddPosition, setAnnotationAddPosition] = useState<SrcPosition | null>(null);
  const [varToAnnotate, setVarToAnnotate] = useState<string | null>(null);

  /**
   * sets up the antimony editor,
   * including language, color theme, retrieving selected file content, etc.
   * @returns
   */
  const editorSetup = () => {
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
      return editor;
    }
    return null;
  };

  /**
   * @description adds the menu option to create an annotation
   * @param editor
   */
  const addAnnotationOption = (editor: any) => {
    if (editorRef.current) {
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
              let ST = ModelSemanticsChecker(ed, annotHighlightedOn, false);
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
    }
  };

  /**
   * @description handles adding the menu option to highlight unannotated variables
   * @param editor
   */
  const addAnnotationVarHighlightOption = (editor: any) => {
    if (editorRef.current) {
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
    }
  };

  /**
   * @description handles adding the menu option to navigate to the first
   * annotation (by line number) for a selected variable
   * @param editor
   */
  const addNavigateEditAnnotationOption = (editor: any) => {
    if (editorRef.current) {
      editor.addAction({
        // An unique identifier of the contributed action.
        id: "Navigate to Edit Annotation",

        // A label of the action that will be presented to the user.
        label: `Navigate to Edit Annotation`,

        // keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10],

        // A precondition for this action.
        precondition: null,

        // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
        keybindingContext: null,

        contextMenuGroupId: "navigation",

        contextMenuOrder: 1.5,

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
              // this feels scuffed, could probably store the ST somewhere to reduce calls to ModelSemanticsChecker
              // in the future.
              let ST = ModelSemanticsChecker(ed, annotHighlightedOn, false);
              let info = ST.hasVarAtLocation(word.word, srcRange);
              if (info && info.varInfo.annotations.length > 0) {
                let line = Number.MAX_VALUE;
                for (const value of info.varInfo.annotationLineNum.values()) {
                  line = Math.min(value.start.line, line);
                }

                const range = {
                  startLineNumber: line,
                  startColumn: 1,
                  endLineNumber: line,
                  endColumn: editor.getModel().getLineMaxColumn(line),
                };

                ed.setSelection(range);
                ed.revealLineInCenter(line);
              } else {
                alert("Please select an annotated variable");
              }
            } else {
              alert("Please select an annotated variable");
            }
          }
        },
      });
    }
  };

  /**
   * @description Loads the editor and sets the language, theme, and content
   */
  useEffect(() => {
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
      addAnnotationOption(editor);

      // Adds the "Highlight Unannotated Variables" option to the context menu.
      // Checks if the cursor is on an actual variable or not.
      addAnnotationVarHighlightOption(editor);

      // Adds the "Navigate to Edit Annotation" option to the context menu
      // checks if the cursor is on an actual variable or not.
      addNavigateEditAnnotationOption(editor);

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

      handleEditorContentChagne(editor);
      handleCursorPositionChange(editor);
      getBiomodels(setLoading, setChosenModel);
      setEditorInstance(editor);
      setSelectedFile(fileName);
      return () => editor.dispose();
    }
  }, [annotHighlightedOn, content, database, fileName]);

  /**
   * @description reruns semantic checker in case something related to
   * the editor changes, or the annotation highlight feature is selected.
   */
  useEffect(() => {
    if (editorInstance) {
      ModelSemanticsChecker(editorInstance, annotHighlightedOn, false);
    }
  }, [annotHighlightedOn, editorInstance]);

  /**
   * @description Adds the link action to the editor context menu
   */
  useEffect(() => {
    if (editorInstance) {
      let biomodelsUrl = editorInstance.getValue().split('BioModels: ')[1];
      if (biomodelsUrl && biomodelsUrl.startsWith('http')) {
        window.biomodelsUrl = biomodelsUrl.substring(0, biomodelsUrl.indexOf('\n'));
      } else {
        biomodelsUrl = editorInstance.getValue().split('model_entity_is ')[1];
        if (biomodelsUrl) {
          window.biomodelsUrl = biomodelsUrl.substring(1, biomodelsUrl.indexOf('"', 2));
        } else {
          window.biomodelsUrl = '';
        }
      }

      if (!window.biomodelsOptionSet) {
        window.biomodelsOptionSet = true;
        monaco.editor.addEditorAction({
          id: 'link',
          label: 'Open in Biomodels',
          contextMenuGroupId: 'navigation',
          run: _ => {
            if (window.biomodelsUrl) {
              window.open(window.biomodelsUrl, '_blank');
            } else {
              alert('No BioModels link found in the model.');
            }
          }
        });
      }
    }
  }, [editorInstance]);

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
        window.modelId = model.modelId;
        window.biomodelsUrl = "https://www.ebi.ac.uk/biomodels/" + window.modelId;
        window.title = model.title;
        window.authors = model.authors;
        window.url = model.url;
        window.citation = model.citation;
        window.date = model.date;
        window.journal = model.journal;
        window.fileName = model.modelId;
        window.sbmlString = model.sbmlData;
        window.conversion = "biomodels";
        handleConversionSBML();
        setLoading(false);
      });
    }
  }, [chosenModel]);

  /**
   * when the cursor position changes in the editor
   * we use the callback function `handleSelectedPosition`
   * to update state.
   * @param editor
   */
  const handleCursorPositionChange = (editor: any) => {
    editor.onDidChangeCursorPosition(() => {
      let position: monaco.Position = editor.getPosition();
      if (position) {
        handleSelectedPosition(new SrcPosition(position.lineNumber, position.column));
      }
    });
  };

  const handleEditorContentChagne = (editor: any) => {
    // Delay the model parser to avoid parsing while the user is typing
    let typingTimer: any;
    const delayedModelParser = (editor: monaco.editor.IStandaloneCodeEditor) => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        ModelSemanticsChecker(editor, annotHighlightedOn, true);
      }, 600);
    };

    // Parse the model whenever the user types
    editor.onDidChangeModelContent(() => {
      setNewContent(editor.getValue());
      delayedModelParser(editor);
    });
  };

  return (
    <>
      <div className="search-container">
        {/* <button className='button' onClick={save}> Save Changes </button> */}
        {/* <CustomButton name={'Insert Rate Law'} /> */}
        <Loader loading={loading} />
        <div>
          <input id="biomodel-browse" type="text" placeholder="Search biomodels" />
          <div id="biomddropdown">
            <ul />
          </div>
        </div>
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
