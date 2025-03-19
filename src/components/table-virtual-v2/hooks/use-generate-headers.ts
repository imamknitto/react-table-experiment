import { useCallback, useMemo, useRef, useState } from 'react';
import { IDataHeader, ITableVirtualHeaderColumn, ITableVirtualHeaderParentColumn } from '../types';
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
          const fixedWidth = adjustedHeaderWidth[data.caption]?.width || data.fixedWidth || 0;

          // ======== Define data header dari data yang tetap maupun yang adjustable ========
          const header: ITableVirtualHeaderColumn = {
            ...(data as ITableVirtualHeaderColumn),
            filterOptions: data.filterOptions || [],
            width: data.children?.length
              ? data.children.reduce(
                  (total, child) =>
                    total + (adjustedHeaderWidth[child.caption]?.width || adjustedColumnWidth),
                  0
                )
              : width,
            fixedWidth: data.children?.length
              ? data.children.reduce(
                  (total, child) =>
                    total +
                    (adjustedHeaderWidth[child.caption]?.width ||
                      child.fixedWidth ||
                      adjustedColumnWidth ||
                      0),
                  0
                )
              : fixedWidth,
            height: stickyHeaderHeight,
            left: idx * adjustedColumnWidth,
            useFilter: data.useFilter ?? true,
            useSort: data.useSort ?? true,
            useSearch: data.useSearch ?? true,
            useSingleFilter: data.useSingleFilter ?? false,
          };

          //  ======== Jika header freezed. ========
          if (header.freezed) {
            // ======== Push data header ke arr freezed parent headers ========
            acc.freezedGroup.push({
              width: header.width,
              fixedWidth: header.fixedWidth || 0,
              caption: header.caption,
              hasChildren: !!data?.children?.length || false,
            });

            // ======== Push data header ke arr freezed headers ========
            if (data.children) {
              acc.freezed.push(
                ...data.children.map((child, childIdx) => ({
                  ...(child as ITableVirtualHeaderColumn),
                  height: stickyHeaderHeight,
                  width: adjustedHeaderWidth[child.caption]?.width || adjustedColumnWidth,
                  fixedWidth: adjustedHeaderWidth[child.caption]?.width || child.fixedWidth,
                  left: childIdx * adjustedColumnWidth,
                  useFilter: child.useFilter ?? true,
                  useSort: child.useSort ?? true,
                  useSearch: child.useSearch ?? true,
                  useSingleFilter: child.useSingleFilter ?? false,
                  freezed: true,
                }))
              );
            } else {
              acc.freezed.push(header);
            }
          }

          // ======== Jika header bukan yang freezed. ========
          else {
            // ======== Push data header ke arr non freezed parent headers ========
            acc.nonFreezedGroup.push({
              width: header.width,
              fixedWidth: header.fixedWidth || 0,
              caption: header.caption,
              hasChildren: !!data?.children?.length || false,
            });

            // ======== Push data header ke arr non freezed headers ========
            if (data.children) {
              acc.nonFreezed.push(
                ...data.children.map((child, childIdx) => ({
                  ...(child as ITableVirtualHeaderColumn),
                  height: stickyHeaderHeight,
                  width: adjustedHeaderWidth[child.caption]?.width || adjustedColumnWidth,
                  fixedWidth: adjustedHeaderWidth[child.caption]?.width || child.fixedWidth,
                  left: childIdx * adjustedColumnWidth,
                  useFilter: child.useFilter ?? true,
                  useSort: child.useSort ?? true,
                  useSearch: child.useSearch ?? true,
                  useSingleFilter: child.useSingleFilter ?? false,
                }))
              );
            } else {
              acc.nonFreezed.push(header);
            }
          }

          return acc;
        },
        { freezed: [], nonFreezed: [], freezedGroup: [], nonFreezedGroup: [] } as {
          freezed: ITableVirtualHeaderColumn[];
          nonFreezed: ITableVirtualHeaderColumn[];
          freezedGroup: ITableVirtualHeaderParentColumn[];
          nonFreezedGroup: ITableVirtualHeaderParentColumn[];
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
    freezedGroupHeaders: headerData?.freezedGroup,
    nonFreezedHeaders: headerData?.nonFreezed,
    nonFreezedGroupHeaders: headerData?.nonFreezedGroup,
    handleResizeHeaderColumn,
    handleOpenVisibilityColumnsCard,
    handleSelectVisibilityColumnsCard,
    visibleColumns,
    isVisibilityColumnsCard,
    visibilityColumnsCardRef,
  };
}
