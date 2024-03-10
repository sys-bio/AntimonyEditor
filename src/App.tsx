import React, { useState, useEffect } from 'react';
import './App.css';
import FileExplorer from './components/file-explorer/FileExplorer';
import { openDB, DBSchema } from 'idb';
import { SolidSplitter } from './components/CustomSplitters';
import { Split } from '@geoffcox/react-splitter';
import AntimonyEditor from './components/antimony-editor/AntimonyEditor';
import { IDBPDatabase } from 'idb';
//import { upload } from '@testing-library/user-event/dist/upload';

interface MyDB extends DBSchema {
  files: {
    key: string;
    value: { name: string; content: string };
  };
}

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; content: string }[]>([]);
  const [selectedFileContent, setSelectedFileContent] = useState<string>(
    window.localStorage.getItem('current_file') || '// Enter Antimony Model Here'
  );
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [db, setDb] = useState<IDBPDatabase<MyDB> | null>();
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    Number(window.localStorage.getItem('current_file_index') || null)
  );

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
  
  const handleFileClick = (fileContent: string, fileName: string) => {
    setSelectedFileContent(fileContent);
    setSelectedFileName(fileName);
  
    // Store the selected file's information in IndexedDB
    if (db) {
      db.put('files', { name: fileName, content: fileContent });
    }
  };

  useEffect(() => {
  const loadData = async () => {
    const database = await openDB<MyDB>('antimony_editor_db', 1);
    setDb(database);
    const files = await database.getAll('files');
    setUploadedFiles(files);

    // Update selectedFileIndex based on the current files
    const fileIndex = Number(window.localStorage.getItem('current_file_index'));
    if (fileIndex >= 0 && fileIndex < files.length) {
      setSelectedFileIndex(fileIndex);
      setSelectedFileContent(files[fileIndex].content);
      setSelectedFileName(files[fileIndex].name);
    } else {
      setSelectedFileIndex(null);
      setSelectedFileContent('// Enter Antimony Model Here');
      setSelectedFileName('');
      window.localStorage.removeItem('current_file_index');
    }
  };

  loadData();
}, []);


  //DELETE FUNCTIONALITY
  const deleteFile = async (fileName: string) => {
    if (db) {
      await db.delete('files', fileName); // Delete from IndexedDB
      const updatedFiles = uploadedFiles.filter(file => file.name !== fileName);
      setUploadedFiles(updatedFiles); // Update state
  
      // Check if the deleted file was the currently selected file
      if (selectedFileName === fileName) {
        console.log("filename matches")

        setSelectedFileContent('// Enter Antimony Model Here');
        setSelectedFileName('');
        setSelectedFileIndex(null);
        window.localStorage.removeItem('current_file_name');
        window.localStorage.removeItem('current_file_index');
        window.localStorage.setItem('current_file', '// Enter Antimony Model Here');
      } else if (selectedFileIndex !== null) {
        console.log("filename doesnot match");

        // Update the selectedFileIndex if the deleted file was not selected
        const newIndex = updatedFiles.findIndex(file => file.name === selectedFileName);
        setSelectedFileIndex(newIndex !== -1 ? newIndex : null);
        console.log(newIndex);

        // Handle case where the current file index is no longer valid
        if (newIndex === -1) {
          setSelectedFileContent('// Enter Antimony Model Here');
          setSelectedFileName('');
          window.localStorage.removeItem('current_file_index');
          window.localStorage.removeItem('current_file');
          window.localStorage.setItem('current_file', '// Enter Antimony Model Here');
        }
      }
      console.log("delete has gone through");
      const files = await db.getAll('files');
      const fileNames = files.map(file => file.name);
      
    }
  };

  return (
    <div className='app'>
      <header>
        <h1>The Official Antimony Web Code Editor</h1>
        <a target="_blank" href={"https://reproduciblebiomodels.org/"}>
          https://reproduciblebiomodels.org/
        </a>
      </header>
      <div className="middle">
        <Split
          renderSplitter={() => <SolidSplitter/>}
          initialPrimarySize='14%'
          splitterSize='3px'
          minPrimarySize='14%'
        >
          <section>
            <input type="file" multiple onChange={handleFileUpload} />
            <FileExplorer files={uploadedFiles} onFileClick={handleFileClick} onDeleteFile={deleteFile}/>
          </section>       
          <div>
          {db ? ( // Conditionally render the AntimonyEditor component when db is defined
              <AntimonyEditor key={selectedFileName} content={selectedFileContent} fileName={selectedFileName} database={db} />
            ) : (
              // You can provide a loading message or handle the absence of the database as needed
              <div>Loading...</div>
            )}          </div>
        </Split>
      </div>
      <footer>
        Copyright © 2023 Center for Reproducible Biomedical Modeling
      </footer>
    </div>
  );
};

export default App;
