import React, { useState, useEffect, useRef } from "react";
import "./HeaderMenu.css";

interface HeaderMenuProps {
  fileName: string;
  handleConversionAntimony: () => void;
  handleConversionSBML: () => void;
  handleFileDownload: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleNewFile: (handleNewFile: string) => Promise<void>;
  setHighlightColor: (color: string) => void
  colors: { name: string; color: string}[];
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({
  fileName,
  handleConversionAntimony,
  handleConversionSBML,
  handleFileDownload,
  handleFileUpload,
  handleNewFile,
  setHighlightColor,
  colors
}) => {
  const [dropdownVisible, setDropdownVisible] = useState("");
  const [subDropdownVisible, setSubDropdownVisible] = useState("");
  const [colorDropdownVisible, setColorDropdownVisible] = useState("");
  const dropdownRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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

  const handleMenuOptionClick = (menuOption: string) => {
    setDropdownVisible((prev) => (prev === menuOption ? "" : menuOption));
    setSubDropdownVisible("");
    setColorDropdownVisible("");
  };

  const handleMenuOptionHover = (menuOption: string) => {
    if (dropdownVisible) {
      setDropdownVisible(menuOption);
    }
  };

  const handleSubMenuOptionHover = (menuOption: string) => {
    setSubDropdownVisible(menuOption);
  };

  const handleSubMenuOptionLeave = (menuOption: string) => {
    if (subDropdownVisible === menuOption) {
      setSubDropdownVisible("");
    }
  };

  const handleColorOptionHover = (menuOption: string) => {
    setColorDropdownVisible(menuOption);
  };

  const handleColorOptionLeave = (menuOption: string) => {
    if (colorDropdownVisible === menuOption) {
      setColorDropdownVisible("");
    }
  };

  const handleAllDropdownsHidden = () => {
    setColorDropdownVisible("");
    setSubDropdownVisible("");
    setDropdownVisible("");
  };

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey && event.key === "n") {
        event.preventDefault();
        handleNewFile("untitled.ant");
      }

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

  return (
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
            className={`header-menu-item ${dropdownVisible === "file" && "header-menu-selected"}`}
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
                      handleNewFile("untitled.ant");
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
                  <div className="header-menu-command">Convert Antimony → SBML</div>
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
                  <div className="header-menu-command">Convert SBML → Antimony</div>
                </li>
              </ul>
            )}
          </li>
          <li
            className={`header-menu-item ${dropdownVisible === "settings" && "header-menu-selected"}`}
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
                    <ul className="sub-menu-dropdown"
                      onMouseEnter={() => handleSubMenuOptionHover("color")}
                      onMouseLeave={() => handleSubMenuOptionLeave("color")}
                    >
                      <li
                        onMouseEnter={() => handleColorOptionHover("highlight")}
                        onMouseLeave={() => handleColorOptionLeave("highlight")}
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
                                onClick={() => {setHighlightColor(color.color);
                                                handleAllDropdownsHidden()}}>
                                <div className="color-option">
                                  {color.name}
                                  <div className="color-square" style={{ backgroundColor: color.color }}></div>
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
            className={`header-menu-item ${dropdownVisible === "help" && "header-menu-selected"}`}
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
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderMenu;
