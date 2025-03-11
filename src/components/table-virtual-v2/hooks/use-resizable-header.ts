import { useCallback, useEffect, useRef, useState } from 'react';
import { useTableVirtual } from '../service/table-virtual-context';

interface IResizableBox {
  currentWidth: number;
  caption: string;
  columnIndex: number;
}

export default function useResizableHeader({ currentWidth, caption, columnIndex }: IResizableBox) {
  const { gridRef, onResizeHeaderColumn } = useTableVirtual();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [resizableWidth, setResizableWidth] = useState<number>(Number(currentWidth) || 180);

  useEffect(() => {
    if (resizableWidth === Number(currentWidth)) return;
    gridRef?.current?.resetAfterColumnIndex(columnIndex, false);
    onResizeHeaderColumn?.(caption, resizableWidth);
  }, [resizableWidth]);

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
