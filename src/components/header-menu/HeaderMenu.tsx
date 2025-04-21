import React, { useState, useEffect, useRef } from "react";
import "./HeaderMenu.css";

import { MyDB } from "../../App";
import RecommendAnnotationModal from "../recommend-annotation/RecommendAnnotationModal";

import { IDBPDatabase } from "idb";

/**
 * @description HeaderMenuProps interface
 * @interface
 * @property {IDBPDatabase<MyDB> | null | undefined} db - The database
 * @property {function} setDb - Set the database
 * @property {string} fileName - The name of the current selected file
 * @property {string} fileContent - The contents of the current selected file
 * @property {function} setFileContent - Sets the file content
 * @property {function} setUploadedFiles - Sets the uploaded files
 * @property {function} handleConversionAntimony - Handle the Antimony to SBML file conversion process
 * @property {function} handleConversionSBML - Handle the SBML to Antimony file conversion
 * @property {function} handleFileDownload - Handle the file download
 * @property {function} handleFileUpload - Handle the file upload
 * @property {function} handleNewFile - Handle a new file
 */
interface HeaderMenuProps {
  db: IDBPDatabase<MyDB> | null | undefined;
  setDb: (database: IDBPDatabase<MyDB> | null) => void;
  fileName: string;
  fileContent: string;
  setFileContent: (fileContent: string) => void;
  setUploadedFiles: (files: { name: string; content: string }[]) => void;
  handleConversionAntimony: () => void;
  handleConversionSBML: () => void;
  handleFileDownload: () => void;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  handleNewFile: (newFileName: string, fileContent: string) => Promise<void>;
  setHighlightColor: (color: string) => void;
  colors: { name: string; color: string }[];
}

/**
 * @description HeaderMenu component
 * @param db - HeaderMenuProp
 * @param setDb - HeaderMenuProp
 * @param fileName - HeaderMenuProp
 * @param fileContent - HeaderMenuProp
 * @param setFileContent - HeaderMenuProp
 * @param setUploadedFiles - setUploadedFiles
 * @param handleConversionAntimony - HeaderMenuProp
 * @param handleConversionSBML - HeaderMenuProp
 * @param handleFileDownload - HeaderMenuProp
 * @param handleFileUpload - HeaderMenuProp
 * @param handleNewFile - HeaderMenuProp
 * @example - <HeaderMenu
 *              handleConversionAntimony={handleConversionAntimony}
 *              handleConversionSBML={handleConversionSBML}
 *              handleFileDownload={handleFileDownload}
 *              handleFileUpload={handleFileUpload}
 *            />
 * @returns - HeaderMenu component
 */
const HeaderMenu: React.FC<HeaderMenuProps> = ({
  db,
  setDb,
  fileName,
  fileContent,
  setFileContent,
  setUploadedFiles,
  handleConversionAntimony,
  handleConversionSBML,
  handleFileDownload,
  handleFileUpload,
  handleNewFile,
  setHighlightColor,
  colors,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState<string>("");
  const [subDropdownVisible, setSubDropdownVisible] = useState<string>("");
  const [colorDropdownVisible, setColorDropdownVisible] = useState<string>("");
  const [convertedFileContent, setConvertedFileContent] = useState<string>("");
  const [isConverted, setIsConverted] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isAboutModalVisible, setAboutModalVisible] = useState<boolean>(false);
  const [aboutContent, setAboutContent] = useState<string>('');
  const dropdownRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * @description Handle clicking outside the dropdown to close it.
   * @param {MouseEvent} e - The mouse event triggered when clicking outside the dropdown.
   */
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownVisible("");
        setSubDropdownVisible("");
        setColorDropdownVisible("");
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownRef]);

  /**
   * @description Handles the file annotation process.
   *              It checks the file type and either opens a modal or converts an Antimony file to SBML before opening the modal.
   */
  const handleAnnotateClick = async () => {
    setDropdownVisible("");

    if (fileName.endsWith(".xml")) {
      setModalVisible(true);
    } else if (fileName.endsWith(".ant")) {
      try {
        if (window.convertAntimonyToSBML) {
          setConvertedFileContent(
            await window.convertAntimonyToSBML(window.antimonyString)
          );
          setIsConverted(true);
          setModalVisible(true);
        } else {
          console.error(
            "convertAntimonyToSBML function not found in the global scope."
          );
        }
      } catch (err) {
        console.error("Error during Antimony to SBML conversion:", err);
      }
    } else {
      // If the file is neither .xml nor .ant
      alert(
        "Invalid file type.\nOnly AMAS (.ant) and SBML (.xml) files can be annotated using AMAS."
      );
    }
  };

  /**
   * @description Handle menu option click to toggle the visibility of the dropdown menu.
   * @param {string} menuOption - The menu option that was clicked.
   */
  const handleMenuOptionClick = (menuOption: string) => {
    setDropdownVisible((prev) => (prev === menuOption ? "" : menuOption));
    setSubDropdownVisible("");
    setColorDropdownVisible("");
  };

  /**
   * @description Handle menu option hover to change the visible dropdown menu.
   * @param {string} menuOption - The menu option that is being hovered over.
   */
  const handleMenuOptionHover = (menuOption: string) => {
    if (dropdownVisible) {
      setDropdownVisible(menuOption);
    }
  };
  /**
   * Handle submenu option hover to change the visible submenu dropdown.
   *
   * @param {string} menuOption - The submenu option that is being hovered over.
   */
  const handleSubMenuOptionHover = (menuOption: string) => {
    setSubDropdownVisible(menuOption);
  };

  /**
   * Handle submenu option leave to hide the visible submenu dropdown.
   *
   * @param {string} menuOption - The submenu option that is being hovered over.
   */
  const handleSubMenuOptionLeave = (menuOption: string) => {
    if (subDropdownVisible === menuOption) {
      setSubDropdownVisible("");
    }
  };

  /**
   * Handle color option hover to change the visible color dropdown.
   *
   * @param {string} menuOption - The color option that is being hovered over.
   */
  const handleColorOptionHover = (menuOption: string) => {
    setColorDropdownVisible(menuOption);
  };

  /**
   * Handle color option leave to hide the visible color dropdown.
   *
   * @param {string} menuOption - The color option that is being hovered over.
   */
  const handleColorOptionLeave = (menuOption: string) => {
    if (colorDropdownVisible === menuOption) {
      setColorDropdownVisible("");
    }
  };

  /**
   * Handle hiding all dropdowns by resetting their visibility states.
   */
  const handleAllDropdownsHidden = () => {
    setColorDropdownVisible("");
    setSubDropdownVisible("");
    setDropdownVisible("");
  };

  /**
   * @description Handle using keyboard shortcuts for opening new file and uploading files.
   * @param {KeyboardEvent} event - The keyboard event triggered when a key is pressed.
   */
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check if Alt+N is pressed
      if (event.altKey && event.key === "n") {
        event.preventDefault();
        handleNewFile("untitled.ant", "");
      }

      // Check if Ctrl+O is pressed
      if (event.ctrlKey && event.key === "o") {
        event.preventDefault();
        fileInputRef.current?.click();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleFileUpload, handleNewFile]);

  useEffect(() => {
    if (isAboutModalVisible) {
      fetch('/about.html')
        .then(response =>response.text())
        .then(html => {
          setAboutContent(html);
        });
    }
  }, [isAboutModalVisible]);

  return (
    <>
      <header ref={dropdownRef}>
        <h1 className="title">Antimony Web Editor</h1>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileUpload}
          accept=".ant,.xml,.txt"
        />
        <nav>
          <ul className="header-menu">
            <li
              className={`header-menu-item ${
                dropdownVisible === "file" && "header-menu-selected"
              }`}
              onClick={() => handleMenuOptionClick("file")}
              onMouseEnter={() => handleMenuOptionHover("file")}
            >
              File
              {dropdownVisible === "file" && (
                <ul
                  className="header-menu-dropdown"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <li>
                    <div
                      className="header-menu-command"
                      onClick={() => {
                        setDropdownVisible("");
                        handleNewFile("untitled.ant", "");
                      }}
                    >
                      <div>New File</div>
                      <div>Alt+N</div>
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      setDropdownVisible("");
                      fileInputRef.current?.click();
                    }}
                  >
                    <div className="header-menu-command">
                      <div>Open File(s)</div>
                      <div>Ctrl+O</div>
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      setDropdownVisible("");
                      handleFileDownload();
                    }}
                  >
                    <div className="header-menu-command">Save to Downloads</div>
                  </li>
                  <hr />
                  <li
                    onClick={() => {
                      setDropdownVisible("");
                      if (fileName.endsWith(".ant")) {
                        handleConversionAntimony();
                      } else {
                        alert(
                          "Invalid file type.\nOnly Antimony (.ant) files can be converted to SBML (.xml)."
                        );
                      }
                    }}
                  >
                    <div className="header-menu-command">
                      Convert Antimony → SBML
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      setDropdownVisible("");
                      if (fileName.endsWith(".xml")) {
                        handleConversionSBML();
                      } else {
                        alert(
                          "Invalid file type.\nOnly SBML (.xml) files can be converted to Antimony (.ant)."
                        );
                      }
                    }}
                  >
                    <div className="header-menu-command">
                      Convert SBML → Antimony
                    </div>
                  </li>
                </ul>
              )}
            </li>
            <li
              className={`header-menu-item ${
                dropdownVisible === "annotate" && "header-menu-selected"
              }`}
              onClick={() => handleMenuOptionClick("annotate")}
              onMouseEnter={() => handleMenuOptionHover("annotate")}
            >
              Annotate
              {dropdownVisible === "annotate" && (
                <ul
                  className="header-menu-dropdown"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <li onClick={handleAnnotateClick}>
                    <div className="header-menu-command">
                      Recommend Annotations for All
                    </div>
                  </li>
                </ul>
              )}
            </li>
            <li
              className={`header-menu-item ${
                dropdownVisible === "settings" && "header-menu-selected"
              }`}
              onClick={() => handleMenuOptionClick("settings")}
              onMouseEnter={() => handleMenuOptionHover("settings")}
            >
              Settings
              {dropdownVisible === "settings" && (
                <ul
                  className="header-menu-dropdown"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <li
                    onMouseEnter={() => handleSubMenuOptionHover("color")}
                    onMouseLeave={() => handleSubMenuOptionLeave("color")}
                  >
                    <div className="header-menu-command">
                      <div className="menu-text">Color</div>
                      <div className="arrow-icon">&#9658;</div>
                    </div>
                    {subDropdownVisible === "color" && (
                      <ul
                        className="sub-menu-dropdown"
                        onMouseEnter={() => handleSubMenuOptionHover("color")}
                        onMouseLeave={() => handleSubMenuOptionLeave("color")}
                      >
                        <li
                          onMouseEnter={() =>
                            handleColorOptionHover("highlight")
                          }
                          onMouseLeave={() =>
                            handleColorOptionLeave("highlight")
                          }
                        >
                          <div className="header-menu-command">
                            <div className="menu-text">Highlight</div>
                            <div className="arrow-icon">&#9658;</div>
                          </div>
                          {colorDropdownVisible === "highlight" && (
                            <ul className="sub-menu-dropdown">
                              {colors.map((color, index) => (
                                <li
                                  key={index}
                                  onClick={() => {
                                    setHighlightColor(color.color);
                                    handleAllDropdownsHidden();
                                  }}
                                >
                                  <div className="color-option">
                                    {color.name}
                                    <div
                                      className="color-square"
                                      style={{ backgroundColor: color.color }}
                                    ></div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>
            <li
              className={`header-menu-item ${
                dropdownVisible === "help" && "header-menu-selected"
              }`}
              onClick={() => handleMenuOptionClick("help")}
              onMouseEnter={() => handleMenuOptionHover("help")}
            >
              Help
              {dropdownVisible === "help" && (
                <ul
                  className="header-menu-dropdown"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <li onClick={() => setDropdownVisible("")}>
                    <a
                      href="https://github.com/sys-bio/AntimonyEditor"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Documentation
                    </a>
                  </li>
                  <li onClick={() => setDropdownVisible("")}>
                    <a
                      href="https://github.com/sys-bio/AntimonyEditor/issues"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Report Issue
                    </a>
                  </li>
                  <li onClick={() => { 
                    setDropdownVisible("");
                    setAboutModalVisible(true);
                    }}>
                    <div className="header-menu-command">
                      About
                    </div>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </header>
      {isModalVisible && (
        <RecommendAnnotationModal
          db={db}
          setDb={setDb}
          onClose={() => setModalVisible(false)}
          fileName={fileName}
          fileContent={isConverted ? convertedFileContent : fileContent}
          setFileContent={setFileContent}
          setUploadedFiles={setUploadedFiles}
          isConverted={isConverted}
        />
      )}
      {isAboutModalVisible && (
        <div 
        className="modal-background" 
        onClick={() => setAboutModalVisible(false)}
      >
        <div 
          className="about-modal" 
          onClick={(e) => e.stopPropagation()}
        >
          <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
        </div>
      </div>
      )}
    </>
  );
};

export default HeaderMenu;
