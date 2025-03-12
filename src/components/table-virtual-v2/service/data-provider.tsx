import { ReactNode, useMemo } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';

import { DataContext, IDataContext } from './data-context';
import useSortTable from '../hooks/use-sort-table';
import useFilterTable from '../hooks/use-filter-table';
import useFilterAdvanceTable from '../hooks/use-filter-advance-table';
import useSearchTable from '../hooks/use-search-table';
import { ITableVirtual } from '../types';

interface IDataProvider<TDataSource>
  extends Pick<
    ITableVirtual<TDataSource>,
    | 'useServerSort'
    | 'useServerFilter'
    | 'useServerAdvanceFilter'
    | 'onChangeSort'
    | 'onChangeFilter'
    | 'onChangeAdvanceFilter'
  > {
  children: ReactNode;
  dataSource: TDataSource[];
  gridRef: React.RefObject<Grid | null>;
}

const DataProvider = <TDataSource,>({ children, dataSource, gridRef }: IDataProvider<TDataSource>) => {
  const { sortedData, handleSort, sortKey, sortBy } = useSortTable({
    data: dataSource || [],
    onChangeSort: () => {},
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
    gridRef,
    data: sortedData || [],
    onChangeFilter: () => {},
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
    gridRef,
    data: filteredData || [],
    onChangeAdvanceFilter: () => {},
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
    gridRef,
    data: filteredAdvanceData || [],
  });

  const contextValue = useMemo(
    () =>
      ({
        finalDataSource: (searchedData || []) as Record<string, string | number>[],
        sort: { sortKey, sortBy, handleSort },
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
      } satisfies IDataContext),
    [
      searchedData,
      sortKey,
      sortBy,
      isFilterCardOpen,
      filterCardPosition,
      activeFilters,
      isFilterAdvanceCardOpen,
      filterAdvanceCardPosition,
      activeAdvanceFilters,
      isSearchCardOpen,
      searchCardPosition,
      activeSearch,
    ]
  );

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

export default DataProvider;
