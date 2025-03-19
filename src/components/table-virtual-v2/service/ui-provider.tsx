import { ReactNode, useCallback, useMemo, useState } from 'react';
import { IUIContext, UIContext } from './ui-context';
import { ICellPosition } from '../types';
import { HEADER_FILTER_HEIGHT, MINIMUM_ROW_HEIGHT } from '../constants';

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
    | 'useColumnHiddenIndicator'
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
  const [showHeaderFilter, setShowHeaderFilter] = useState<boolean>(true);
  const [headerFilterHeight, setHeaderFilterHeight] = useState<number>(HEADER_FILTER_HEIGHT);

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

  const handleToggleHeaderFilter = useCallback(() => {
    setShowHeaderFilter((prev) => !prev);
    setHeaderFilterHeight((prev) => (prev === 0 ? HEADER_FILTER_HEIGHT : 0));
  }, []);

  const finalStickyHeaderHeight =
    (parentValue.stickyHeaderHeight < MINIMUM_ROW_HEIGHT
      ? MINIMUM_ROW_HEIGHT
      : parentValue.stickyHeaderHeight) + headerFilterHeight;

  const contextValue = useMemo(
    (): IUIContext => ({
      headerFilterHeight,
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
      showHeaderFilter,
      onRightClickCell: handleRightClickCell,
      onClickGridRow: handleClickGridRow,
      onToggleHeaderFilter: handleToggleHeaderFilter,
      ...parentValue,
      stickyHeaderHeight: finalStickyHeaderHeight,
    }),
    [
      headerFilterHeight,
      showHeaderFilter,
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
