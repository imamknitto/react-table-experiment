import { ReactNode, useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';
import { HeaderContext, IHeaderContext } from './header-context';
import { IDataHeader } from '../types';
import { useGenerateHeaders } from '../hooks/use-generate-headers';
import useOnClickOutside from '../hooks/use-click-outside';
import { getFixedCardPosition } from '../utils';
import { useUIContext } from './ui-context';
import { MINIMUM_ROW_HEIGHT } from '../constants';

interface IHeaderProvider<T> {
  headers: IDataHeader<T>[];
  children: ReactNode;
  stickyHeaderHeight: number;
}

const HeaderProvider = <T,>(props: IHeaderProvider<T>) => {
  const { headers, children, stickyHeaderHeight } = props;
  const defferedHeaders = useDeferredValue(headers);
  const { headerFilterHeight, adjustedColumnWidth, useAutoWidth } = useUIContext();

  const finalStickyHeaderHeight =
    (stickyHeaderHeight < MINIMUM_ROW_HEIGHT ? MINIMUM_ROW_HEIGHT : stickyHeaderHeight) +
    headerFilterHeight;

  const menuCardRef = useRef<HTMLDivElement>(null);
  const [isMenuCardOpen, setIsMenuCardOpen] = useState<
    IHeaderContext['menuCard']['isMenuCardOpen']
  >({
    dataKey: null,
    show: false,
    position: { top: 0, left: 0 },
  });

  useOnClickOutside(menuCardRef, () =>
    setIsMenuCardOpen({ show: false, dataKey: null, position: { top: 0, left: 0 } })
  );

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
    stickyHeaderHeight: finalStickyHeaderHeight,
    adjustedColumnWidth,
  });

  //   // Hitung total maksimal lebar grid berdasarkan total lebar tiap kolom headers.
  //   const totalCountGridWidth = useMemo(() => {
  //     const allHeaders = [...(freezedHeaders || []), ...(nonFreezedHeaders || [])];
  //     return allHeaders?.reduce((prev, curr) => prev + (curr.fixedWidth || curr.width), 0);
  //   }, [freezedHeaders, nonFreezedHeaders]);

  // Hitung total maksimal lebar grid berdasarkan total lebar tiap kolom headers.
  const totalCountGridWidth = useMemo(() => {
    const allHeaders = [...(freezedHeaders || []), ...(nonFreezedHeaders || [])];
    return (
      allHeaders?.reduce(
        (prev, curr) =>
          prev + (curr.fixedWidth || (useAutoWidth ? adjustedColumnWidth : curr.width)),
        0
      ) || 0
    );
  }, [freezedHeaders, nonFreezedHeaders, useAutoWidth, adjustedColumnWidth]);

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

  const totalCountColumnAllHeaders = [...(freezedHeaders || []), ...(nonFreezedHeaders || [])]
    .length;

  const visibilityColumnsCardOptions = useMemo(() => {
    return defferedHeaders.map(({ caption }) => caption);
  }, [defferedHeaders]);

  const handleOpenMenuCard = useCallback(
    (e: React.MouseEvent<HTMLElement>, dataKey: string | null) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const { calculatedTop, calculatedLeft } = getFixedCardPosition(rect);

      setIsMenuCardOpen({
        show: true,
        dataKey,
        position: { top: calculatedTop, left: calculatedLeft },
      });
    },
    []
  );

  const contextValue = useMemo(
    (): IHeaderContext => ({
      freezedHeaders,
      nonFreezedHeaders,
      totalCountFreezedHeadersWidth,
      totalCountGridWidth,
      totalCountColumnNonFreezedHeaders,
      totalCountColumnNonFreezedHeadersExceptFixedWidth,
      totalCountFixedWidthNonFreezedHeaders,
      visibleColumns,
      totalCountColumnAllHeaders,
      isVisibilityColumnsCard,
      visibilityColumnsCardRef,
      visibilityColumnsCardOptions,
      onChangeVisibilityColumns: handleSelectVisibilityColumnsCard,
      onResizeHeaderColumn: handleResizeHeaderColumn,
      onOpenVisibilityColumnsCard: handleOpenVisibilityColumnsCard,
      menuCard: {
        menuCardRef,
        isMenuCardOpen,
        onOpenMenuCard: handleOpenMenuCard,
      },
    }),
    [
      freezedHeaders,
      nonFreezedHeaders,
      totalCountFreezedHeadersWidth,
      totalCountGridWidth,
      totalCountColumnNonFreezedHeaders,
      totalCountColumnNonFreezedHeadersExceptFixedWidth,
      totalCountFixedWidthNonFreezedHeaders,
      visibleColumns,
      totalCountColumnAllHeaders,
      isVisibilityColumnsCard,
      visibilityColumnsCardRef,
      visibilityColumnsCardOptions,
      isMenuCardOpen,
    ]
  );

  return <HeaderContext.Provider value={contextValue}>{children}</HeaderContext.Provider>;
};

export default HeaderProvider;
