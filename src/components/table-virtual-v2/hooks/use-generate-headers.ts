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

  const headerData = useMemo(() => {
    return headers?.reduce(
      (acc, data, idx) => {
        if (data.isHide) return acc;

        const width = adjustedHeadWidth[data.caption]?.width || columnWidth;
        const fixedWidth = adjustedHeadWidth[data.caption]?.width || data.fixedWidth;

        const header: ITableVirtualHeaderColumn = {
          ...(data as ITableVirtualHeaderColumn),
          filterOptions: data.filterOptions || [],
          width,
          fixedWidth,
          height: stickyHeaderHeight,
          left: idx * columnWidth,
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
  }, [headers, columnWidth, stickyHeaderHeight, adjustedHeadWidth]);

  const handleResizeHeaderColumn = useCallback((caption: string, newWidth: number) => {
    setAdjustedHeadWidth((prev) => ({ ...prev, [caption]: { width: newWidth } }));
  }, []);

  return {
    freezedHeaders: headerData?.freezed,
    nonFreezedHeaders: headerData?.nonFreezed,
    handleResizeHeaderColumn,
  };
}
