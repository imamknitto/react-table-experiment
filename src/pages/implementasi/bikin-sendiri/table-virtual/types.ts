import { GridChildComponentProps, FixedSizeGrid as Grid } from 'react-window';
import { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { TSortOrder } from './hooks/use-sort-table';

export interface ITableVirtualContext {
  stickyHeight: number;
  stickyWidth: number;
  columnWidth: number;
  rowHeight: number;
  headers: ITableVirtualHeaderColumn[];
  finalDataSource: Record<string, string | number>[];
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

export interface ITableVirtual<TDataSource> {
  rowHeight?: number;
  columnWidth?: number;
  rowHeaderHeight?: number;
  dataSource?: TDataSource[];
  headers?: IDataHeader<TDataSource>[];
  useServerFilter?: boolean;
  useServerSort?: boolean;
  activeRowIndex?: number;
  onChangeFilter?: (data: Record<string, string[]>) => void;
  onChangeSort?: (sortKey: string, sortBy: TSortOrder) => void;
  onClickRow?: (data: TDataSource, rowIndex: number) => void;
}

export interface IDataHeader<TDataSource> {
  key: keyof TDataSource;
  caption: string;
  className?: string;
  useFilter?: boolean;
  useSort?: boolean;
  useSearch?: boolean;
  useSingleFilter?: boolean;
  freezed?: boolean;
  filterOptions?: string[];
  render?: (value?: number | string, rowIndex?: number) => ReactNode | string;
}

export interface ITableVirtualStickyGrid
  extends Omit<React.ComponentProps<typeof Grid>, 'columnWidth' | 'rowHeight' | 'children'> {
  stickyHeight: number;
  stickyWidth: number;
  columnWidth: number;
  rowHeight: number;
  children: React.FC<GridChildComponentProps>;
  headers: ITableVirtualHeaderColumn[];
  dataSource: Record<string, string | number>[];
  onChangeFilter?: (data: Record<string, string[]>) => void;
  onChangeSort?: (sortKey: string, sortBy: TSortOrder) => void;
  useServerFilter?: boolean;
  useServerSort?: boolean;
}

export interface ITableVirtualInnerElement {
  children: ReactNode;
  style: CSSProperties;
}

export interface ITableVirtualHeaderColumn extends Omit<IDataHeader<unknown>, 'caption'> {
  headerIndex?: number;
  caption: string;
  width: number;
  height: number;
  left: number;
}

export interface ITableVirtualColumn<TDataSource> {
  rowIndex: number;
  columnIndex: number;
  style: CSSProperties;
  activeRowIndex?: number;
  activeCellIndex?: { rowIndex: number; columnIndex: number };
  onClickRow?: (data: TDataSource, rowIndex: number) => void;
  onClickCell?: (value: string | number, rowIndex: number, columnIndex: number) => void;
}

export interface ITableVirtualFilterCard extends HTMLAttributes<HTMLDivElement> {
  filterDataKey: string;
  filterOptions?: string[];
  filterCardRef: React.LegacyRef<HTMLDivElement>;
  filterPosition: { top: number; left: number };
  activeFilters?: string[];
  onResetFilter?: (dataKey: string) => void;
  onApplyFilter?: (dataKey: string, filterValues: string[]) => void;
  useSingleFilter?: boolean;
}

export interface ITableVirtualSearchCard extends HTMLAttributes<HTMLDivElement> {
  searchDataKey: string;
  searchCardRef: React.LegacyRef<HTMLDivElement>;
  searchCardPosition: { top: number; left: number };
  activeSearch?: string;
  onResetSearch?: (dataKey: string) => void;
  onApplySearch?: (dataKey: string, searchValue: string) => void;
}
