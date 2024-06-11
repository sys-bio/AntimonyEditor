import React from "react";
import "./ContextMenu.css";

interface ContextMenuProps {
  x: number;
  y: number;
  onOptionClick: (option: string) => void;
}

const ContextMenu = React.forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ x, y, onOptionClick }, ref) => {
    return (
      <div className="context-menu" style={{ top: y, left: x }} ref={ref}>
        <ul>
          {/* <li onClick={() => onOptionClick("rename")}>Rename</li> */}
          <li onClick={() => onOptionClick("delete")}>Delete</li>
          {/* Add more options here */}
        </ul>
      </div>
    );
  }
);

export default ContextMenu;
