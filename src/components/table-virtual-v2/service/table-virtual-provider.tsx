import { useCallback, useEffect, useMemo, useState } from 'react';
import { ITableVierualProvider, ITableVirtualHeaderColumn } from '../types';
import { TableVirtualContext } from './table-virtual-context';

const TableVirtualProvider = ({ children, value, gridRef }: ITableVierualProvider) => {
  const [adjustedColumnWidth, setAdjustedColumnWidth] = useState(value.columnWidth);
  const [outerSize, setOuterSize] = useState({ width: 0, height: 0 });
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  const [freezedHeaders, setFreezedHeaders] = useState<ITableVirtualHeaderColumn[]>(value.freezedHeaders || []);
  const [nonFreezedHeaders, setNonFreezedHeaders] = useState<ITableVirtualHeaderColumn[]>(
    value.nonFreezedHeaders || []
  );

  useEffect(() => {
    if (JSON.stringify(freezedHeaders) !== JSON.stringify(value.freezedHeaders)) {
      setFreezedHeaders(value.freezedHeaders);
    }
    if (JSON.stringify(nonFreezedHeaders) !== JSON.stringify(value.nonFreezedHeaders)) {
      setNonFreezedHeaders(value.nonFreezedHeaders);
    }
  }, [value.freezedHeaders, value.nonFreezedHeaders]);

  const headersMemoized = useMemo(() => ({ freezedHeaders, nonFreezedHeaders }), [freezedHeaders, nonFreezedHeaders]);

  // Hitung total maksimal lebar grid berdasarkan total lebar tiap kolom headers.
  const totalCountGridWidth = useMemo(() => {
    const allHeaders = [...(freezedHeaders || []), ...(nonFreezedHeaders || [])];
    return allHeaders?.reduce((prev, curr) => prev + (curr.fixedWidth || curr.width), 0);
  }, [freezedHeaders, nonFreezedHeaders]);

  // Hitung total lebar kolom headers yang di freezed.
  const totalCountFreezedHeadersWidth = useMemo(() => {
    return freezedHeaders?.reduce((prev, curr) => prev + (curr.fixedWidth || curr.width), 0);
  }, [freezedHeaders]);

  const handleResizeHeaderColumn = useCallback(
    (isFreezedHeader: boolean, columnIndex: number, newWidth: number) => {
      gridRef.current?.resetAfterColumnIndex(columnIndex);

      // Pilih setter berdasarkan tipe header (freezed / nonFreezed)
      const setHeaders = isFreezedHeader ? setFreezedHeaders : setNonFreezedHeaders;

      setHeaders((prev) =>
        prev.map((col, i) => (i === columnIndex ? { ...col, fixedWidth: newWidth, width: newWidth } : col))
      );
    },
    [gridRef]
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
        totalCountGridWidth,
        totalCountFreezedHeadersWidth,
        onResizeHeaderColumn: handleResizeHeaderColumn,
      }}
    >
      {children}
    </TableVirtualContext.Provider>
  );
};

export default TableVirtualProvider;
