import React, { useState } from 'react';

interface FileExplorerProps {
  files: { name: string; content: string }[];
  onFileClick: (fileContent: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileClick }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);

  const handleFileButtonClick = (index: number) => {
    setSelectedFileIndex(index);
    onFileClick(files[index].content);
  };

  return (
    <div className="file-explorer">
      <style>{`
        .button:hover,
        .button.selected {
          color: white;
          background-color: #464646;
        }
      `}</style>
      <ul style={{ listStyle: 'none' }}>
        {files.map((file, index) => (
          <li key={index}>
            <button
              onClick={() => handleFileButtonClick(index)}
              className={`button ${selectedFileIndex === index ? 'selected' : ''}`}
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
