import { GridChildComponentProps, FixedSizeGrid as Grid } from 'react-window';
import { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { TSortOrder } from './hooks/use-sort-table';

export interface ITableVirtualContext {
  isLoading?: boolean;
  stickyHeight: number;
  stickyWidth: number;
  stickyFooterHeight: number;
  columnWidth: number;
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
  rowFooterHeight?: number;
  dataSource?: TDataSource[];
  headers?: IDataHeader<TDataSource>[];
  useServerFilter?: boolean;
  useServerSort?: boolean;
  useFooter?: boolean;
  selectedRowIndex?: number;
  isLoading?: boolean;
  onChangeFilter?: (data: Record<string, string[]>) => void;
  onChangeSort?: (sortKey: string, sortBy: TSortOrder) => void;
  onClickRow?: (data: Record<string, string | number>, rowIndex: number) => void;
  onScrollTouchBottom?: () => void;
}

export interface ITableVirtualStickyGrid
  extends Omit<React.ComponentProps<typeof Grid>, 'columnWidth' | 'rowHeight' | 'children'> {
  stickyHeight: number;
  stickyFooterHeight: number;
  stickyWidth: number;
  columnWidth: number;
  rowHeight: number;
  children: React.FC<GridChildComponentProps>;
  headers: ITableVirtualHeaderColumn[];
  dataSource: Record<string, string | number>[];
  selectedRowIndex?: number;
  useServerFilter?: boolean;
  useServerSort?: boolean;
  useFooter?: boolean;
  isLoading?: boolean;
  onClickRow?: (data: Record<string, string | number>, rowIndex: number) => void;
  onChangeFilter?: (data: Record<string, string[]>) => void;
  onChangeSort?: (sortKey: string, sortBy: TSortOrder) => void;
  onScrollTouchBottom?: () => void;
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
  renderSummary?: (value?: number | string, rowIndex?: number) => ReactNode | string;
}
