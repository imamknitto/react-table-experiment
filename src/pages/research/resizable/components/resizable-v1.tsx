import { useState } from 'react';

export default function ResizableV1() {
  const [width, setWidth] = useState(200);

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setWidth((prevWidth) => Math.max(100, prevWidth + e.movementX));
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="border border-gray-400 h-[100px] rounded-lg relative group" style={{ width: `${width}px` }}>
      <div
        className="w-[9px] h-[50px] absolute right-0 cursor-col-resize top-1/2 -translate-y-1/2 group-hover:bg-blue-300"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
