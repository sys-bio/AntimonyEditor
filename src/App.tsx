import React, { useState } from 'react';
import './App.css';
import FileExplorer from './FileUploader';
import CodeEditor from './AntimonyEditor';

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          setUploadedFiles(prevFiles => [...prevFiles, { name: file.name, content: reader.result as string }]);
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
