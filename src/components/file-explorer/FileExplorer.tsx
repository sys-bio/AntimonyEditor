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
  const [deletedFileIndex, setDeletedFileIndex] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuProps, setContextMenuProps] = useState(null);
  const menuRef = useRef<HTMLDivElement>(null);

  
  const handleFileButtonClick = (index: number, fileName: string) => {
    setSelectedFileName(fileName)
    onFileClick(files[index].content, fileName);
    window.localStorage.setItem('current_file_index', index.toString());
    window.localStorage.setItem('current_file_name', fileName); 
    console.log("file clicked");
  };

  useEffect(() => {
    // Check if selectedFileName is not null
    if (selectedFileName !== null) {
      const index = files.findIndex(file => file.name === selectedFileName);
      if (index !== -1) {
        // File found, update selectedFileIndex with the found index
        setSelectedFileIndex(index);
      } else {
        setSelectedFileIndex(null);
      }
    } else {
      // No file is selected, you might want to reset selectedFileIndex here as well
      setSelectedFileIndex(null);
    }
  }, [selectedFileName, files]); // Depend on selectedFileName and files
  
//updates states based on local storage information 
  useEffect(() => {
    const savedFileName = window.localStorage.getItem('current_file_name');
    const savedFileIndex = window.localStorage.getItem('current_file_index');
  
    if (savedFileName !== null) {
      const index = files.findIndex(file => file.name === savedFileName);
      if (index !== -1) {
        setSelectedFileIndex(index);
        setSelectedFileName(savedFileName);
      } else if (savedFileIndex !== null) {
        const index = parseInt(savedFileIndex, 10);
        if (!isNaN(index) && index >= 0 && index < files.length) {
          setSelectedFileIndex(index);
          setSelectedFileName(files[index].name);
        }
      }
    }
  }, [files]); 
  
  //updates local storage when selectedFileIndex changes
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

      setDeletedFileIndex(index);
      setSelectedFileName(fileName);
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);
  };

  //closes right click menu if outside click 
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
    console.log("delete pressed");
    if (option === 'delete' && selectedFileName) {
      console.log("delete option selected");
      onDeleteFile(selectedFileName);
      setShowContextMenu(false);
      if(deletedFileIndex != null && selectedFileIndex != null && deletedFileIndex < selectedFileIndex) {
        setSelectedFileIndex(selectedFileIndex-1);
      }
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
