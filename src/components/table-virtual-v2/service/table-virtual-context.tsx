import { createContext, useContext } from 'react';
import { ITableVirtualContext } from '../types';

export const TableVirtualContext = createContext<ITableVirtualContext>({
  columnWidth: 180,
  rowHeight: 36,
  stickyHeaderHeight: 50,
  stickyFooterHeight: 36,
  adjustedColumnWidth: 180,
  nonFreezedHeaders: [],
  finalDataSource: [],
  isLoading: false,
  freezedHeaders: [],
  selectedRowIndex: -1,
  outerSize: { width: 0, height: 0 },
  scrollbarWidth: 0,
});

export const useTableVirtual = () => useContext(TableVirtualContext);
