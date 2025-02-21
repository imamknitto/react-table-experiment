import { useCallback, useMemo, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import clsx from 'clsx';
import { ITableVirtualStickyGrid } from './types';
import TableVirtualInnerElement from './table-virtual-inner-element';
import { TableVirtualContext } from './table-virtual-context';
import useGridScrolling from './hooks/use-grid-scrolling';
import useFilterTable from './hooks/use-filter-table';
import useSearchTable from './hooks/use-search-table';
import useSortTable from './hooks/use-sort-table';

export const TableVirtualStickyGrid: React.FC<ITableVirtualStickyGrid> = ({
  stickyHeight,
  stickyFooterHeight,
  stickyWidth,
  columnWidth,
  rowHeight,
  children,
  headers,
  dataSource,
  onChangeFilter,
  onChangeSort,
  useServerFilter,
  useServerSort,
  useFooter,
  isLoading,
  onClickRow,
  onScrollTouchBottom,
  ...rest
}) => {
  const freezedHeaders = headers?.filter(({ freezed }) => freezed);
  const headersExpectFreezed = headers?.filter(({ freezed }) => !freezed);

  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
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
    data: sortedData || [],
    onChangeFilter,
    useServerFilter,
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
    data: filteredData || [],
  });

  const handleSelectRow = useCallback((data: Record<string, string | number>, rowIndex: number) => {
    setSelectedRowIndex(rowIndex);
    onClickRow?.(data, rowIndex);
  }, []);

  const finalDataSource = searchedData;
  const contextValue = useMemo(
    () => ({
      isLoading,
      stickyHeight,
      stickyFooterHeight,
      stickyWidth,
      columnWidth,
      rowHeight,
      headers: headersExpectFreezed,
      freezedHeaders,
      finalDataSource,
      useFooter,
      selectedRowIndex,
      onClickRow: handleSelectRow,
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
      selectedRowIndex,
      handleSelectRow,
      useFooter,
      isLoading,
      stickyHeight,
      stickyFooterHeight,
      stickyWidth,
      columnWidth,
      rowHeight,
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
      isSearchCardOpen,
      handleOpenSearch,
      searchCardRef,
      searchCardPosition,
      updateSearch,
      resetSearch,
      activeSearch,
      finalDataSource,
      freezedHeaders,
      headersExpectFreezed,
    ]
  );

  const { gridRef, handleScroll } = useGridScrolling({
    rowHeight,
    isLoading,
    finalDataSource,
    onScrollTouchBottom,
  });

  return (
    <TableVirtualContext.Provider value={contextValue}>
      <Grid
        {...rest}
        columnWidth={columnWidth}
        rowHeight={rowHeight}
        innerElementType={TableVirtualInnerElement}
        ref={gridRef}
        rowCount={finalDataSource?.length || 0}
        columnCount={headersExpectFreezed?.length || 0}
        onScroll={handleScroll}
        className={clsx('border border-gray-300 parent-grid', isLoading && 'pointer-events-none')}
      >
        {children}
      </Grid>
    </TableVirtualContext.Provider>
  );
};
