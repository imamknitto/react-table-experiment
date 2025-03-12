import { createContext, useContext } from 'react';
import { ITableVirtualHeaderColumn } from '../types';

interface IHeaderContext {
  freezedHeaders?: ITableVirtualHeaderColumn[];
  nonFreezedHeaders?: ITableVirtualHeaderColumn[];
  onResizeHeaderColumn?: (caption: string, width: number) => void;
  totalCountFreezedHeadersWidth: number;
  totalCountGridWidth: number;
  totalCountColumnNonFreezedHeaders: number;
  totalCountColumnNonFreezedHeadersExceptFixedWidth: number;
  totalCountFixedWidthNonFreezedHeaders: number;
  totalCountColumnAllHeaders: number;
}

export const HeaderContext = createContext<IHeaderContext>({
  freezedHeaders: [],
  nonFreezedHeaders: [],
  totalCountFreezedHeadersWidth: 0,
  totalCountGridWidth: 0,
  totalCountColumnNonFreezedHeaders: 0,
  totalCountColumnNonFreezedHeadersExceptFixedWidth: 0,
  totalCountFixedWidthNonFreezedHeaders: 0,
  totalCountColumnAllHeaders: 0,
});

export const useHeaderContext = () => useContext(HeaderContext);
