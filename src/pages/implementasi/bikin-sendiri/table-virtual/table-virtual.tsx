import AutoSizer from 'react-virtualized-auto-sizer';
import { memo, useMemo } from 'react';
import { ITableVirtualHeaderColumn, ITableVirtual } from './types';
import { TableVirtualStickyGrid } from './table-virtual-sticky-grid';
import TableVirtualLoading from './table-virtual-loading';
import TableVirtualColumn from './table-virtual-column';

const TableVirtual = <TDataSource,>({
  dataSource,
  headers,
  rowHeight = 36,
  rowHeaderHeight = 36,
  columnWidth = 180,
  rowFooterHeight = 36,
  onChangeFilter,
  onChangeAdvanceFilter,
  onChangeSort,
  useServerFilter,
  useServerAdvanceFilter,
  useServerSort,
  useFooter,
  onClickRow,
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
    <div className="size-full relative">
      <AutoSizer>
        {({ width, height }) => {
          return (
            <TableVirtualStickyGrid
              height={height}
              width={width}
              columnCount={0}
              rowCount={dataSourceExceptFreezed?.length || 0}
              rowHeight={rowHeight}
              columnWidth={columnWidth}
              stickyHeight={rowHeaderHeight}
              stickyFooterHeight={rowFooterHeight}
              stickyWidth={columnWidth}
              headers={reMapHeaders}
              dataSource={(dataSource || []) as Record<string, string | number>[]}
              onChangeFilter={onChangeFilter}
              onChangeAdvanceFilter={onChangeAdvanceFilter}
              onChangeSort={onChangeSort}
              useServerFilter={useServerFilter}
              useServerAdvanceFilter={useServerAdvanceFilter}
              useServerSort={useServerSort}
              useFooter={useFooter}
              isLoading={isLoading}
              onScrollTouchBottom={onScrollTouchBottom}
              onClickRow={onClickRow}
            >
              {({ columnIndex, rowIndex, style }) => {
                return (
                  <TableVirtualColumn
                    columnIndex={columnIndex}
                    rowIndex={rowIndex}
                    style={style}
                    onClickRow={onClickRow}
                  />
                );
              }}
            </TableVirtualStickyGrid>
          );
        }}
      </AutoSizer>

      {isLoading && <TableVirtualLoading />}
    </div>
  );
};

export default memo(TableVirtual) as typeof TableVirtual;
