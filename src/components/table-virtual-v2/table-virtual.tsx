import { VariableSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { memo, useRef } from 'react';

import { ITableVirtual } from './types';
import TableVirtualStickyGrid from './table-virtual-sticky-grid';
import TableVirtualLoading from './table-virtual-loading';
import HeaderProvider from './service/header-provider';
import DataProvider from './service/data-provider';
import UIProvider from './service/ui-provider';

const TableVirtual = <T,>(props: ITableVirtual<T>) => {
  const {
    dataSource,
    headers,
    columnWidth = 180,
    rowHeight = 36,
    stickyHeaderHeight = 50,
    stickyFooterHeight = 40,
    useAutoWidth = false,
    useFooter,
    useServerSort,
    useServerFilter,
    useServerAdvanceFilter,
    isLoading,
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

  return (
    <HeaderProvider
      headers={headers || []}
      columnWidth={columnWidth}
      stickyHeaderHeight={stickyHeaderHeight}
    >
      <DataProvider
        gridRef={gridRef}
        dataSource={dataSource || []}
        useServerSort={useServerSort}
        useServerFilter={useServerFilter}
        useServerAdvanceFilter={useServerAdvanceFilter}
        onChangeSort={onChangeSort}
        onChangeFilter={onChangeFilter}
        onChangeAdvanceFilter={onChangeAdvanceFilter}
      >
        <UIProvider
          columnWidth={columnWidth}
          onClickRow={onClickRow}
          parentValue={{
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
          }}
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
        </UIProvider>
      </DataProvider>
    </HeaderProvider>
  );
};

export default memo(TableVirtual) as typeof TableVirtual;
