import AutoSizer from 'react-virtualized-auto-sizer';

import { ITableVirtual, ITableVirtualHeaderColumn } from './types';
import TableVirtualProvider from './service/table-virtual-provider';
import useFilterAdvanceTable from './hooks/use-filter-advance-table';
import useFilterTable from './hooks/use-filter-table';
import useSearchTable from './hooks/use-search-table';
import useSortTable from './hooks/use-sort-table';
import TableVirtualStickyGrid from './table-virtual-sticky-grid';
import TableVirtualCell from './table-virtual-cell';
import { useMemo } from 'react';
import TableVirtualLoading from './table-virtual-loading';
import TableVirtualEmptyData from './table-virtual-empty-data';

export default function TableVirtual<T>({
  dataSource,
  headers,
  columnWidth = 180,
  rowHeight = 36,
  stickyrowHeaderHeight = 50,
  stickyFooterHeight = 40,
  useAutoWidth = false,
  useFooter,
  isLoading,
  onChangeAdvanceFilter,
  onChangeFilter,
  onChangeSort,
}: ITableVirtual<T>) {
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
  const freezedHeaders = useMemo(() => mappedHeaders?.filter(({ freezed }) => freezed), [mappedHeaders]);
  const nonFreezedHeaders = useMemo(() => mappedHeaders?.filter(({ freezed }) => !freezed), [mappedHeaders]);

  const { sortedData, handleSort, sortKey, sortBy } = useSortTable({
    data: dataSource || [],
    onChangeSort,
    useServerSort: false,
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
    data: sortedData || [],
    onChangeFilter,
    useServerFilter: false,
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
    data: filteredData || [],
    onChangeAdvanceFilter,
    useServerAdvanceFilter: false,
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
    data: filteredAdvanceData || [],
  });

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
        selectedRowIndex: -1,
        useAutoWidth,
        useFooter,
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
      <div className="border border-gray-300 size-full relative">
        <AutoSizer>
          {({ width, height }) => {
            return (
              <TableVirtualStickyGrid width={width} height={height}>
                {({ columnIndex, rowIndex, style }) => (
                  <TableVirtualCell rowIndex={rowIndex} columnIndex={columnIndex} style={style} />
                )}
              </TableVirtualStickyGrid>
            );
          }}
        </AutoSizer>

        {isLoading && <TableVirtualLoading />}

        {!searchedData?.length && !isLoading && <TableVirtualEmptyData />}
      </div>
    </TableVirtualProvider>
  );
}
