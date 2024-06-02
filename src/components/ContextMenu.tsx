import React, { useRef } from 'react';
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
          <li onClick={() => onOptionClick('delete')}>Delete  &#x1F5D1;</li>
          {/* Add more options here */}
        </ul>
      </div>
    );
  }
);

export default ContextMenu;
