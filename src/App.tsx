import React, { useState, useEffect } from "react";
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

/**
 * @description MyDB interface
 * @interface
 * @property {object[]} files - The files object
 * @property {string} files[].key - The key of the file
 * @property {object} files[].value - The value of the file
 * @property {string} files[].value.name - The name of the file
 * @property {string} files[].value.content - The content of the file
 */
export interface MyDB extends DBSchema {
  files: {
    key: string;
    value: { name: string; content: string };
  };
}

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
  const [sbmlResultListenerAdded, setSbmlResultListenerAdded] = useState<boolean>(false);
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

  /**
   * @description Use the openDB function to open the database
   */
  useEffect(() => {
    openDB<MyDB>("antimony_editor_db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files", { keyPath: "name" });
        }
      },
    }).then((database) => {
      setDb(database); // Store the database instance in the state
      database.getAll("files").then((files) => {
        setUploadedFiles(files);
      });
    });
    window.addEventListener("grabbedSBMLResult", sbmlResultHandler);
    window.addEventListener("grabbedAntimonyResult", antimonyResultHandler);

    // Cleanup: Remove the event listeners when the component is unmounted
    return () => {
      window.removeEventListener("grabbedSBMLResult", sbmlResultHandler);
      window.removeEventListener("grabbedAntimonyResult", antimonyResultHandler);
    };
  }, []);

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
    setSelectedFileContent(fileContent);
    setSelectedFileName(fileName);
    window.localStorage.setItem("current_file_index", index.toString());
    window.localStorage.setItem("current_file_name", fileName);
    window.localStorage.setItem("current_file", fileContent);
  };

  /**
   * @description Handles conversion from Antimony to SBML
   */
  const handleConversionAntimony = () => {
    try {
      if (window.processAntimony) {
        window.processAntimony();
      } else {
        console.error("processAntimony function not found in the global scope.");
      }
    } catch (err) {
      console.error("Conversion error:", err);
    }
  };

  function sbmlResultHandler() {
    let sbml = window.sbmlResult;
    if (window.selectedFile !== "" && window.selectedFile.includes(".ant")) {
      handleAntToSBML(sbml, window.selectedFile.replace("ant", "xml"))
        .then(() => {
          window.antimonyActive = false;
          window.sbmlString = "";
        })
        .catch((error) => {
          console.error("Error in handleFileConversion:", error);
        });
    }
  }

  const handleAntToSBML = async (fileContent: string, fileName: string) => {
    window.selectedFile = fileName;

    setUploadedFiles((prevFiles) => {
      window.removeEventListener("grabbedSBMLResult", sbmlResultHandler);
      setSbmlResultListenerAdded(false);
      let updatedFiles = [...prevFiles];
      // const existingFileIndex = prevFiles.findIndex(file => file.name === window.selectedFile);

      // if (existingFileIndex !== -1) {
      // } else {
      // If the file doesn't exist, add it to the array
      updatedFiles = [...prevFiles, { name: window.selectedFile, content: fileContent }];

      // Store the selected file's information in IndexedDB
      // NOTE: db is always undefined here for some reason.
      if (db) {
        db.put("files", { name: window.selectedFile, content: fileContent });
      }

      window.addEventListener("grabbedSBMLResult", sbmlResultHandler, { once: true });

      // Sort the files alphabetically and numerically based on their names
      updatedFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      // Select the converted file
      const convertedIndex = updatedFiles.findIndex((file) => file.name === fileName);
      handleFileClick(fileContent, fileName, convertedIndex);

      return updatedFiles;
    });
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
      console.error("Conversion error:", err);
    }
  };

  function antimonyResultHandler() {
    let antimony = window.antimonyResult;
    if (window.selectedFile !== "" && window.selectedFile.includes(".xml")) {
      window.conversion = "standard";
      handleSBMLtoAntConversion(antimony, window.selectedFile.replace("xml", "ant"))
        .then(() => {
          window.antimonyActive = true;
          window.antimonyString = "";
        })
        .catch((error) => {
          console.error("Error in handleFileConversion:", error);
        });
    } else {
      window.conversion = "";
      handleSBMLtoAntConversion(antimony, window.fileName + ".ant")
        .then(() => {
          window.antimonyActive = true;
          window.antimonyString = "";
        })
        .catch((error) => {
          console.error("Error in handleFileConversion:", error);
        });
    }
  }

  const handleSBMLtoAntConversion = async (fileContent: string, fileName: string) => {
    window.selectedFile = fileName;

    setUploadedFiles((prevFiles) => {
      window.removeEventListener("grabbedAntimonyResult", antimonyResultHandler);
      setSbmlResultListenerAdded(false);
      let updatedFiles = [...prevFiles];
      // const existingFileIndex = prevFiles.findIndex(file => file.name === window.selectedFile);

      // if (existingFileIndex !== -1) {
      //   // alert('File already exists');
      // } else {
      // If the file doesn't exist, add it to the array
      updatedFiles = [...prevFiles, { name: window.selectedFile, content: fileContent }];

      // Store the selected file's information in IndexedDB
      // NOTE: db is always undefined here for some reason.
      if (db) {
        db.put("files", { name: window.selectedFile, content: fileContent });
      }

      window.addEventListener("grabbedAntimonyResult", antimonyResultHandler, { once: true });

      // Sort the files alphabetically and numerically based on their names
      updatedFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      // Select the converted file
      const convertedIndex = updatedFiles.findIndex((file) => file.name === fileName);
      handleFileClick(fileContent, fileName, convertedIndex);

      return updatedFiles;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      const database = await openDB<MyDB>("antimony_editor_db", 1);
      setDb(database);
      const files = await database.getAll("files");
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
    };

    loadData();
  }, []);

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

        if (selectedFileIndex === null || updatedFiles.length === 1) {
          // If last file was deleted, create a new blank file.
          handleNewFile("untitled.ant");
        } else if (selectedFileIndex === 1) {
          // If the selected file is deleted and was the first file, select the new first file.
          handleFileClick(updatedFiles[1].content, updatedFiles[1].name, 1);
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
   * @description Open a new file.
   * @param newFileName - The name of the new file
   */
  const handleNewFile = async (newFileName: string) => {
    // Simulate opening a file
    const newFileContent = "// Enter Antimony Model Here";
    const file = new File([newFileContent], newFileName, { type: "text/plain" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const event = {
      target: {
        files: dataTransfer.files,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    await handleFileUpload(event);

    // Simulate clicking the file
    const newFileIndex = uploadedFiles.findIndex(
      (file: { name: string; content: string }) => file.name === newFileName
    );
    handleFileClick(newFileContent, newFileName, newFileIndex);
  };

  return (
    <div className="app">
      <HeaderMenu
        db={db}
        setDb={setDb}
        fileName={selectedFileName}
        fileContent={selectedFileContent}
        setFileContent={setSelectedFileContent}
        setUploadedFiles={setUploadedFiles}
        handleConversionAntimony={handleConversionAntimony}
        handleConversionSBML={handleConversionSBML}
        handleFileDownload={handleFileDownload}
        handleFileUpload={handleFileUpload}
        handleNewFile={handleNewFile}
        setHighlightColor={setHighlightColor}
        colors={colors}
      />
      <div className="middle">
        <Split
          renderSplitter={() => <SolidSplitter />}
          initialPrimarySize="14%"
          minPrimarySize="14%"
          splitterSize="5px"
        >
          <section className="sidebar">
            <div className="fileExplorerContainer">
              <div className="fileExplorerTitle">File Explorer</div>
            </div>
            <FileExplorer
              key={fileExplorerKey}
              files={uploadedFiles}
              setFiles={setUploadedFiles}
              onFileClick={handleFileClick}
              onDeleteFile={deleteFile}
              selectedFileIndex={selectedFileIndex}
              setSelectedFileIndex={setSelectedFileIndex}
              selectedFileName={selectedFileName}
              setSelectedFileName={setSelectedFileName}
            />
          </section>
          <section className="editor">
            {db ? ( // Conditionally render the AntimonyEditor component when db is defined
              <AntimonyEditor
                key={selectedFileName}
                content={selectedFileContent}
                fileName={selectedFileName}
                database={db}
                annotUnderlinedOn={annotUnderlinedOn}
                setAnnotUnderlinedOn={setAnnotUnderlinedOn}
                editorInstance={editorInstance}
                setEditorInstance={setEditorInstance}
                selectedFilePosition={selectedEditorPosition}
                handleSelectedPosition={handleSelectedPosition}
                handleConversionSBML={handleConversionSBML}
                highlightColor={highlightColor}
                setHighlightColor={setHighlightColor}
              />
            ) : (
              // You can provide a loading message or handle the absence of the database as needed
              <div>Loading...</div>
            )}
          </section>
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
