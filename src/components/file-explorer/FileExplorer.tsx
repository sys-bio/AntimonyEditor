import React, { useState } from 'react';
import './FileExplorer.css'

/**
 * @description FileExplorerProps interface
 * @interface
 * @property {object[]} files - The files object
 * @property {string} files[].name - The name of the file
 * @property {string} files[].content - The content of the file
 * @property {function} onFileClick - The onFileClick function
 * @property {string} onFileClick[].content - The content of the file
 * @property {string} onFileClick[].fileName - The name of the file
 */
interface FileExplorerProps {
  files: { name: string; content: string }[];
  onFileClick: (fileContent: string, fileName: string) => void;
}

/**
 * @description FileExplorer component
 * @param files - The files object
 * @param onFileClick - The onFileClick function
 * @returns - FileExplorer component
 */
const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileClick }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(0);
  // const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  /**
   * @description Handle the file button click
   * @param index - The index of the file
   * @param fileName - The name of the file
   */
  const handleFileButtonClick = (index: number, fileName: string) => {
    setSelectedFileIndex(index);
    // setSelectedFileName(fileName)
    window.selectedFile = fileName;
    onFileClick(files[index].content, fileName);
  };

  return (
    <div className="file-explorer">
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <button
              onClick={() => handleFileButtonClick(index, file.name)}
              className={`button ${selectedFileIndex === index ? 'selected' : ''}`}
            >
              {file.name === "" ? "Example" : file.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;
