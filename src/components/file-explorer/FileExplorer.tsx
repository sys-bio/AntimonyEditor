import React, { useEffect, useState, useRef } from "react";
import "./FileExplorer.css";
import ContextMenu from "../context-menu/ContextMenu";

/**
 * @description FileExplorerProps interface
 * @interface
 * @property {object[]} files - The files object
 * @property {string} files[].name - The name of the file
 * @property {string} files[].content - The content of the file
 * @property {function} setFiles - The function to set the files
 * @property {function} onFileClick - The onFileClick function
 * @property {string} onFileClick[].content - The content of the file
 * @property {string} onFileClick[].fileName - The name of the file
 * @property {string} onFileClick[].index - The index of the file
 * @property {function} onDeleteFile - The onDeleteFile function that deletes the given file
 * @property {number | null} selectedFileIndex - The index of the currently selected file
 * @property {function} setSelectedFileIndex - The function to set the selectedFileIndex
 * @property {string} selectedFileName - The name of the currently selected file
 * @property {function} setSelectedFileName - The function to set the setSelectedFileName
 *
 */
interface FileExplorerProps {
  files: { name: string; content: string }[];
  setFiles: React.Dispatch<React.SetStateAction<{ name: string; content: string }[]>>;
  onFileClick: (fileContent: string, fileName: string, index: number) => void;
  onDeleteFile: (fileName: string, deleteFromFileExplorer: boolean) => Promise<void>;
  selectedFileIndex: number | null;
  setSelectedFileIndex: React.Dispatch<React.SetStateAction<number | null>>;
  selectedFileName: string;
  setSelectedFileName: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * @description FileExplorer component
 * @param files - FileExplorerProp
 * @param setFiles - FileExplorerProp
 * @param onFileClick - FileExplorerProp
 * @param onDeleteFile - FileExplorerProp
 * @param selectedFileIndex - FileExplorerProp
 * @param setSelectedFileIndex - FileExplorerProp
 * @param selectedFileName - FileExplorerProp
 * @param setSelectedFileName - FileExplorerProp
 * @returns - FileExplorer component
 */
const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  setFiles,
  onFileClick,
  onDeleteFile,
  selectedFileIndex,
  setSelectedFileIndex,
  selectedFileName,
  setSelectedFileName,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [deletedFileIndex, setDeletedFileIndex] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [renamingFileIndex, setRenamingFileIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * @description Handle the file button click
   * @param index - The index of the file
   * @param fileName - The name of the file
   */
  const handleFileButtonClick = (index: number, fileName: string) => {
    onFileClick(files[index].content, fileName, index);
  };

  /**
   * @description Determine which index is selected
   */
  useEffect(() => {
    // Check if selectedFileName is not null
    if (selectedFileName !== null) {
      const index = files.findIndex((file) => file.name === selectedFileName);
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
  }, [selectedFileName, setSelectedFileIndex, files]);

  //updates states based on local storage information
  useEffect(() => {
    const savedFileName = window.localStorage.getItem("current_file_name");
    const savedFileIndex = window.localStorage.getItem("current_file_index");

    if (savedFileName !== null) {
      const index = files.findIndex((file) => file.name === savedFileName);
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
  }, [files, setSelectedFileIndex, setSelectedFileName]);

  //updates local storage when selectedFileIndex changes
  useEffect(() => {
    if (selectedFileIndex !== null) {
      window.localStorage.setItem("current_file_index", String(selectedFileIndex));
    }
  }, [selectedFileIndex]);

  const handleFileRightClick = (e: any, index: any, fileName: any) => {
    e.preventDefault(); // Prevent the default context menu

    setDeletedFileIndex(index);
    setSelectedFileName(fileName);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  /**
   * Close the right click File Explorer menu if outside click
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (showContextMenu) {
          setShowContextMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showContextMenu]);

  /**
   * @description Determine what to do when selecting an option in the right click Context Menu
   * @param option - The selected option
   */
  const handleContextMenuOptionClick = async (option: string) => {
    setShowContextMenu(false);

    if (option === "rename" && selectedFileName) {
      setIsRenaming(true);
      setRenamingFileIndex(selectedFileIndex);
      setNewFileName(selectedFileName);
    } else if (option === "delete" && selectedFileName) {
      await onDeleteFile(selectedFileName, true);
      if (
        deletedFileIndex != null &&
        selectedFileIndex != null &&
        deletedFileIndex < selectedFileIndex
      ) {
        setSelectedFileIndex(selectedFileIndex - 1);
      }
    }
  };

  const handleRenameComplete = async () => {
    if (renamingFileIndex !== null && selectedFileName !== newFileName) {
      const updatedFiles = files.map((file, index) => {
        if (index === renamingFileIndex) {
          return { ...file, name: newFileName };
        }
        return file;
      });

      await onDeleteFile(selectedFileName, false);
      setFiles(updatedFiles);
      setSelectedFileName(newFileName);
      window.localStorage.setItem("current_file_name", newFileName);
    }

    setIsRenaming(false);
    setNewFileName("");
    setRenamingFileIndex(null);
  };

  return (
    <div className="file-explorer">
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {isRenaming && renamingFileIndex === index ? (
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={handleRenameComplete}
                autoComplete="off"
                autoFocus
                className="rename-input"
              />
            ) : (
              <button
                onClick={() => handleFileButtonClick(index, file.name)}
                onContextMenu={(e) => handleFileRightClick(e, index, file.name)}
                className={`file-btn ${selectedFileIndex === index ? "selected" : ""}`}
              >
                {file.name}
              </button>
            )}
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
