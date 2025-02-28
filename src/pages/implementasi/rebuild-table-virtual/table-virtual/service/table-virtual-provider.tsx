import { useState } from 'react';
import { ITableVirtualContext } from '../types';
import { TableVirtualContext } from './table-virtual-context';

interface ITableVierualProvider {
  children: React.ReactNode;
  value: Omit<ITableVirtualContext, 'setAdjustedColumnWidth' | 'adjustedColumnWidth' | 'outerSize' | 'setOuterSize'>;
}

const TableVirtualProvider = ({ children, value }: ITableVierualProvider) => {
  const [adjustedColumnWidth, setAdjustedColumnWidth] = useState(value.columnWidth);
  const [outerSize, setOuterSize] = useState({ width: 0, height: 0 });

  return (
    <TableVirtualContext.Provider
      value={{ ...value, setAdjustedColumnWidth, adjustedColumnWidth, outerSize, setOuterSize }}
    >
      {children}
    </TableVirtualContext.Provider>
  );
};

export default TableVirtualProvider;
