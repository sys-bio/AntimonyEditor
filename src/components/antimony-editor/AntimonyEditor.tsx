import React, { useRef, useEffect, useState } from "react";
import * as monaco from "monaco-editor";
import { antimonyLanguage } from "../../language-handler/antlr/AntimonyLanguage";
import { antimonyTheme } from "../../language-handler/AntimonyTheme";
import "./AntimonyEditor.css";
import { getBiomodels, getModel } from "../../features/BrowseBiomodels";
import Loader from "../Loader";
import CreateAnnotationModal from "../create-annotation/CreateAnnotationModal";
import ModelSemanticsChecker from "../../language-handler/ModelSemanticChecker";
import { IDBPDatabase, DBSchema } from "idb";
import { SrcPosition, SrcRange } from "../../language-handler/Types";

interface AntimonyEditorProps {
  content: string;
  fileName: string;
  annotUnderlinedOn: boolean;
  setAnnotUnderlinedOn: (value: React.SetStateAction<boolean>) => void;
  editorInstance: monaco.editor.IStandaloneCodeEditor | null;
  setEditorInstance: React.Dispatch<React.SetStateAction<monaco.editor.IStandaloneCodeEditor | null>>;
  selectedFilePosition: SrcPosition;
  handleSelectedPosition: (position: SrcPosition) => void;
  handleConversionSBML: () => void;
  setHighlightColor: (color: string) => void
  highlightColor: string;
}

interface MyDB extends DBSchema {
  files: {
    key: string;
    value: { name: string; content: string };
  };
}

declare global {
  interface Window {
    antimonyString: string;
    sbmlString: string;
    sbmlResult: string;
    antimonyResult: string;
    antimonyActive: boolean;
    fileName: string;
    modelId: string;
    url: string;
    biomodelsUrl: string;
    biomodelsOptionSet: boolean;
    title: string;
    authors: string[];
    citation: string | null;
    date: string;
    journal: string;
    conversion: string;
    processAntimony?: () => void;
    processSBML?: () => void;
    selectedFile: string;
  }
}

const AntimonyEditor: React.FC<AntimonyEditorProps & { database: IDBPDatabase<MyDB> }> =
    ({
      content,
      fileName,
      database,
      annotUnderlinedOn,
      setAnnotUnderlinedOn,
      editorInstance,
      setEditorInstance,
      selectedFilePosition,
      handleSelectedPosition,
      handleConversionSBML,
      highlightColor,
      setHighlightColor
    }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [chosenModel, setChosenModel] = useState<string | null>(null);
  const [newContent, setNewContent] = useState<string>(content);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [annotationAddPosition, setAnnotationAddPosition] = useState<SrcPosition | null>(null);
  const [varToAnnotate, setVarToAnnotate] = useState<{ id: string; name: string | undefined } | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);

  const addAnnotationOption = (editor: any) => {
    if (editorRef.current) {
      editor.addAction({
        id: "create-annotation",
        label: "Create Annotations",
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10,
          monaco.KeyMod.chord(
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM
          ),
        ],
        precondition: null,
        keybindingContext: null,
        contextMenuGroupId: "navigation",
        contextMenuOrder: 1,
        run: function (ed: monaco.editor.IStandaloneCodeEditor) {
          const position = ed.getPosition();
          if (position) {
            const word = ed.getModel()?.getWordAtPosition(position);
            if (word) {
              let start: SrcPosition = new SrcPosition(position.lineNumber, word.startColumn);
              let end: SrcPosition = new SrcPosition(position.lineNumber, word.endColumn);
              let srcRange: SrcRange = new SrcRange(start, end);
              let { symbolTable: ST } = ModelSemanticsChecker(ed, annotUnderlinedOn, false, highlightColor, decorations);
              let varAndAnnotationPositionInfo = ST.hasVarAtLocation(word.word, srcRange);
              if (varAndAnnotationPositionInfo) {
                setModalVisible(true);
                setAnnotationAddPosition(varAndAnnotationPositionInfo.annotationPositon);
                let displayName = varAndAnnotationPositionInfo.varInfo.displayName?.replaceAll("\"", "");
                setVarToAnnotate({ id: word.word, name: displayName });
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

  const addAnnotationVarUnderlineOption = (editor: any) => {
    if (editorRef.current) {
      editor.addAction({
        id: "underline-annotation",
        label: `Highlight Unannotated Variables ${annotUnderlinedOn ? "Off" : "On"}`,
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10],
        precondition: null,
        keybindingContext: null,
        contextMenuGroupId: "navigation",
        contextMenuOrder: 1.5,
        run: function (editor: monaco.editor.IStandaloneCodeEditor) {
          setAnnotUnderlinedOn((prevAnnotUnderlinedOn) => !prevAnnotUnderlinedOn);
        },
      });
    }
  };

  const addNavigateEditAnnotationOption = (editor: any) => {
    if (editorRef.current) {
      editor.addAction({
        id: "Navigate to Edit Annotation",
        label: `Navigate to Edit Annotation`,
        precondition: null,
        keybindingContext: null,
        contextMenuGroupId: "navigation",
        contextMenuOrder: 1.5,
        run: function (ed: monaco.editor.IStandaloneCodeEditor) {
          const position = ed.getPosition();
          if (position) {
            const word = ed.getModel()?.getWordAtPosition(position);
            if (word) {
              let start: SrcPosition = new SrcPosition(position.lineNumber, word.startColumn);
              let end: SrcPosition = new SrcPosition(position.lineNumber, word.endColumn);
              let srcRange: SrcRange = new SrcRange(start, end);
              let { symbolTable: ST } = ModelSemanticsChecker(ed, annotUnderlinedOn, false, highlightColor, decorations);
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

  useEffect(() => {
    if (editorRef.current) {
      let editor: any;
      monaco.languages.register({ id: "antimony" });
      monaco.languages.setMonarchTokensProvider("antimony", antimonyLanguage);
      monaco.editor.defineTheme("antimonyTheme", antimonyTheme);
      monaco.editor.setTheme("antimonyTheme");
      database.transaction("files").objectStore("files").get(fileName).then((data) => {
        if (data) {
          setNewContent(data.content);
          window.selectedFile = data.name;
          editor.setValue(data.content);
        }
      });

      if (fileName.includes(".xml")) {
        editor = monaco.editor.create(editorRef.current, {
          bracketPairColorization: { enabled: true },
          value: content,
          language: "xml",
          automaticLayout: true,
        });
        window.sbmlString = editor.getValue();
      } else {
        editor = monaco.editor.create(editorRef.current, {
          bracketPairColorization: { enabled: true },
          value: content,
          language: "antimony",
          automaticLayout: true,
        });
        window.antimonyActive = true;
        window.antimonyString = editor.getValue();
      }

      addAnnotationOption(editor);
      addAnnotationVarUnderlineOption(editor);
      addNavigateEditAnnotationOption(editor);

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

      handleEditorContentChange(editor);
      handleCursorPositionChange(editor);
      getBiomodels(setLoading, setChosenModel);
      setEditorInstance(editor);
      setSelectedFile(fileName);
      return () => editor.dispose();
    }
  }, [annotUnderlinedOn, content, database, fileName]);

  useEffect(() => {
    if (editorInstance) {
      const { symbolTable, decorations: newDecorations } = ModelSemanticsChecker(
          editorInstance,
          annotUnderlinedOn,
          false,
          highlightColor,
          decorations
      );
      setDecorations(newDecorations);
    }
  }, [highlightColor]);

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

  const handleCursorPositionChange = (editor: any) => {
    editor.onDidChangeCursorPosition(() => {
      let position: monaco.Position = editor.getPosition();
      if (position) {
        handleSelectedPosition(new SrcPosition(position.lineNumber, position.column));
      }
    });
  };

  const handleEditorContentChange = (editor: any) => {
    // Delay the model parser to avoid parsing while the user is typing
    let typingTimer: any;
    const delayedModelParser = (editor: monaco.editor.IStandaloneCodeEditor) => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        ModelSemanticsChecker(editor, annotUnderlinedOn, true, highlightColor, decorations);
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
