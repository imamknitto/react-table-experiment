import { useCallback, useRef, useState } from 'react';

interface IResizableBox {
  currentWidth: number;
}

export default function useResizableHeader({ currentWidth }: IResizableBox) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [resizableWidth, setResizableWidth] = useState<number>(Number(currentWidth) || 180);

  const handleMouseDown = () => {
    if (!boxRef.current) return;
    boxRef.current.requestPointerLock();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setResizableWidth((prevWidth) => Math.max(180, prevWidth + e.movementX));
  }, []);

  const handleMouseUp = () => {
    document.exitPointerLock();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return { boxRef, handleMouseDown, resizableWidth };
}
