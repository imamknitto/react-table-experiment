import { VariableSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { memo, useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';

import { ITableVirtual } from './types';
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
  const defferedHeaders = useDeferredValue(headers);

  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);

  const { freezedHeaders, nonFreezedHeaders, handleResizeHeaderColumn } = useGenerateHeaders({
    headers: defferedHeaders,
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

  const contextValue = useMemo(
    () => ({
      gridRef,
      columnWidth,
      rowHeight,
      stickyHeaderHeight,
      stickyFooterHeight,
      freezedHeaders,
      nonFreezedHeaders,
      finalDataSource: (searchedData || []) as Record<string, string | number>[],
      isLoading,
      useAutoWidth,
      useFooter,
      onClickRow: handleClickRow,
      selectedRowIndex,
      classNameCell,
      onResizeHeaderColumn: handleResizeHeaderColumn,
      renderRightClickRow,
      sort: { sortKey, sortBy, handleSort },
      totalCountColumnAllHeaders: defferedHeaders?.filter(({ isHide }) => !isHide).length || 0,
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
    }),
    [
      gridRef,
      columnWidth,
      defferedHeaders,
      rowHeight,
      stickyHeaderHeight,
      stickyFooterHeight,
      freezedHeaders,
      nonFreezedHeaders,
      searchedData,
      isLoading,
      useAutoWidth,
      useFooter,
      handleClickRow,
      selectedRowIndex,
      classNameCell,
      handleResizeHeaderColumn,
      renderRightClickRow,
      sortKey,
      sortBy,
      handleSort,
      isFilterCardOpen,
      handleOpenFilter,
      filterCardRef,
      filterCardPosition,
      updateFilter,
      resetFilter,
      activeFilters,
      isFilterAdvanceCardOpen,
      handleOpenAdvanceFilter,
      filterAdvanceCardRef,
      filterAdvanceCardPosition,
      applyAdvanceFilter,
      resetAdvanceFilter,
      activeAdvanceFilters,
      isSearchCardOpen,
      handleOpenSearch,
      searchCardRef,
      searchCardPosition,
      updateSearch,
      resetSearch,
      activeSearch,
    ]
  );

  return (
    <TableVirtualProvider value={contextValue}>
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
