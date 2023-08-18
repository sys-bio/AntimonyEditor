import React, { useState, useEffect } from 'react';
import './App.css';
import FileExplorer from './FileUploader';
import CodeEditor from './AntimonyEditor';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MyDB extends DBSchema {
  files: {
    key: string;
    value: { name: string; content: string };
  };
}

const sampleAntimonyModel = `
// Sample Antimony Model
model main()
  compartment C1;

  species S1, S2;

  S1 in C1;
  S2 in C1;

  S1 -> S2; k1*S1;
  k1 = 0.1;
end
`;

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; content: string }[]>([]);
  const [selectedFileContent, setSelectedFileContent] = useState<string>(sampleAntimonyModel);

  useEffect(() => {
    openDB<MyDB>('fileDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'name' });
        }
      },
    }).then(db => {
      db.getAll('files').then(files => {
        setUploadedFiles(files);
      });
    });
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const db = await openDB<MyDB>('fileDB', 1);

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

  const handleFileClick = (fileContent: string) => {
    setSelectedFileContent(fileContent);
  };

  return (
    <div className="app">
      <h1>File Explorer & Code Editor</h1>
      <input type="file" multiple onChange={handleFileUpload} />
      <div className="content-container">
        <FileExplorer files={uploadedFiles} onFileClick={handleFileClick} />
        <CodeEditor content={selectedFileContent} />
      </div>
    </div>
  );
};

export default App;
