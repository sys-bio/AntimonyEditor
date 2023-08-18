import React from 'react';

interface FileExplorerProps {
  files: { name: string; content: string }[];
  onFileClick: (fileContent: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileClick }) => {
  return (
    <div className="file-explorer">
      <h2>File Explorer</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index} onClick={() => onFileClick(file.content)}>
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;
