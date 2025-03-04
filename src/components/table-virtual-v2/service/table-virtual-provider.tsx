import { useMemo, useState } from 'react';
import { ITableVierualProvider } from '../types';
import { TableVirtualContext } from './table-virtual-context';

const TableVirtualProvider = ({ children, value }: ITableVierualProvider) => {
  const [adjustedColumnWidth, setAdjustedColumnWidth] = useState(value.columnWidth);
  const [outerSize, setOuterSize] = useState({ width: 0, height: 0 });
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  const headersMemoized = useMemo(
    () => ({
      freezedHeaders: value.freezedHeaders,
      nonFreezedHeaders: value.nonFreezedHeaders,
    }),
    [value.freezedHeaders, value.nonFreezedHeaders]
  );

  return (
    <TableVirtualContext.Provider
      value={{
        ...value,
        ...headersMemoized,
        setAdjustedColumnWidth,
        adjustedColumnWidth,
        outerSize,
        setOuterSize,
        scrollbarWidth,
        setScrollbarWidth,
        isScrolling,
        setIsScrolling,
      }}
    >
      {children}
    </TableVirtualContext.Provider>
  );
};

export default TableVirtualProvider;
