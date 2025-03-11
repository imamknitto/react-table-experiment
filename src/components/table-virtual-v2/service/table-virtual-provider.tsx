import { useCallback, useMemo, useState } from 'react';
import { ICellPosition, ITableVierualProvider } from '../types';
import { TableVirtualContext } from './table-virtual-context';

const TableVirtualProvider = ({ children, value }: ITableVierualProvider) => {
  const [adjustedColumnWidth, setAdjustedColumnWidth] = useState(value.columnWidth);
  const [outerSize, setOuterSize] = useState({ width: 0, height: 0 });
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [cellPosition, setCellPosition] = useState<ICellPosition | null>(null);

  // Hitung total maksimal lebar grid berdasarkan total lebar tiap kolom headers.
  const totalCountGridWidth = useMemo(() => {
    const allHeaders = [...(value.freezedHeaders || []), ...(value.nonFreezedHeaders || [])];
    return allHeaders?.reduce((prev, curr) => prev + (curr.fixedWidth || curr.width), 0);
  }, [value.freezedHeaders, value.nonFreezedHeaders]);

  // Hitung total lebar kolom headers yang di freezed.
  const totalCountFreezedHeadersWidth = useMemo(() => {
    return value.freezedHeaders?.reduce((prev, curr) => prev + (curr.fixedWidth || curr.width), 0);
  }, [value.freezedHeaders]);

  const handleRightClickCell = useCallback((position: ICellPosition | null) => {
    setCellPosition(position);
  }, []);

  return (
    <TableVirtualContext.Provider
      value={{
        ...value,
        setAdjustedColumnWidth,
        adjustedColumnWidth,
        outerSize,
        setOuterSize,
        scrollbarWidth,
        setScrollbarWidth,
        isScrolling,
        setIsScrolling,
        totalCountGridWidth,
        totalCountFreezedHeadersWidth,
        cellPosition,
        onRightClickCell: handleRightClickCell,
      }}
    >
      {children}
    </TableVirtualContext.Provider>
  );
};

export default TableVirtualProvider;
