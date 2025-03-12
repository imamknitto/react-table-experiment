import { ReactNode, useCallback, useMemo, useState } from 'react';
import { IUIContext, UIContext } from './ui-context';
import { ICellPosition } from '../types';

interface IUIProvider {
  children: ReactNode;
  columnWidth: number;
  onClickRow?: (data: Record<string, string | number>, rowIndex: number) => void;
  parentValue: Pick<
    IUIContext,
    | 'gridRef'
    | 'columnWidth'
    | 'rowHeight'
    | 'stickyHeaderHeight'
    | 'stickyFooterHeight'
    | 'useFooter'
    | 'useAutoWidth'
    | 'isLoading'
    | 'classNameCell'
    | 'renderRightClickRow'
  >;
}

const UIProvider = (props: IUIProvider) => {
  const { children, columnWidth, onClickRow, parentValue } = props;

  const [adjustedColumnWidth, setAdjustedColumnWidth] = useState(columnWidth);
  const [outerSize, setOuterSize] = useState({ width: 0, height: 0 });
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [cellPosition, setCellPosition] = useState<ICellPosition | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);

  const handleRightClickCell = useCallback((position: ICellPosition | null) => {
    setCellPosition(position);
  }, []);

  const handleClickGridRow = useCallback(
    (data: Record<string, string | number>, rowIndex: number) => {
      if (!onClickRow) return;
      setSelectedRowIndex(rowIndex);
      onClickRow?.(data, rowIndex);
    },
    []
  );

  const contextValue = useMemo(
    (): IUIContext => ({
      adjustedColumnWidth,
      setAdjustedColumnWidth,
      outerSize,
      setOuterSize,
      scrollbarWidth,
      setScrollbarWidth,
      isScrolling,
      setIsScrolling,
      cellPosition,
      selectedRowIndex,
      onRightClickCell: handleRightClickCell,
      onClickGridRow: handleClickGridRow,
      ...parentValue,
    }),
    [
      adjustedColumnWidth,
      outerSize,
      scrollbarWidth,
      isScrolling,
      cellPosition,
      selectedRowIndex,
      parentValue,
    ]
  );

  return <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>;
};

export default UIProvider;
