import { useCallback, useMemo, useRef, useState } from 'react';
import { IDataHeader, ITableVirtualHeaderColumn } from '../types';
import { getFixedCardPosition } from '../utils';
import useOnClickOutside from './use-click-outside';

interface IGenerateHeaders<T> {
  headers?: IDataHeader<T>[];
  stickyHeaderHeight: number;
  adjustedColumnWidth: number;
}

interface IAdjustedHeaderWidth {
  [caption: string]: { width: number };
}

export function useGenerateHeaders<T>(props: IGenerateHeaders<T>) {
  const { headers, stickyHeaderHeight, adjustedColumnWidth } = props;

  const visibilityColumnsCardRef = useRef<HTMLDivElement | null>(null);

  const [adjustedHeaderWidth, setAdjustedHeaderWidth] = useState<IAdjustedHeaderWidth>({});
  const [visibleColumns, setVisibleColumns] = useState([
    ...(headers?.map(({ caption }) => caption) || []),
  ]);

  const [isVisibilityColumnsCard, setIsVisibilityColumnsCard] = useState({
    show: false,
    position: { top: 0, left: 0 },
  });

  useOnClickOutside(visibilityColumnsCardRef, () =>
    setIsVisibilityColumnsCard({ show: false, position: { top: 0, left: 0 } })
  );

  const headerData = useMemo(() => {
    return headers
      ?.filter(({ caption }) => visibleColumns.includes(caption))
      ?.reduce(
        (acc, data, idx) => {
          const width = adjustedHeaderWidth[data.caption]?.width || adjustedColumnWidth;
          const fixedWidth = adjustedHeaderWidth[data.caption]?.width || data.fixedWidth;

          const header: ITableVirtualHeaderColumn = {
            ...(data as ITableVirtualHeaderColumn),
            filterOptions: data.filterOptions || [],
            width,
            fixedWidth,
            height: stickyHeaderHeight,
            left: idx * adjustedColumnWidth,
            useFilter: data.useFilter ?? true,
            useSort: data.useSort ?? true,
            useSearch: data.useSearch ?? true,
            useSingleFilter: data.useSingleFilter ?? false,
          };

          if (header.freezed) {
            acc.freezed.push(header);
          } else {
            acc.nonFreezed.push(header);
          }

          return acc;
        },
        { freezed: [], nonFreezed: [] } as {
          freezed: ITableVirtualHeaderColumn[];
          nonFreezed: ITableVirtualHeaderColumn[];
        }
      );
  }, [headers, adjustedColumnWidth, stickyHeaderHeight, adjustedHeaderWidth, visibleColumns]);

  const handleResizeHeaderColumn = useCallback((caption: string, newWidth: number) => {
    setAdjustedHeaderWidth((prev) => ({ ...prev, [caption]: { width: newWidth } }));
  }, []);

  const handleOpenVisibilityColumnsCard = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { calculatedTop, calculatedLeft } = getFixedCardPosition(rect);

    setIsVisibilityColumnsCard({
      show: true,
      position: { top: calculatedTop, left: calculatedLeft },
    });
  }, []);

  const handleSelectVisibilityColumnsCard = useCallback((option: string) => {
    setVisibleColumns((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  }, []);

  return {
    freezedHeaders: headerData?.freezed,
    nonFreezedHeaders: headerData?.nonFreezed,
    handleResizeHeaderColumn,
    handleOpenVisibilityColumnsCard,
    handleSelectVisibilityColumnsCard,
    visibleColumns,
    isVisibilityColumnsCard,
    visibilityColumnsCardRef,
  };
}
