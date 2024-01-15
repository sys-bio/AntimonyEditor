import React, { useEffect, useState } from 'react';
import './FileExplorer.css'

interface FileExplorerProps {
  files: { name: string; content: string }[];
  onFileClick: (fileContent: string, fileName: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileClick }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    Number(window.localStorage.getItem('current_file_index') || null)
  );
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileButtonClick = (index: number, fileName: string) => {
    setSelectedFileIndex(index);
    setSelectedFileName(fileName)
    onFileClick(files[index].content, fileName);
  };

  useEffect(() => {
    const fileIndex = window.localStorage.getItem('current_file_index');
    if (fileIndex !== null) {
      const index = Number(fileIndex);
      if (!isNaN(index) && index >= 0 && index < files.length) {
        setSelectedFileIndex(index);
      }
    }
  }, [])

  useEffect(() => {
    if (selectedFileIndex !== null) {
      window.localStorage.setItem('current_file_index', String(selectedFileIndex));
    }
  }, [selectedFileIndex])

  return (
    <div className="file-explorer">
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <button
              onClick={() => handleFileButtonClick(index, file.name)}
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
