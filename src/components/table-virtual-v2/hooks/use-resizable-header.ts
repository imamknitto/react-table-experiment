import { useCallback, useEffect, useRef, useState } from 'react';
import { useHeaderContext } from '../service/header-context';
import { useUIContext } from '../service/ui-context';

interface IResizableBox {
  currentWidth: number;
  caption: string;
  columnIndex: number;
  isFreezed: boolean;
}

export default function useResizableHeader(props: IResizableBox) {
  const { currentWidth, caption, columnIndex, isFreezed } = props;

  const { gridRef } = useUIContext();
  const { onResizeHeaderColumn } = useHeaderContext();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [resizableWidth, setResizableWidth] = useState<number>(Number(currentWidth) || 180);

  useEffect(() => {
    if (resizableWidth === Number(currentWidth)) return;
    onResizeHeaderColumn?.(caption, resizableWidth);
    gridRef?.current?.resetAfterColumnIndex(isFreezed ? 0 : columnIndex, false);
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
