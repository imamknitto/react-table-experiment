import { VariableSizeGrid as Grid } from 'react-window';
import { CSSProperties, HTMLAttributes, JSX, ReactNode } from 'react';
import { TSortOrder } from './hooks/use-sort-table';
import { ADVANCE_FILTER_NAMES } from './constants';

export interface ITableVirtual<TDataSource> {
  dataSource?: TDataSource[];
  headers?: IDataHeader<TDataSource>[];
  columnWidth?: number;
  rowHeight?: number;
  stickyHeaderHeight?: number;
  stickyFooterHeight?: number;
  isLoading?: boolean;
  useAutoWidth?: boolean;
  useFooter?: boolean;
  useServerSort?: boolean;
  useServerFilter?: boolean;
  useServerAdvanceFilter?: boolean;
  onChangeAdvanceFilter?: (
    data: Record<string, { filterName: TAdvanceFilterName; value: string }>
  ) => void;
  onChangeFilter?: (data: Record<string, string[]>) => void;
  onChangeSort?: (sortKey: string, sortBy: TSortOrder) => void;
  onScrollTouchBottom?: () => void;
  onClickRow?: (data: Record<string, string | number>, rowIndex: number) => void;
  classNameCell?: (
    data: Record<string, string | number>,
    rowIndex: number,
    columnIndex: number,
    isFreezed: boolean
  ) => string;
  renderRightClickRow?: (
    data: Record<string, string | number> | null,
    value: string | number,
    callbackFn?: () => void
  ) => JSX.Element;
}

export interface ICellPosition {
  x: number;
  y: number;
  rowIndex: number;
  columnIndex: number;
  isFreezed?: boolean;
}

export interface ITableVirtualStickyGrid {
  width: number;
  height: number;
  gridRef: React.RefObject<Grid | null>;
  outerRef: React.RefObject<HTMLElement | null>;
  onScrollTouchBottom?: () => void;
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
  render?: (value?: number | string, rowIndex?: number, columnIndex?: number) => ReactNode | string;
  renderSummary?: (
    value?: number | string,
    rowIndex?: number,
    columnIndex?: number
  ) => ReactNode | string;
  fixedWidth?: number;
  isHide?: boolean;
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
  onApplyAdvanceFilter?: (
    dataKey: string,
    filterName: TAdvanceFilterName,
    filterValue: string
  ) => void;
  onResetAdvanceFilter?: (dataKey: string) => void;
  activeAdvanceFilters?: { filterName: TAdvanceFilterName; value: string };
}

export type TAdvanceFilterName = keyof typeof ADVANCE_FILTER_NAMES;
