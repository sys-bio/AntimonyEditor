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
interface MyDB extends DBSchema {
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
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [db, setDb] = useState<IDBPDatabase<MyDB> | null>();
  const [editorInstance, setEditorInstance] = useState<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  const [fileExplorerKey, setFileExplorerKey] = useState<number>(0);
  const [sbmlResultListenerAdded, setSbmlResultListenerAdded] = useState<boolean>(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    Number(window.localStorage.getItem("current_file_index") || null)
  );
  const [selectedEditorPosition, setSelectedEditorPosition] = useState<SrcPosition>(
    new SrcPosition(1, 1)
  );

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
   */
  const handleFileClick = (fileContent: string, fileName: string) => {
    // window.selectedFile = fileName;
    setSelectedFileContent(fileContent);
    setSelectedFileName(fileName);

    // Store the selected file's information in IndexedDB
    // if (db) {
    //   db.getAll("files").then((data) => {console.log("WOW"); console.log(data);});
    //   db.put('files', { name: fileName, content: fileContent });
    //   db.getAll("files").then((data) => {console.log(data); console.log("WOW");});
    // }
  };

  const handleAntToSBML = async (fileContent: string, fileName: string) => {
    setSelectedFileContent(fileContent);
    setSelectedFileName(fileName);
    window.selectedFile = fileName;
    // Store the selected file's information in IndexedDB
    if (db) {
      setUploadedFiles((prevFiles) => {
        window.removeEventListener("grabbedSBMLResult", sbmlResultHandler);
        setSbmlResultListenerAdded(false);
        let updatedFiles = [...prevFiles];
        // const existingFileIndex = prevFiles.findIndex(file => file.name === window.selectedFile);

        // if (existingFileIndex !== -1) {
        // } else {
        // If the file doesn't exist, add it to the array
        updatedFiles = [...prevFiles, { name: window.selectedFile, content: fileContent }];
        db.put("files", { name: window.selectedFile, content: fileContent });
        // }
        window.addEventListener("grabbedSBMLResult", sbmlResultHandler, { once: true });
        // Sort the files alphabetically and numerically based on their names
        return updatedFiles.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true })
        );
      });
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

  const handleSBMLtoAntConversion = async (fileContent: string, fileName: string) => {
    setSelectedFileContent(fileContent);
    setSelectedFileName(fileName);
    window.selectedFile = fileName;
    // Store the selected file's information in IndexedDB
    if (db) {
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
        db.put("files", { name: window.selectedFile, content: fileContent });
        // }
        // Sort the files alphabetically and numerically based on their names
        return updatedFiles.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true })
        );
      });
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
        setSelectedFileName("");
        window.localStorage.removeItem("current_file_index");
      }
    };

    loadData();
  }, []);

  //DELETE FUNCTIONALITY
  const deleteFile = async (fileName: string) => {
    if (db) {
      await db.delete("files", fileName); // Delete from IndexedDB
      const updatedFiles = uploadedFiles.filter((file) => file.name !== fileName);
      setUploadedFiles(updatedFiles); // Update state

      // Check if the deleted file was the currently selected file
      if (selectedFileName === fileName) {
        setSelectedFileContent("// Enter Antimony Model Here");
        setSelectedFileName("");
        setSelectedFileIndex(null);
        window.localStorage.removeItem("current_file_name");
        window.localStorage.removeItem("current_file_index");
        window.localStorage.setItem("current_file", "// Enter Antimony Model Here");
      } else if (selectedFileIndex !== null) {
        // Update the selectedFileIndex if the deleted file was not selected
        const newIndex = updatedFiles.findIndex((file) => file.name === selectedFileName);
        setSelectedFileIndex(newIndex !== -1 ? newIndex : null);

        // Handle case where the current file index is no longer valid
        if (newIndex === -1) {
          setSelectedFileContent("// Enter Antimony Model Here");
          setSelectedFileName("");
          window.localStorage.removeItem("current_file_index");
          window.localStorage.removeItem("current_file");
          window.localStorage.setItem("current_file", "// Enter Antimony Model Here");
        }
      }
      const files = await db.getAll("files");
      const fileNames = files.map((file) => file.name);
    }
  };

  const handleFileDownload = () => {
    handleDownload(editorInstance, selectedFileName);
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

  return (
    <div className="app">
      <HeaderMenu
        fileName={selectedFileName}
        handleConversionAntimony={handleConversionAntimony}
        handleConversionSBML={handleConversionSBML}
        handleFileDownload={handleFileDownload}
        handleFileUpload={handleFileUpload}
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
              files={uploadedFiles}
              onFileClick={handleFileClick}
              onDeleteFile={deleteFile}
            />
          </section>
          <section className="editor">
            {db ? ( // Conditionally render the AntimonyEditor component when db is defined
              <AntimonyEditor
                key={selectedFileName}
                content={selectedFileContent}
                fileName={selectedFileName}
                database={db}
                editorInstance={editorInstance}
                setEditorInstance={setEditorInstance}
                selectedFilePosition={selectedEditorPosition}
                handleSelectedPosition={handleSelectedPosition}
                handleConversionSBML={handleConversionSBML}
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
            Copyright © 2023 Center for Reproducible Biomedical Modeling
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
