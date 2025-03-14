import { createContext, useContext } from 'react';
import { ITableVirtualHeaderColumn } from '../types';

export interface IHeaderContext {
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
  menuCard: {
    menuCardRef: React.RefObject<HTMLDivElement | null> | null;
    isMenuCardOpen: {
      dataKey: string | null;
      show: boolean;
      position: { top: number; left: number };
    };
    onOpenMenuCard?: (e: React.MouseEvent<HTMLElement>, dataKey: string | null) => void;
  };
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
  menuCard: {
    menuCardRef: null,
    isMenuCardOpen: { show: false, dataKey: null, position: { top: 0, left: 0 } },
    onOpenMenuCard: () => {},
  },
});

export const useHeaderContext = () => useContext(HeaderContext);
