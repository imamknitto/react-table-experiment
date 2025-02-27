import { ReactNode } from 'react';
import { TSortOrder } from './hooks/use-sort-table';
import { ADVANCE_FILTER_NAMES } from './constants';

export interface ITableVirtualContext {
  isLoading?: boolean;
  stickyHeaderHeight: number;
  stickyFooterHeight: number;
  columnWidth: number;
  useAutoWidth?: boolean;
  adjustedColumnWidth: number;
  setAdjustedColumnWidth?: React.Dispatch<React.SetStateAction<number>>;
  rowHeight: number;
  headers: ITableVirtualHeaderColumn[];
  freezedHeaders: ITableVirtualHeaderColumn[];
  finalDataSource: Record<string, string | number>[];
  useFooter?: boolean;
  selectedRowIndex?: number;
  onClickRow?: (data: Record<string, string | number>, rowIndex: number) => void;
  sort?: {
    sortKey: string | null;
    sortBy: TSortOrder;
    handleSort: (key: string) => void;
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
    applyAdvanceFilter: (dataKey: string, filterName: TAdvanceFilterName, filterValue: string) => void;
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

export interface ITableVirtualHeaderColumn extends Omit<IDataHeader<unknown>, 'caption'> {
  headerIndex?: number;
  caption: string;
  width: number;
  height: number;
  left: number;
}

export interface IDataHeader<TDataSource> {
  key: keyof TDataSource;
  caption: string;
  className?: string;
  useFilter?: boolean;
  useSort?: boolean;
  useSearch?: boolean;
  useSingleFilter?: boolean;
  useAdvanceFilter?: boolean;
  freezed?: boolean;
  filterOptions?: string[];
  render?: (value?: number | string, rowIndex?: number) => ReactNode | string;
  renderSummary?: (value?: number | string, rowIndex?: number) => ReactNode | string;
}

export type TAdvanceFilterName = keyof typeof ADVANCE_FILTER_NAMES;
