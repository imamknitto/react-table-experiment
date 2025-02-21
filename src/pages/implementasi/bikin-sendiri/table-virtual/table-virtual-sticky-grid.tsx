import { FixedSizeGrid as Grid } from 'react-window';
import { useMemo } from 'react';
import { ITableVirtualStickyGrid } from './types';
import TableVirtualInnerElement from './table-virtual-inner-element';
import { TableVirtualContext } from './table-virtual-context';
import useFilterTable from './hooks/use-filter-table';
import useSearchTable from './hooks/use-search-table';
import useSortTable from './hooks/use-sort-table';
import useGridScrolling from './hooks/use-grid-scrolling';

export const TableVirtualStickyGrid: React.FC<ITableVirtualStickyGrid> = ({
  stickyHeight,
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
  isLoading,
  onScrollTouchBottom,
  ...rest
}) => {
  const freezedHeaders = headers?.filter(({ freezed }) => freezed);
  const headersExpectFreezed = headers?.filter(({ freezed }) => !freezed);

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

  const finalDataSource = searchedData;
  const contextValue = useMemo(
    () => ({
      isLoading,
      stickyHeight,
      stickyWidth,
      columnWidth,
      rowHeight,
      headers: headersExpectFreezed,
      freezedHeaders,
      finalDataSource,
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
      isLoading,
      stickyHeight,
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
      >
        {children}
      </Grid>
    </TableVirtualContext.Provider>
  );
};
