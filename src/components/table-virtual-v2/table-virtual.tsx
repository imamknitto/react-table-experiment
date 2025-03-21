import { VariableSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { memo, useMemo, useRef } from 'react';

import { ITableVirtual } from './types';
import TableVirtualStickyGrid from './table-virtual-sticky-grid';
import TableVirtualLoading from './table-virtual-loading';
import HeaderProvider from './service/header-provider';
import DataProvider from './service/data-provider';
import UIProvider from './service/ui-provider';
import { MINIMUM_ROW_HEIGHT } from './constants';

const TableVirtual = <T,>(props: ITableVirtual<T>) => {
  const {
    dataSource,
    headers,
    columnWidth = 180,
    rowHeight = MINIMUM_ROW_HEIGHT,
    stickyHeaderHeight = 50,
    stickyFooterHeight = 40,
    useAutoWidth = false,
    useFooter,
    useServerSort,
    useServerFilter,
    useServerAdvanceFilter,
    useServerSearch,
    useColumnHiddenIndicator,
    isLoading,
    onChangeSearch,
    onChangeAdvanceFilter,
    onChangeFilter,
    onChangeSort,
    onScrollTouchBottom,
    onClickRow,
    classNameCell,
    renderRightClickRow,
  } = props;

  const gridRef = useRef<Grid>(null);
  const outerRef = useRef<HTMLElement>(null);

  const memoizedHeaders = useMemo(() => headers || [], [headers]);
  const memoizedDataSource = useMemo(() => dataSource || [], [dataSource]);
  const memoizedParentValue = useMemo(
    () => ({
      gridRef,
      columnWidth,
      rowHeight,
      stickyHeaderHeight,
      stickyFooterHeight,
      isLoading,
      useAutoWidth,
      useFooter,
      classNameCell,
      renderRightClickRow,
      useColumnHiddenIndicator,
    }),
    [props]
  );

  return (
    <UIProvider columnWidth={columnWidth} onClickRow={onClickRow} parentValue={memoizedParentValue}>
      <HeaderProvider headers={memoizedHeaders || []} stickyHeaderHeight={stickyHeaderHeight}>
        <DataProvider
          gridRef={gridRef}
          dataSource={memoizedDataSource || []}
          useServerSort={useServerSort}
          useServerFilter={useServerFilter}
          useServerAdvanceFilter={useServerAdvanceFilter}
          useServerSearch={useServerSearch}
          onChangeSort={onChangeSort}
          onChangeFilter={onChangeFilter}
          onChangeAdvanceFilter={onChangeAdvanceFilter}
          onChangeSearch={onChangeSearch}
        >
          <div className="size-full relative">
            <AutoSizer>
              {({ width, height }) => {
                return (
                  <TableVirtualStickyGrid
                    width={width}
                    height={height}
                    gridRef={gridRef}
                    outerRef={outerRef}
                    onScrollTouchBottom={onScrollTouchBottom}
                  />
                );
              }}
            </AutoSizer>

            {isLoading && <TableVirtualLoading />}
          </div>
        </DataProvider>
      </HeaderProvider>
    </UIProvider>
  );
};

export default memo(TableVirtual) as typeof TableVirtual;
