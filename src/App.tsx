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
          setUploadedFiles(prevFiles => [...prevFiles, fileData]);
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
    setSelectedFileContent(fileContent);
    setSelectedFileName(fileName);
  
    // Store the selected file's information in IndexedDB
    if (db) {
      db.put('files', { name: fileName, content: fileContent });
    }
  };

  return (
    <div className='app'>
      <div className="middle">
        <Split
          renderSplitter={() => <SolidSplitter/>}
          initialPrimarySize='14%'
          splitterSize='3px'
          minPrimarySize='14%'
        >
          <section>
            <input type="file" multiple onChange={handleFileUpload} />
            <FileExplorer files={uploadedFiles} onFileClick={handleFileClick} />
          </section>       
          <div>
          {db ? ( // Conditionally render the AntimonyEditor component when db is defined
              <AntimonyEditor content={selectedFileContent} fileName={selectedFileName} database={db} />
            ) : (
              // You can provide a loading message or handle the absence of the database as needed
              <div>Loading...</div>
            )}          </div>
        </Split>
      </div>
      <footer>
        <a target="-no-target-blank" href={"https://reproduciblebiomodels.org/"}>
          Copyright © 2023 Center for Reproducible Biomedical Modeling
        </a>
      </footer>
    </div>
  );
};

export default App;
