import React, { useState, useEffect } from 'react';
import './App.css';
import FileExplorer from './FileExplorer';
import { openDB, DBSchema } from 'idb';
import { SolidSplitter } from './CustomSplitters';
import { Split } from '@geoffcox/react-splitter';
import AntimonyEditor from './AntimonyEditor';

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
    <div className='app' style={{height: '100%'}}>
      <div className="wrapper">
        <div className="top" style={{"fontSize": "2em", textAlign: 'center'}}>
          The Official Antimony Web Code Editor
          <div className="float-end" style={{"fontSize": ".5em"}}>
            <a href={"https://reproduciblebiomodels.org/"}>
              https://reproduciblebiomodels.org/
            </a>
          </div>
        </div>
        <div className="middle App" style={{"backgroundColor": "#1c1c1c", color:'white'}}>
          <Split
            renderSplitter={() => <SolidSplitter/>}
            initialPrimarySize='14%'
            splitterSize='3px'
          >
            <div style={{"height": "100%", "overflowY": "scroll"}}>
              <input type="file" multiple onChange={handleFileUpload} />
              <FileExplorer files={uploadedFiles} onFileClick={handleFileClick} />
              {/* <BsUpload style={{padding: '4px 0 0 7px'}}/> */}
              {/* <input type='file' className='choosefile' /> <br/> */}
            </div>        
            {/* <Split
              renderSplitter={() => <SolidSplitter />}
              splitterSize='3px'
              horizontal
              initialPrimarySize='80%'
            > */}
              <div style={{"height": "100%"}}>
              <AntimonyEditor content={selectedFileContent} />
              </div>
              Logs Here
              <div style={{"padding": "100px", "width": "100%", "height": "100%"}}>
                <div style={{"width": "100%", "height": "100%"}}>
                  <iframe style={{"width": "100%", "height": "100%"}}/>
                </div>
              </div>
            {/* </Split> */}
          </Split>
        </div>
        <div className="bottom" style={{backgroundColor: '#1c1c1c', color:'white'}}>Copyright © 2023 Center for Reproducible Biomedical Modeling</div>
      </div>
    </div>
  );
};

export default App;
