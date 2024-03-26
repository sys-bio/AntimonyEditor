import React, { useState, useEffect } from 'react';
import './App.css';
import FileExplorer from './components/file-explorer/FileExplorer';
import { openDB, DBSchema } from 'idb';
import { SolidSplitter } from './components/CustomSplitters';
import { Split } from '@geoffcox/react-splitter';
import AntimonyEditor from './components/antimony-editor/AntimonyEditor';
import { IDBPDatabase } from 'idb';

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
  const [selectedFileContent, setSelectedFileContent] = useState<string>('// Enter Antimony Model Here');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [db, setDb] = useState<IDBPDatabase<MyDB> | null>();
  const [fileExplorerKey, setFileExplorerKey] = useState<number>(0);
  const [sbmlResultListenerAdded, setSbmlResultListenerAdded] = useState<boolean>(false);

  /**
   * @description Use the openDB function to open the database
   */
  useEffect(() => {
    openDB<MyDB>('antimony_editor_db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'name' });
        }
      },
    }).then(database => {
      setDb(database); // Store the database instance in the state
      database.getAll('files').then(files => {
        setUploadedFiles(files);
      });
    });
    window.addEventListener('grabbedSBMLResult', sbmlResultHandler);
    window.addEventListener('grabbedAntimonyResult', antimonyResultHandler);

    // Cleanup: Remove the event listeners when the component is unmounted
    return () => {
      window.removeEventListener('grabbedSBMLResult', sbmlResultHandler);
      window.removeEventListener('grabbedAntimonyResult', antimonyResultHandler);
    };
  }, []);
  
  /**
   * @description Handle the file upload
   * @param event - The event
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && db) {
      Array.from(files).forEach(async file => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async () => {
          const fileData = { name: file.name, content: reader.result as string };
          await db.put('files', fileData);
          setUploadedFiles(prevFiles => {
            const updatedFiles = [...prevFiles, fileData];
            // Sort the files alphabetically and numerically based on their names
            return updatedFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
          });
          setFileExplorerKey(prevKey => prevKey + 1); // Increment key to trigger re-render
        };
      });
    }
  };

  /**
   * @description Handle the file click
   * @param fileContent - The content of the file
   * @param fileName - The name of the file
   */
  const handleFileClick = (fileContent: string, fileName: string) => {
    window.selectedFile = fileName;
    setSelectedFileContent(fileContent);
    setSelectedFileName(fileName);
  
    // Store the selected file's information in IndexedDB
    if (db) {
      db.put('files', { name: fileName, content: fileContent });
    }
  };

  const handleAntToSBML = async (fileContent: string, fileName: string) => {
    setSelectedFileContent(fileContent);
    setSelectedFileName(fileName);
    window.selectedFile = fileName;
    // Store the selected file's information in IndexedDB
    if (db) {
      setUploadedFiles(prevFiles => {
        window.removeEventListener('grabbedSBMLResult', sbmlResultHandler);
        setSbmlResultListenerAdded(false);
        let updatedFiles = [...prevFiles];
        // const existingFileIndex = prevFiles.findIndex(file => file.name === window.selectedFile);
  
        // if (existingFileIndex !== -1) {
        // } else {
          // If the file doesn't exist, add it to the array
          updatedFiles = [...prevFiles, { name: window.selectedFile, content: fileContent }];
          db.put('files', { name: window.selectedFile, content: fileContent });
          console.log('add')
        // }
        window.addEventListener('grabbedSBMLResult', sbmlResultHandler, { once: true });
        // Sort the files alphabetically and numerically based on their names
        return updatedFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      });
    }
  };

  function sbmlResultHandler() {
    console.log('sbmlResult event received');
    let sbml = window.sbmlResult;
    console.log(window.selectedFile)
    if (window.selectedFile !== '' && window.selectedFile.includes('.ant')) {
      console.log('ran')
      handleAntToSBML(sbml, window.selectedFile.replace('ant', 'xml'))
        .then(() => {
          window.antimonyActive = false;
          window.sbmlString = '';
        })
        .catch(error => {
          console.error('Error in handleFileConversion:', error);
        });
    }
  }

  const handleSBMLtoAntConversion = async (fileContent: string, fileName: string) => {
    setSelectedFileContent(fileContent);
    setSelectedFileName(fileName);
    window.selectedFile = fileName;
    // Store the selected file's information in IndexedDB
    if (db) {
      setUploadedFiles(prevFiles => {
        window.removeEventListener('grabbedAntimonyResult', antimonyResultHandler);
        setSbmlResultListenerAdded(false);
        let updatedFiles = [...prevFiles];
        // const existingFileIndex = prevFiles.findIndex(file => file.name === window.selectedFile);
  
        // if (existingFileIndex !== -1) {
        //   // alert('File already exists');
        // } else {
          // If the file doesn't exist, add it to the array
          updatedFiles = [...prevFiles, { name: window.selectedFile, content: fileContent }];
          db.put('files', { name: window.selectedFile, content: fileContent });
          console.log('add')
        // }
        // Sort the files alphabetically and numerically based on their names
        return updatedFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      });
    }
  };

  function antimonyResultHandler() {
    console.log('antimonyResult event received');
    let antimony = window.antimonyResult;
    console.log(window.selectedFile)
    if (window.selectedFile !== '' && window.selectedFile.includes('.xml')) {
      console.log('ran')
      handleSBMLtoAntConversion(antimony, window.selectedFile.replace('xml', 'ant'))
        .then(() => {
          window.antimonyActive = true;
          window.antimonyString = '';
        })
        .catch(error => {
          console.error('Error in handleFileConversion:', error);
        });
    }
  }

  return (
    <div className='app'>
      <div className="middle">
        <Split
          renderSplitter={() => <SolidSplitter/>}
          initialPrimarySize='14%'
          splitterSize='5px'
          minPrimarySize='14%'
        >
          <section>
            <div>
              <input type="file" multiple onChange={handleFileUpload} />
            </div>
            <FileExplorer files={uploadedFiles} onFileClick={handleFileClick} />
          </section>
          <div>
            {db ? ( // Conditionally render the AntimonyEditor component when db is defined
                <AntimonyEditor content={selectedFileContent} fileName={selectedFileName} database={db} />
              ) : (
                // You can provide a loading message or handle the absence of the database as needed
                <div>Loading...</div>
              )}         
          </div>
        </Split>
      </div>
      <footer>
        <a target="_blank" rel="noopener noreferrer" href="https://reproduciblebiomodels.org/">
          Copyright © 2023 Center for Reproducible Biomedical Modeling
        </a>
      </footer>
    </div>
  );
};

export default App;