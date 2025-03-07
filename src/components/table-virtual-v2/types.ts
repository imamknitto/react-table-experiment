import { GridChildComponentProps, GridOnScrollProps, VariableSizeGrid as Grid } from 'react-window';
import { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { TSortOrder } from './hooks/use-sort-table';
import { ADVANCE_FILTER_NAMES } from './constants';

export interface ITableVirtual<TDataSource> {
  dataSource?: TDataSource[];
  headers?: IDataHeader<TDataSource>[];
  columnWidth?: number;
  rowHeight?: number;
  stickyrowHeaderHeight?: number;
  stickyFooterHeight?: number;
  isLoading?: boolean;
  useAutoWidth?: boolean;
  useFooter?: boolean;
  useServerSort?: boolean;
  useServerFilter?: boolean;
  useServerAdvanceFilter?: boolean;
  onChangeAdvanceFilter?: (data: Record<string, { filterName: TAdvanceFilterName; value: string }>) => void;
  onChangeFilter?: (data: Record<string, string[]>) => void;
  onChangeSort?: (sortKey: string, sortBy: TSortOrder) => void;
  onScrollTouchBottom?: () => void;
  onClickRow?: (data: Record<string, string | number>, rowIndex: number) => void;
  classNameCell?: (rowIndex: number, columnIndex: number) => string;
}

export interface ITableVierualProvider {
  children: React.ReactNode;
  value: Omit<
    ITableVirtualContext,
    | 'setAdjustedColumnWidth'
    | 'adjustedColumnWidth'
    | 'outerSize'
    | 'setOuterSize'
    | 'scrollbarWidth'
    | 'setScrollbarWidth'
    | 'isScrolling'
    | 'setIsScrolling'
    | 'totalCountGridWidth'
    | 'totalCountFreezedHeadersWidth'
  >;
}

export interface ITableVirtualContext {
  isLoading?: boolean;
  stickyHeaderHeight: number;
  stickyFooterHeight: number;
  columnWidth: number;
  useAutoWidth?: boolean;
  adjustedColumnWidth: number;
  rowHeight: number;
  freezedHeaders: ITableVirtualHeaderColumn[];
  nonFreezedHeaders: ITableVirtualHeaderColumn[];
  finalDataSource: Record<string, string | number>[];
  useFooter?: boolean;
  selectedRowIndex?: number;
  scrollbarWidth: number;
  isScrolling?: boolean;
  setIsScrolling?: React.Dispatch<React.SetStateAction<boolean>>;
  setScrollbarWidth?: React.Dispatch<React.SetStateAction<number>>;
  outerSize: { width: number; height: number };
  setOuterSize?: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
  totalCountGridWidth: number;
  totalCountFreezedHeadersWidth: number;
  setAdjustedColumnWidth?: React.Dispatch<React.SetStateAction<number>>;
  onClickRow?: (data: Record<string, string | number>, rowIndex: number) => void;
  classNameCell?: (rowIndex: number, columnIndex: number) => string;
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

export interface ITableVirtualStickyGrid {
  children: React.FC<GridChildComponentProps>;
  width: number;
  height: number;
  gridRef: React.RefObject<Grid | null>;
  outerRef: React.RefObject<HTMLElement | null>;
  onGridScroll?: (props: GridOnScrollProps) => void;
}

export interface ITableVirtualInnerElement {
  children: ReactNode;
  style: CSSProperties;
}

export interface ITableVirtualStickyHeaders {
  className?: string;
  style?: CSSProperties;
}

export interface ITableVirtualStickyColumns {
  minRow: number;
  maxRow: number;
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
  fixedWidth?: number;
}

export interface ITableVirtualCell {
  rowIndex: number;
  columnIndex: number;
  style: CSSProperties;
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

export interface ITableVirtualFilterAdvanceCard extends HTMLAttributes<HTMLDivElement> {
  filterDataKey: string;
  filterCardRef: React.LegacyRef<HTMLDivElement>;
  filterCardPosition: { top: number; left: number };
  onApplyAdvanceFilter?: (dataKey: string, filterName: TAdvanceFilterName, filterValue: string) => void;
  onResetAdvanceFilter?: (dataKey: string) => void;
  activeAdvanceFilters?: { filterName: TAdvanceFilterName; value: string };
}

export type TAdvanceFilterName = keyof typeof ADVANCE_FILTER_NAMES;
