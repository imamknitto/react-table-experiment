import { FixedSizeGrid as Grid } from 'react-window';
import { useMemo } from 'react';
import { ITableVirtualStickyGrid } from './types';
import TableVirtualInnerElement from './table-virtual-inner-element';
import { TableVirtualContext } from './table-virtual-context';
import useFilterTable from './hooks/use-filter-table';
import useSearchTable from './hooks/use-search-table';
import useSortTable from './hooks/use-sort-table';

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
  ...rest
}) => {
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
      stickyHeight,
      stickyWidth,
      columnWidth,
      rowHeight,
      headers,
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
      stickyHeight,
      stickyWidth,
      columnWidth,
      rowHeight,
      headers,
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
    ]
  );

  return (
    <TableVirtualContext.Provider value={contextValue}>
      <Grid
        columnWidth={columnWidth}
        rowHeight={rowHeight}
        innerElementType={TableVirtualInnerElement}
        {...rest}
        rowCount={searchedData?.length || 0}
      >
        {children}
      </Grid>
    </TableVirtualContext.Provider>
  );
};
