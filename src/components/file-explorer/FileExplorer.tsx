import React, { useEffect, useState, useRef} from 'react';
import './FileExplorer.css'
import ContextMenu from '../ContextMenu';

interface FileExplorerProps {
  files: { name: string; content: string }[];
  onFileClick: (fileContent: string, fileName: string) => void;
  onDeleteFile: (fileName: string) => void
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileClick, onDeleteFile }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    Number(window.localStorage.getItem('current_file_index') || null)
  );
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuProps, setContextMenuProps] = useState(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleFileButtonClick = (index: number, fileName: string) => {
    setSelectedFileIndex(index);
    setSelectedFileName(fileName)
    onFileClick(files[index].content, fileName);
    console.log("TTEST");
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

  
  //DELETE FILE BELOW

  useEffect(() => {
    if (files.length === 0) {
      setSelectedFileIndex(null);
      setSelectedFileName(null);
    }
  }, [files]);
  const handleFileRightClick = (e:any, index:any, fileName:any) => {
    
    e.preventDefault(); // Prevent the default context menu
    setSelectedFileIndex(index);
    setSelectedFileName(fileName);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (showContextMenu) {
          setShowContextMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu]);

  const handleContextMenuOptionClick = (option: string) => {
    console.log("menu");
    if (option === 'delete' && selectedFileName) {
      console.log("DELETE");
      onDeleteFile(selectedFileName);
      setShowContextMenu(false);
    }
  };

  return (
    <div className="file-explorer">
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <button
              onClick={() => handleFileButtonClick(index, file.name)}
              onContextMenu={(e) => handleFileRightClick(e, index, file.name)}
              className={`button ${selectedFileIndex === index ? 'selected' : ''}`}
            >
              {file.name}
            </button>
          </li>
        ))}
      </ul>
      {showContextMenu && (
        <ContextMenu
          x={contextMenuPosition.x}
          y={contextMenuPosition.y}
          onOptionClick={handleContextMenuOptionClick}
          ref={menuRef}
        />
      )}
    </div>
  );
};

export default FileExplorer;
