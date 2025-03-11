import { useCallback, useMemo, useState } from 'react';
import { IDataHeader, ITableVirtualHeaderColumn } from '../types';

interface IGenerateHeaders<T> {
  headers?: IDataHeader<T>[];
  columnWidth: number;
  stickyHeaderHeight: number;
}

interface IAdjustedHeadWidth {
  [caption: string]: { width: number };
}

export function useGenerateHeaders<T>({ headers, columnWidth, stickyHeaderHeight }: IGenerateHeaders<T>) {
  const [adjustedHeadWidth, setAdjustedHeadWidth] = useState<IAdjustedHeadWidth>({});

  const { freezedHeaders, nonFreezedHeaders } = useMemo(() => {
    const freezed: ITableVirtualHeaderColumn[] = [];
    const nonFreezed: ITableVirtualHeaderColumn[] = [];

    headers?.forEach((data, idx) => {
      if (data.isHide) return;

      const header = {
        ...data,
        filterOptions: data.filterOptions || [],
        width: adjustedHeadWidth[data.caption]?.width || columnWidth,
        fixedWidth: adjustedHeadWidth[data.caption]?.width || data.fixedWidth,
        height: stickyHeaderHeight,
        left: idx * columnWidth,
        useFilter: data.useFilter ?? true,
        useSort: data.useSort ?? true,
        useSearch: data.useSearch ?? true,
        useSingleFilter: data.useSingleFilter ?? false,
      };

      if (header.freezed) {
        freezed.push(header as ITableVirtualHeaderColumn);
      } else {
        nonFreezed.push(header as ITableVirtualHeaderColumn);
      }
    });

    return { freezedHeaders: freezed, nonFreezedHeaders: nonFreezed };
  }, [headers, columnWidth, stickyHeaderHeight, adjustedHeadWidth]);

  const handleResizeHeaderColumn = useCallback((caption: string, newWidth: number) => {
    setAdjustedHeadWidth((prev) => ({ ...prev, [caption]: { width: newWidth } }));
  }, []);

  return { freezedHeaders, nonFreezedHeaders, handleResizeHeaderColumn };
}
