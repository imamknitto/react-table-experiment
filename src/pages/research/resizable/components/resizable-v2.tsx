import { useState, useRef, useCallback } from 'react';

export default function Experiment() {
  const [width, setWidth] = useState(200);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = () => {
    if (!boxRef.current) return;
    boxRef.current.requestPointerLock();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setWidth((prevWidth) => Math.max(100, prevWidth + e.movementX));
  }, []);

  const handleMouseUp = () => {
    document.exitPointerLock();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={boxRef}
      className="border border-gray-400 h-[100px] relative group shrink-0"
      style={{ minWidth: `${width}px` }}
    >
      <div
        className="w-[.25rem] h-[50px] absolute right-0 cursor-col-resize top-1/2 -translate-y-1/2 group-hover:bg-blue-300"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
