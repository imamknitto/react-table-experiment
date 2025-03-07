import { VariableSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useCallback, useMemo, useRef, useState } from 'react';

import { ITableVirtual, ITableVirtualHeaderColumn } from './types';
import TableVirtualProvider from './service/table-virtual-provider';
import useFilterAdvanceTable from './hooks/use-filter-advance-table';
import useGridScrolling from './hooks/use-grid-scrolling';
import useFilterTable from './hooks/use-filter-table';
import useSearchTable from './hooks/use-search-table';
import useSortTable from './hooks/use-sort-table';
import TableVirtualStickyGrid from './table-virtual-sticky-grid';
import TableVirtualLoading from './table-virtual-loading';
import TableVirtualCell from './table-virtual-cell';

export default function TableVirtual<T>(props: ITableVirtual<T>) {
  const {
    dataSource,
    headers,
    columnWidth = 180,
    rowHeight = 36,
    stickyrowHeaderHeight = 50,
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
  } = props;

  const gridRef = useRef<Grid>(null);
  const outerRef = useRef<HTMLElement>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);

  const { freezedHeaders, nonFreezedHeaders } = useMemo(() => {
    const freezed: ITableVirtualHeaderColumn[] = [];
    const nonFreezed: ITableVirtualHeaderColumn[] = [];

    headers?.forEach((data, idx) => {
      const header = {
        ...data,
        width: columnWidth,
        height: stickyrowHeaderHeight,
        left: idx * columnWidth,
        useFilter: data.useFilter ?? true,
        useSort: data.useSort ?? true,
        useSearch: data.useSearch ?? true,
        useSingleFilter: data.useSingleFilter ?? false,
      };

      if (header.freezed) {
        freezed.push(header as ITableVirtualHeaderColumn);
      } else {
        nonFreezed.push(header as ITableVirtualHeaderColumn);
      }
    });

    return { freezedHeaders: freezed, nonFreezedHeaders: nonFreezed };
  }, [headers, columnWidth, stickyrowHeaderHeight]);

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

  return (
    <TableVirtualProvider
      value={{
        columnWidth: columnWidth,
        rowHeight: rowHeight,
        stickyHeaderHeight: stickyrowHeaderHeight,
        stickyFooterHeight: stickyFooterHeight,
        freezedHeaders,
        nonFreezedHeaders,
        finalDataSource: (searchedData || []) as Record<string, string | number>[],
        isLoading,
        useAutoWidth,
        useFooter,
        onClickRow: handleClickRow,
        selectedRowIndex,
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
              >
                {({ columnIndex, rowIndex, style }) => (
                  <TableVirtualCell rowIndex={rowIndex} columnIndex={columnIndex} style={style} />
                )}
              </TableVirtualStickyGrid>
            );
          }}
        </AutoSizer>

        {isLoading && <TableVirtualLoading />}
      </div>
    </TableVirtualProvider>
  );
}
