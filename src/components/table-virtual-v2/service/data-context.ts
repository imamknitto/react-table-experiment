import { createContext, useContext } from 'react';
import { TSortOrder } from '../hooks/use-sort-table';
import { TAdvanceFilterName } from '../types';

export interface IDataContext {
  finalDataSource: Record<string, string | number>[];
  sort?: {
    sortKey: string | null;
    sortBy: TSortOrder;
    handleSort: (key: string) => void;
    handleSpecificSort: (key: string, sortBy: TSortOrder) => void;
  };
  filter?: {
    isFilterCardOpen: { show: boolean; key: string };
    filterCardRef: React.LegacyRef<HTMLDivElement>;
    filterCardPosition: { top: number; left: number };
    handleOpenFilter: (e: React.MouseEvent<HTMLElement>, activeFilterKey: string) => void;
    updateFilter: (dataKey: string, filterValues: string[]) => void;
    resetFilter: (dataKey: string) => void;
    activeFilters: Record<string, string[]>;
  };
  filterAdvance?: {
    isFilterAdvanceCardOpen: { show: boolean; key: string };
    filterAdvanceCardRef: React.LegacyRef<HTMLDivElement>;
    filterAdvanceCardPosition: { top: number; left: number };
    handleOpenAdvanceFilter: (e: React.MouseEvent<HTMLElement>, activeFilterKey: string) => void;
    applyAdvanceFilter: (
      dataKey: string,
      filterName: TAdvanceFilterName,
      filterValue: string
    ) => void;
    resetAdvanceFilter: (dataKey: string) => void;
    activeAdvanceFilters: Record<string, { filterName: TAdvanceFilterName; value: string }>;
  };
  search?: {
    isSearchCardOpen: { show: boolean; key: string };
    searchCardRef: React.LegacyRef<HTMLDivElement>;
    searchCardPosition: { top: number; left: number };
    handleOpenSearch: (e: React.MouseEvent<HTMLElement>, activeSearchKey: string) => void;
    updateSearch: (dataKey: string, searchValue: string) => void;
    resetSearch: (dataKey: string) => void;
    activeSearch: Record<string, string>;
  };
}

export const DataContext = createContext<IDataContext>({
  finalDataSource: [],
});

export const useDataContext = () => useContext(DataContext);
