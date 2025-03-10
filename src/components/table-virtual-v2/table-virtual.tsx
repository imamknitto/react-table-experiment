import { VariableSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { memo, useCallback, useRef, useState } from 'react';

import { ITableVirtual, ICellPosition } from './types';
import TableVirtualProvider from './service/table-virtual-provider';
import useFilterAdvanceTable from './hooks/use-filter-advance-table';
import useGridScrolling from './hooks/use-grid-scrolling';
import useFilterTable from './hooks/use-filter-table';
import useSearchTable from './hooks/use-search-table';
import useSortTable from './hooks/use-sort-table';
import TableVirtualStickyGrid from './table-virtual-sticky-grid';
import TableVirtualLoading from './table-virtual-loading';
import { useGenerateHeaders } from './hooks/use-generate-headers';

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

  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
  const [cellPosition, setCellPosition] = useState<ICellPosition | null>(null);

  const { freezedHeaders, nonFreezedHeaders, handleResizeHeaderColumn } = useGenerateHeaders({
    headers,
    columnWidth,
    stickyHeaderHeight,
  });

  const { sortedData, handleSort, sortKey, sortBy } = useSortTable({
    data: dataSource || [],
    onChangeSort,
    useServerSort,
  });

  const {
    filteredData,
    isFilterCardOpen,
    handleOpenFilter,
    filterCardRef,
    filterCardPosition,
    updateFilter,
    resetFilter,
    activeFilters,
  } = useFilterTable({
    gridRef,
    data: sortedData || [],
    onChangeFilter,
    useServerFilter,
  });

  const {
    filteredAdvanceData,
    filterAdvanceCardRef,
    isFilterAdvanceCardOpen,
    handleOpenAdvanceFilter,
    filterAdvanceCardPosition,
    applyAdvanceFilter,
    resetAdvanceFilter,
    activeAdvanceFilters,
  } = useFilterAdvanceTable({
    gridRef,
    data: filteredData || [],
    onChangeAdvanceFilter,
    useServerAdvanceFilter,
  });

  const {
    searchedData,
    isSearchCardOpen,
    handleOpenSearch,
    searchCardRef,
    searchCardPosition,
    updateSearch,
    resetSearch,
    activeSearch,
  } = useSearchTable({
    gridRef,
    data: filteredAdvanceData || [],
  });

  const { handleScroll } = useGridScrolling({
    gridRef,
    finalDataSource: (searchedData || []) as Record<string, string | number>[],
    isLoading,
    rowHeight,
    onScrollTouchBottom,
  });

  const handleClickRow = useCallback((data: Record<string, string | number>, rowIndex: number) => {
    if (!onClickRow) return;
    setSelectedRowIndex(rowIndex);
    onClickRow?.(data, rowIndex);
  }, []);

  const handleRightClickCell = useCallback((position: ICellPosition | null) => {
    setCellPosition(position);
  }, []);

  return (
    <TableVirtualProvider
      gridRef={gridRef}
      value={{
        gridRef,
        columnWidth: columnWidth,
        rowHeight: rowHeight,
        stickyHeaderHeight: stickyHeaderHeight,
        stickyFooterHeight: stickyFooterHeight,
        freezedHeaders,
        nonFreezedHeaders,
        finalDataSource: (searchedData || []) as Record<string, string | number>[],
        isLoading,
        useAutoWidth,
        useFooter,
        onClickRow: handleClickRow,
        selectedRowIndex,
        classNameCell,
        cellPosition,
        onResizeHeaderColumn: handleResizeHeaderColumn,
        onRightClickCell: handleRightClickCell,
        renderRightClickRow,
        sort: {
          sortKey,
          sortBy,
          handleSort,
        },
        filter: {
          isFilterCardOpen,
          handleOpenFilter,
          filterCardRef,
          filterCardPosition,
          updateFilter,
          resetFilter,
          activeFilters,
        },
        filterAdvance: {
          isFilterAdvanceCardOpen,
          handleOpenAdvanceFilter,
          filterAdvanceCardRef,
          filterAdvanceCardPosition,
          applyAdvanceFilter,
          resetAdvanceFilter,
          activeAdvanceFilters,
        },
        search: {
          isSearchCardOpen,
          handleOpenSearch,
          searchCardRef,
          searchCardPosition,
          updateSearch,
          resetSearch,
          activeSearch,
        },
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
                onGridScroll={handleScroll}
              />
            );
          }}
        </AutoSizer>

        {isLoading && <TableVirtualLoading />}
      </div>
    </TableVirtualProvider>
  );
};

export default memo(TableVirtual) as typeof TableVirtual;
