import React from 'react';

interface FileExplorerProps {
  files: { name: string; content: string }[];
  onFileClick: (fileContent: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileClick }) => {
  return (
    <div className="file-explorer">
      {/* <style>{`
          .button {
              background-color: #1c1c1c;
              border-radius: 2px;
              border-style: solid;
              border-width: 1px;
              border-color: #1c1c1c;
              color: #B7B7B7;
              cursor: pointer;
              display: inline-block;
              font-size: 1em;
              font-weight: normal !important;
              line-height: 1.2;
              margin: 0 3px 0 0;
              padding: 2px 7px;
              position: relative;
              text-align: center;
              text-decoration: none !important;
              text-overflow: ellipsis;
              text-shadow: none;
              white-space: nowrap;
          }
          .button:hover {
              color: white;
              background-color: #464646;
          }
          .menu {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4px;
              flex-wrap: wrap;
          }
      `}</style> */}
      {/* <h5 style={{paddingLeft:'7px'}}>Don't Forget to Save Files Before Closing Website</h5>  */}
      <ul style={{ listStyle: 'none'}}>
        {files.map((file, index) => (
          <li key={index}>
              <button
                key={index} 
                onClick={() => onFileClick(file.content)}
                className='button'
              >
                {file.name}
              </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;
