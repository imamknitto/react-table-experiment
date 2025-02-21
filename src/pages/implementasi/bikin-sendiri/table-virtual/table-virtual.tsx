import AutoSizer from 'react-virtualized-auto-sizer';
import { memo, useMemo } from 'react';
import TableVirtualColumn from './table-virtual-column';
import { ITableVirtualHeaderColumn, ITableVirtual } from './types';
import { TableVirtualStickyGrid } from './table-virtual-sticky-grid';

const TableVirtual = <TDataSource,>({
  dataSource,
  headers,
  rowHeight = 36,
  rowHeaderHeight = 36,
  columnWidth = 180,
  onChangeFilter,
  onChangeSort,
  useServerFilter,
  useServerSort,
  onClickRow,
  activeRowIndex,
  isLoading,
  onScrollTouchBottom,
}: ITableVirtual<TDataSource>) => {
  const reMapHeaders = headers?.map((data, idx) => ({
    width: columnWidth,
    height: rowHeaderHeight,
    left: idx * columnWidth,
    useFilter: data.useFilter || true,
    useSort: data.useSort || true,
    useSearch: data.useSearch || true,
    useSingleFilter: data.useSingleFilter || false,
    ...data,
  })) as ITableVirtualHeaderColumn[];

  const dataSourceExceptFreezed = useMemo(() => {
    const freezedHeaderKeys = headers?.filter((item) => item.freezed).map(({ key }) => key) as string[];

    return dataSource?.map((item) => {
      return Object.fromEntries(
        Object.entries(item as Record<string, string | number>).filter(([key]) => !freezedHeaderKeys.includes(key))
      );
    });
  }, [headers]);

  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <TableVirtualStickyGrid
            className="border border-gray-300 parent-grid"
            height={height}
            width={width}
            columnCount={21}
            rowCount={dataSourceExceptFreezed?.length || 0}
            rowHeight={rowHeight}
            columnWidth={columnWidth}
            stickyHeight={rowHeaderHeight}
            stickyWidth={columnWidth}
            headers={reMapHeaders}
            dataSource={(dataSource || []) as Record<string, string | number>[]}
            onChangeFilter={onChangeFilter}
            onChangeSort={onChangeSort}
            useServerFilter={useServerFilter}
            useServerSort={useServerSort}
            isLoading={isLoading}
            onScrollTouchBottom={onScrollTouchBottom}
          >
            {({ columnIndex, rowIndex, style }) => {
              return (
                <TableVirtualColumn
                  columnIndex={columnIndex}
                  rowIndex={rowIndex}
                  style={style}
                  activeRowIndex={activeRowIndex}
                  onClickRow={onClickRow}
                />
              );
            }}
          </TableVirtualStickyGrid>
        );
      }}
    </AutoSizer>
  );
};

export default memo(TableVirtual) as typeof TableVirtual;
