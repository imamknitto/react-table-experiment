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
    | 'useServerSearch'
    | 'onChangeSearch'
  > {
  children: ReactNode;
  dataSource: TDataSource[];
  gridRef: React.RefObject<Grid | null>;
}

const DataProvider = <TDataSource,>(props: IDataProvider<TDataSource>) => {
  const {
    children,
    dataSource,
    gridRef,
    useServerSort,
    useServerFilter,
    useServerAdvanceFilter,
    onChangeSort,
    onChangeFilter,
    onChangeAdvanceFilter,
    useServerSearch,
    onChangeSearch,
  } = props;

  const { sortedData, handleSort, handleSpecificSort, sortKey, sortBy } = useSortTable({
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
    useServerSearch,
    onChangeSearch,
  });

  const contextValue = useMemo(
    () =>
      ({
        finalDataSource: (searchedData || []) as Record<string, string | number>[],
        sort: { sortKey, sortBy, handleSort, handleSpecificSort },
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
