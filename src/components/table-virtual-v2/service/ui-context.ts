import { createContext, ReactNode, useContext } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import { ICellPosition } from '../types';
import { HEADER_FILTER_HEIGHT } from '../constants';

export interface IUIContext {
  gridRef?: React.RefObject<Grid | null>;
  isLoading?: boolean;
  stickyHeaderHeight: number;
  stickyFooterHeight: number;
  columnWidth: number;
  useAutoWidth?: boolean;
  adjustedColumnWidth: number;
  rowHeight: number;
  useFooter?: boolean;
  selectedRowIndex?: number;
  scrollbarWidth: number;
  isScrolling?: boolean;
  setIsScrolling?: React.Dispatch<React.SetStateAction<boolean>>;
  setScrollbarWidth?: React.Dispatch<React.SetStateAction<number>>;
  outerSize: { width: number; height: number };
  setOuterSize?: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
  setAdjustedColumnWidth?: React.Dispatch<React.SetStateAction<number>>;
  showHeaderFilter?: boolean;
  headerFilterHeight: number;
  onToggleHeaderFilter?: () => void;
  onClickGridRow?: (data: Record<string, string | number>, rowIndex: number) => void;
  classNameCell?: (
    data: Record<string, string | number>,
    rowIndex: number,
    columnIndex: number,
    isFreezed: boolean
  ) => string;
  cellPosition?: ICellPosition | null;
  onRightClickCell?: (cellPosition: ICellPosition | null) => void;
  renderRightClickRow?: (
    data: Record<string, string | number> | null,
    value: string | number,
    callbackFn?: () => void
  ) => ReactNode | string;
}

export const UIContext = createContext<IUIContext>({
  columnWidth: 180,
  rowHeight: 36,
  stickyHeaderHeight: 50,
  stickyFooterHeight: 36,
  adjustedColumnWidth: 180,
  isLoading: false,
  selectedRowIndex: -1,
  outerSize: { width: 0, height: 0 },
  scrollbarWidth: 0,
  headerFilterHeight: HEADER_FILTER_HEIGHT,
});

export const useUIContext = () => useContext(UIContext);
