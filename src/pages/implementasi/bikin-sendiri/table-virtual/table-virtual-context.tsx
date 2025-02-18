import { createContext, useContext } from 'react';
import { ITableVirtualContext } from './types';

export const TableVirtualContext = createContext<ITableVirtualContext>({
  columnWidth: 180,
  rowHeight: 36,
  stickyHeight: 50,
  stickyWidth: 180,
  headers: [],
  finalDataSource: [],
});

export const useTableVirtual = () => useContext(TableVirtualContext);
TableVirtualContext.displayName = 'TableVirtualContext';
