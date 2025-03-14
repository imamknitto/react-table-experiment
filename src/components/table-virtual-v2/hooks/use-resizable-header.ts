import { useCallback, useRef, useState } from 'react';
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
  const { onResizeHeaderColumn } = useHeaderContext();

  const { gridRef } = useUIContext();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [resizableWidth, setResizableWidth] = useState<number>(Number(currentWidth) || 180);
  const [isTempResize, setIsTempResize] = useState<boolean>(false);
  const resizableWidthRef = useRef(resizableWidth);

  const handleMouseDown = () => {
    if (!boxRef.current) return;
    boxRef.current.requestPointerLock();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setIsTempResize(true);

    setResizableWidth((prevWidth) => {
      const newWidth = Math.max(180, prevWidth + e.movementX);
      resizableWidthRef.current = newWidth;
      return newWidth;
    });
  }, []);

  const handleMouseUp = () => {
    onResizeHeaderColumn?.(caption, resizableWidthRef.current);
    gridRef?.current?.resetAfterColumnIndex(isFreezed ? 0 : columnIndex, false);

    setIsTempResize(false);
    document.exitPointerLock();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return { boxRef, handleMouseDown, resizableWidth, isTempResize };
}
