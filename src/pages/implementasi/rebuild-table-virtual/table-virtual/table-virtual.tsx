import { VariableSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useRef, useState } from 'react';

import { IDataHeader, ITableVirtualContext, ITableVirtualHeaderColumn } from './types';
import TableVirtualProvider from './service/table-virtual-provider';
import TableVirtualStickyGrid from './table-virtual-sticky-grid';
import TableVirtualCell from './table-virtual-cell';

interface Props<T> {
  dataSource?: T[];
  headers?: IDataHeader<T>[];
  columnWidth?: number;
  rowHeight?: number;
  stickyrowHeaderHeight?: number;
  stickyFooterHeight?: number;
  useAutoWidth?: boolean;
}

export default function TableVirtual<T>({
  dataSource,
  headers,
  columnWidth = 180,
  rowHeight = 36,
  stickyrowHeaderHeight = 50,
  stickyFooterHeight = 40,
  useAutoWidth = false,
}: Props<T>) {
  const gridRef = useRef<Grid>(null);

  const [adjustedColumnWidth, setAdjustedColumnWidth] = useState(columnWidth);

  const mappedHeaders = headers?.map((data, idx) => ({
    width: columnWidth,
    height: stickyrowHeaderHeight,
    left: idx * columnWidth,
    useFilter: data.useFilter || true,
    useSort: data.useSort || true,
    useSearch: data.useSearch || true,
    useSingleFilter: data.useSingleFilter || false,
    ...data,
  })) as ITableVirtualHeaderColumn[];

  const contextValue: ITableVirtualContext = {
    adjustedColumnWidth,
    setAdjustedColumnWidth,
    columnWidth: columnWidth,
    rowHeight: rowHeight,
    stickyHeaderHeight: stickyrowHeaderHeight,
    stickyFooterHeight: stickyFooterHeight,
    headers: mappedHeaders || [],
    finalDataSource: (dataSource || []) as Record<string, string | number>[],
    isLoading: false,
    freezedHeaders: [],
    selectedRowIndex: -1,
    useAutoWidth,
  };

  return (
    <TableVirtualProvider value={contextValue}>
      <div className="border size-full relative">
        <AutoSizer>
          {({ width, height }) => {
            return (
              <TableVirtualStickyGrid gridRef={gridRef} width={width} height={height}>
                {({ columnIndex, rowIndex, style }) => (
                  <TableVirtualCell rowIndex={rowIndex} columnIndex={columnIndex} style={style} />
                )}
              </TableVirtualStickyGrid>
            );
          }}
        </AutoSizer>
      </div>
    </TableVirtualProvider>
  );
}
