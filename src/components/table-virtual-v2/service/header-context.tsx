import { createContext, useContext } from 'react';
import { ITableVirtualHeaderColumn } from '../types';

interface IHeaderContext {
  freezedHeaders?: ITableVirtualHeaderColumn[];
  nonFreezedHeaders?: ITableVirtualHeaderColumn[];
  totalCountFreezedHeadersWidth: number;
  totalCountGridWidth: number;
  totalCountColumnNonFreezedHeaders: number;
  totalCountColumnNonFreezedHeadersExceptFixedWidth: number;
  totalCountFixedWidthNonFreezedHeaders: number;
  totalCountColumnAllHeaders: number;
  visibleColumns: string[];
  visibilityColumnsCardOptions: string[];
  visibilityColumnsCardRef: React.RefObject<HTMLDivElement | null> | null;
  isVisibilityColumnsCard?: { show: boolean; position: { top: number; left: number } };
  onResizeHeaderColumn?: (caption: string, width: number) => void;
  onOpenVisibilityColumnsCard?: (e: React.MouseEvent<HTMLElement>) => void;
  onChangeVisibilityColumns?: (value: string) => void;
}

export const HeaderContext = createContext<IHeaderContext>({
  visibilityColumnsCardRef: null,
  freezedHeaders: [],
  nonFreezedHeaders: [],
  totalCountFreezedHeadersWidth: 0,
  totalCountGridWidth: 0,
  totalCountColumnNonFreezedHeaders: 0,
  totalCountColumnNonFreezedHeadersExceptFixedWidth: 0,
  totalCountFixedWidthNonFreezedHeaders: 0,
  totalCountColumnAllHeaders: 0,
  visibleColumns: [],
  visibilityColumnsCardOptions: [],
});

export const useHeaderContext = () => useContext(HeaderContext);
