import React, { useState, useEffect} from "react";
import "./App.css";

import AntimonyEditor from "./components/antimony-editor/AntimonyEditor";
import FileExplorer from "./components/file-explorer/FileExplorer";
import HeaderMenu from "./components/header-menu/HeaderMenu";
import { SolidSplitter } from "./components/CustomSplitters";
import { SrcPosition } from "./language-handler/Types";
import handleDownload from "./features/HandleDownload";

import * as monaco from "monaco-editor";
import { openDB, IDBPDatabase, DBSchema } from "idb";
import { Split } from "@geoffcox/react-splitter";
import { DefaultFormPreferences, Recommendation } from "./components/recommend-annotation/RecommendAnnotationModal";
import { RecommendationTableProps, RecommendationTable } from "./components/recommend-annotation/RecommendTable";

/**
 * @description MyDB interface
 * @interface
 * @property {object[]} files - The files object
 * @property {string} files[].key - The key of the file
 * @property {object} files[].value - The value of the file
 * @property {string} files[].value.name - The name of the file
 * @property {string} files[].value.content - The content of the file
 * @property {object[]} settings - The settings object store
 * @property {string} files[].key - Key of the object store
 * @property {object} files[].value - Value of the object store
 * @property {string} files[].value.name - The name of the settings file (settings.json)
 * @property {string} files[].value.content - The content of the settings file
 */
export interface MyDB extends DBSchema {
  files: {
    key: string;
    value: { name: string; content: string };
  },

  settings: {
    key: string;
    value: { name: string; content: string };
  }
}

// Preference group types
export enum PreferenceTypes {
  ANNOTATOR = "annotatorPreferences",
  HIGHLIGHTCOLOR = "highlightColor"
}


// Default user preferences
const defaultPreferences: { [key: string]: any } = {
  "annotatorPreferences": DefaultFormPreferences,
  "highlightColor": "Red"
};

/**
 * @description App component
 * @returns - App component
 */
const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; content: string }[]>([]);
  const [selectedFileContent, setSelectedFileContent] = useState<string>(
    window.localStorage.getItem("current_file") || "// Enter Antimony Model Here"
  );
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    Number(window.localStorage.getItem("current_file_index") || null)
  );
  const [selectedFileName, setSelectedFileName] = useState<string>(
    window.localStorage.getItem("current_file_name") || "untitled.ant"
  );
  const [db, setDb] = useState<IDBPDatabase<MyDB> | null>();
  const [editorInstance, setEditorInstance] = useState<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  const [fileExplorerKey, setFileExplorerKey] = useState<number>(0);
  const [selectedEditorPosition, setSelectedEditorPosition] = useState<SrcPosition>(
    new SrcPosition(1, 1)
  );
  // keep track in App so that the option persists across different files.
  const [annotUnderlinedOn, setAnnotUnderlinedOn] = useState<boolean>(false);

  // Set highlight color for unannotated variables
  const [highlightColor, setHighlightColor] = useState<string>("red");
  // List of colors to set for highlight of unannotated variables
  const colors = [
    { name: "Red", color: "red" },
    { name: "Green", color: "green" },
    { name: "Yellow", color: "yellow" },
    { name: "Blue", color: "blue" },
    { name: "Aqua", color: "aqua" },
  ];

  // Preferences start empty and are later set on DB setup
  const [preferences, setPreferences] = useState<{ [key: string]: any }>({});

  const [recommendationTableParams, setRecommendationTableParams] = useState<RecommendationTableProps | null>(null);

  const [editorWindowSize, setEditorWindowSize] = useState<string>("100%");
  const [recommendationWindowSize, setRecommendationWindowSize] = useState<string>("0%");
  const [recommendationReady, setRecommendationReady] = useState<boolean>(false);
  const [forceEditorUpdate, setForceEditorUpdate] = useState<number>(0);

  /**
   * @description Use the openDB function to open the database
   */
  useEffect(() => {
    var req = openDB<MyDB>("antimony_editor_db");
    let newVersion;
    req.then((db) => {
      newVersion = db.version + 1;
      db.close();
      openDB<MyDB>("antimony_editor_db", newVersion, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("files")) {
            db.createObjectStore("files", { keyPath: "name" });
          }
          if (!db.objectStoreNames.contains("settings")) {
            db.createObjectStore("settings", { keyPath: "name" });
          }
        }
      }).then((database) => {
        setDb(database); // Store the database instance in the state
        database.getAll("files").then((files) => {
          setUploadedFiles(files);
        });
        // Get the settings file if it currently exists, else create settings file with
        // defaultPreferences loaded in
        database.get("settings", "settings.json").then((settings) => {
          if (settings) {
            setPreferences(JSON.parse(settings.content));
          } else {
            setPreferences(defaultPreferences);
            database.put("settings", { name: "settings.json", content: JSON.stringify(defaultPreferences) });
          }
        })
      })
    })
  }, []);

  /**
   * @description Updates preferences and saves in user storage
   * @param preferences - Full updated preferences file
   */
  const handlePreferenceUpdate = (preferences: { [key: string]: any }) => {
    setPreferences(preferences);
    if (db) {
      db.put("settings", { name: "settings.json", content: JSON.stringify(preferences) });
    }
  }

  /**
   * @description Handle the file upload
   * @param event - The event
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && db) {
      Array.from(files).forEach(async (file) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async () => {
          const fileData = { name: file.name, content: reader.result as string };
          await db.put("files", fileData);
          setUploadedFiles((prevFiles) => {
            const updatedFiles = [...prevFiles, fileData];
            // Sort the files alphabetically and numerically based on their names
            return updatedFiles.sort((a, b) =>
              a.name.localeCompare(b.name, undefined, { numeric: true })
            );
          });
          setFileExplorerKey((prevKey) => prevKey + 1); // Increment key to trigger re-render
        };
      });
    }
  };

  /**
   * call back for antimonyEditor to use
   * @param position
   */
  const handleSelectedPosition = async (position: SrcPosition) => {
    setSelectedEditorPosition(position);
  };

  /**
   * @description Handle the file click
   * @param fileContent - The content of the file
   * @param fileName - The name of the file
   * @param index - The index of the file
   */
  const handleFileClick = (fileContent: string, fileName: string, index: number) => {
    window.localStorage.setItem("current_file_index", index.toString());
    window.localStorage.setItem("current_file_name", fileName);
    window.localStorage.setItem("current_file", fileContent);
    setSelectedFileContent(fileContent);
    setSelectedFileName(fileName);
  };

  /**
   * @description Handles conversion from Antimony to SBML
   */
  const handleConversionAntimony = () => {
    try {
      if (db) {
        db.transaction("files").objectStore("files").get(selectedFileName).then((data) => {
          if (data) {
            if (window.convertAntimonyToSBML) {
              window.convertAntimonyToSBML(data.content).then((converted) => {
                handleNewFile(selectedFileName.replace("ant", "xml"), converted);
              })
            }
          }
        });
      } else {
        console.log("DB is null");
      }
    } catch (err) {
      console.error("Conversion error:", err);
    }
  };

  /**
   * @description Handles conversion from SBML to Antimony
   */
  const handleConversionSBML = () => {
    try {
      if (db) {
        db.transaction("files").objectStore("files").get(selectedFileName).then((data) => {
          if (data) {
            if (window.convertSBMLToAntimony) {
              window.convertSBMLToAntimony(data.content).then((converted) => {
                handleNewFile(selectedFileName.replace("xml", "ant"), converted);
              })
            }
          }
        });
      } else {
        console.log("DB is null");
      }
    } catch (err) {
      console.error("Conversion error:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (db) {
        // Filter out invalid names like empty string
        const files = (await db.getAll("files")).filter(f => f.name !== "");
        setUploadedFiles(files);

        // Update selectedFileIndex based on the current files
        const fileIndex = Number(window.localStorage.getItem("current_file_index"));
        if (fileIndex >= 0 && fileIndex < files.length) {
          setSelectedFileIndex(fileIndex);
          setSelectedFileContent(files[fileIndex].content);
          setSelectedFileName(files[fileIndex].name);
        } else {
          setSelectedFileIndex(null);
          setSelectedFileContent("// Enter Antimony Model Here");
          setSelectedFileContent("")
          setSelectedFileName("untitled.ant");
          window.localStorage.removeItem("current_file_index");
        }
      }
    };

    loadData();
  }, [db]);

  /**
   * @description Deletes the given file
   * @param fileName - The name of the file to delete
   * @param deleteFromFileExplorer - Represents whether to delete the file from the file explorer
   */
  const deleteFile = async (fileName: string, deleteFromFileExplorer: boolean) => {
    if (db) {
      await db.delete("files", fileName); // Delete from IndexedDB

      if (deleteFromFileExplorer) {
        const updatedFiles = uploadedFiles.filter((file) => file.name !== fileName);
        setUploadedFiles(updatedFiles);

        // NOTE: Currently, a file is selected before it is deleted.
        //       Therefore, fileName === selectedFileName always holds in this method (for now).

        if (selectedFileIndex === null || updatedFiles.length === 0) {
          // If last file was deleted, create a new blank file.
          handleNewFile("untitled.ant", "");
        } else if (selectedFileIndex === 0) {
          // If the selected file is deleted and was the first file, select the new first file.
          handleFileClick(updatedFiles[0].content, updatedFiles[0].name, 0);
        } else if (selectedFileIndex === updatedFiles.length) {
          // If the selected file is deleted and was the last file, select the file before it.
          const newIndex = selectedFileIndex - 1;
          handleFileClick(updatedFiles[newIndex].content, updatedFiles[newIndex].name, newIndex);
        } else {
          // If the selected file is deleted, select the file now in its place.
          handleFileClick(
            updatedFiles[selectedFileIndex].content,
            updatedFiles[selectedFileIndex].name,
            selectedFileIndex
          );
        }
      }
    }
  };

  /**
   * @description Download the selected file into Downloads folder.
   */
  const handleFileDownload = () => {
    handleDownload(editorInstance, selectedFileName);
  };

  /**
   * Finds a version of the provided name that is available.
   * 
   * @param name - the name to find an available version of
   * @returns - the name, but a version of it that's not taken
   * 
   * @example
   * Returns "untitled1.ant" if there is already a file named "untitled.ant"
   * ```
   * getAvailableFileName("untitled.ant")
   * ```
   */
  const getAvailableFileName = (name: string) => {
    if (!uploadedFiles.find(f => f.name === name)) {
      return name;
    } else {
      const [fileName, ...extensions] = name.split(".");
      const extension = extensions.join(".");

      let i = 1;
      let newName: string;
      do {
        newName = `${fileName}${i}.${extension}`;
        i += 1;
      } while (uploadedFiles.find(f => f.name === newName));

      return newName;
    }
  };

  /**
   * @description Open a new file.
   * @param newFileName - The name of the new file
   */
  const handleNewFile = async (newFileName: string, fileContent: string) => {
    newFileName = getAvailableFileName(newFileName);

    const newFileContent = (fileContent === "" ? "// Enter Antimony Model Here" : fileContent);
    const file = new File([newFileContent], newFileName, { type: "text/plain" });
    const dataTransfer = new DataTransfer();

    dataTransfer.items.add(file);

    if (db) {
      let fileobj = { name: newFileName, content: newFileContent };

      // Add file to database
      await db.put("files", fileobj);

      // Update uploaded files state
      setUploadedFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, fileobj];
        // Sort the files alphabetically and numerically based on their names
        return updatedFiles.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true })
        );
      });
      const newFileIndex = uploadedFiles.findIndex(
        (file: { name: string; content: string }) => file.name === newFileName
      );
      handleFileClick(newFileContent, newFileName, newFileIndex);
    } else {
      console.log("Database is null! File was not added");
    }
  };

  const handleRecommendationTableOpen = () => {
    setEditorWindowSize("0%");
    setRecommendationWindowSize("40%");
  }

  const handleRecommendationTableClose = (): void => {
    setEditorWindowSize("100%");
    setRecommendationWindowSize("0%");
    setForceEditorUpdate(forceEditorUpdate + 1);
  }

  const promptRecommendationTable = (params: RecommendationTableProps|null) => {
    if (params == null) {
      setRecommendationTableParams(null)
      handleRecommendationTableClose();
    } else {
      setRecommendationTableParams(params);
      handleRecommendationTableOpen();
    }
  }

  // useEffect(() => {
  //   if (recTableParamsPre) {
  //     let props = recTableParamsPre;
  //     props.onClose = handleRecommendationTableClose;
  //     setRecTableParamsPost(props)
  //     handleRecommendationTableOpen();
  //   }
  // }, [recTableParamsPre])

  useEffect(() => {
    if (recommendationTableParams !== null && selectedFileName !== recommendationTableParams.fileName) {
      promptRecommendationTable(null);
    }
  }, [selectedFileName])

  return (
    <div className="app">
      <HeaderMenu
        db={db}
        fileName={selectedFileName}
        fileContent={selectedFileContent}
        setFileContent={setSelectedFileContent}
        setUploadedFiles={setUploadedFiles}
        handleConversionAntimony={handleConversionAntimony}
        handleConversionSBML={handleConversionSBML}
        handleFileDownload={handleFileDownload}
        handleFileUpload={handleFileUpload}
        handleNewFile={handleNewFile}
        highlightColor={highlightColor}
        setHighlightColor={setHighlightColor}
        colors={colors}
        preferences={preferences}
        handlePreferenceUpdate={handlePreferenceUpdate}
        promptRecommendationTable={promptRecommendationTable}
      />
      <div className="middle">
        <Split
          renderSplitter={() => <SolidSplitter />}
          initialPrimarySize="14%"
          minPrimarySize="14%"
          minSecondarySize="20%"
          splitterSize="4px"
        >
          <section className="sidebar">
            <div className="fileExplorerContainer">
              <div className="fileExplorerTitle">File Explorer</div>
            </div>
            {db ? (
              <FileExplorer
                key={fileExplorerKey}
                database={db}
                files={uploadedFiles}
                setFiles={setUploadedFiles}
                onFileClick={handleFileClick}
                onDeleteFile={deleteFile}
                handleNewFile={handleNewFile}
                selectedFileIndex={selectedFileIndex}
                setSelectedFileIndex={setSelectedFileIndex}
                selectedFileName={selectedFileName}
                setSelectedFileName={setSelectedFileName}
              />
            ) : (
              // You can provide a loading message or handle the absence of the database as needed
              <div>Loading...</div>
            )}
          </section>
          <Split
            renderSplitter={() => <SolidSplitter />}
            initialPrimarySize="80%"
            minPrimarySize={editorWindowSize}
            minSecondarySize={recommendationWindowSize}
            splitterSize="4px"
          >
            <section className="editor">
              {db ? ( // Conditionally render the AntimonyEditor component when db is defined
                <AntimonyEditor
                  key={selectedFileName}
                  fileName={selectedFileName}
                  database={db}
                  annotUnderlinedOn={annotUnderlinedOn}
                  setAnnotUnderlinedOn={setAnnotUnderlinedOn}
                  editorInstance={editorInstance}
                  setEditorInstance={setEditorInstance}
                  selectedFilePosition={selectedEditorPosition}
                  handleSelectedPosition={handleSelectedPosition}
                  highlightColor={highlightColor}
                  setHighlightColor={setHighlightColor}
                  handleNewFile={handleNewFile}
                  forceUpdateCount={forceEditorUpdate}
                />
              ) : (
                // You can provide a loading message or handle the absence of the database as needed
                <div>Loading...</div>
              )}
            </section>
            {recommendationTableParams && <section className="recommendationTable">
              <RecommendationTable
                {...recommendationTableParams}
              />
            </section>}
          </Split>
        </Split>
      </div>
      <footer>
        <div className="footer-content">
          <a target="_blank" rel="noopener noreferrer" href="https://reproduciblebiomodels.org/">
            Copyright © 2024 Center for Reproducible Biomedical Modeling
          </a>
          <div className="selected-editor-position">
            Ln {selectedEditorPosition.line}, Col {selectedEditorPosition.column}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
