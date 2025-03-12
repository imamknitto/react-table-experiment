import { ReactNode, useDeferredValue, useMemo } from 'react';
import { HeaderContext } from './header-context';
import { IDataHeader } from '../types';
import { useGenerateHeaders } from '../hooks/use-generate-headers';

interface IHeaderProvider<T> {
  headers: IDataHeader<T>[];
  children: ReactNode;
  columnWidth: number;
  stickyHeaderHeight: number;
}

const HeaderProvider = <T,>(props: IHeaderProvider<T>) => {
  const { headers, children, columnWidth, stickyHeaderHeight } = props;

  const defferedHeaders = useDeferredValue(headers);

  const {
    freezedHeaders,
    nonFreezedHeaders,
    handleResizeHeaderColumn,
    visibleColumns,
    handleOpenVisibilityColumnsCard,
    handleSelectVisibilityColumnsCard,
    isVisibilityColumnsCard,
    visibilityColumnsCardRef,
  } = useGenerateHeaders({
    headers: defferedHeaders,
    columnWidth,
    stickyHeaderHeight,
  });

  // Hitung total maksimal lebar grid berdasarkan total lebar tiap kolom headers.
  const totalCountGridWidth = useMemo(() => {
    const allHeaders = [...(freezedHeaders || []), ...(nonFreezedHeaders || [])];
    return allHeaders?.reduce((prev, curr) => prev + (curr.fixedWidth || curr.width), 0);
  }, [freezedHeaders, nonFreezedHeaders]);

  // Hitung total lebar kolom headers yang di freezed.
  const totalCountFreezedHeadersWidth = useMemo((): number => {
    return freezedHeaders?.reduce((prev, curr) => prev + (curr.fixedWidth || curr.width), 0) || 0;
  }, [freezedHeaders]);

  // 1. Hitung total kolom headers yang non-freezed.
  // 2. Hitung total kolom headers yang non-freezed, yang tidak memiliki width fixed.
  // 3. Hitung total lebar kolom headers yang non-freezed.
  const {
    totalCountColumnNonFreezedHeaders,
    totalCountColumnNonFreezedHeadersExceptFixedWidth,
    totalCountFixedWidthNonFreezedHeaders,
  } = useMemo(() => {
    const totalCountColumn = nonFreezedHeaders?.length || 0;
    const totalCountExceptFixedWidth =
      nonFreezedHeaders?.filter(({ fixedWidth }) => !fixedWidth).length || 0;
    const totalFixedWidth =
      nonFreezedHeaders?.reduce((prev, curr) => prev + (curr.fixedWidth || 0), 0) || 0;

    return {
      totalCountColumnNonFreezedHeaders: totalCountColumn,
      totalCountColumnNonFreezedHeadersExceptFixedWidth: totalCountExceptFixedWidth,
      totalCountFixedWidthNonFreezedHeaders: totalFixedWidth,
    };
  }, [nonFreezedHeaders]);

  const visibilityColumnsCardOptions = useMemo(() => {
    return defferedHeaders.map(({ caption }) => caption);
  }, [defferedHeaders]);

  return (
    <HeaderContext.Provider
      value={{
        freezedHeaders,
        nonFreezedHeaders,
        totalCountFreezedHeadersWidth,
        totalCountGridWidth,
        totalCountColumnNonFreezedHeaders,
        totalCountColumnNonFreezedHeadersExceptFixedWidth,
        totalCountFixedWidthNonFreezedHeaders,
        visibleColumns,
        totalCountColumnAllHeaders: [...(freezedHeaders || []), ...(nonFreezedHeaders || [])]
          .length,
        isVisibilityColumnsCard,
        visibilityColumnsCardRef,
        visibilityColumnsCardOptions,
        onChangeVisibilityColumns: handleSelectVisibilityColumnsCard,
        onResizeHeaderColumn: handleResizeHeaderColumn,
        onOpenVisibilityColumnsCard: handleOpenVisibilityColumnsCard,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderProvider;
