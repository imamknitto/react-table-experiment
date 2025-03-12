import { VariableSizeGrid as Grid } from 'react-window';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { ITableVirtualStickyGrid } from './types';
import tableVirtualInnerElement from './table-virtual-inner-element';
import TableVirtualEmptyData from './table-virtual-empty-data';
import TableVirtualCell from './table-virtual-cell';
import { useHeaderContext } from './service/header-context';
import { useDataContext } from './service/data-context';
import useGridScrolling from './hooks/use-grid-scrolling';
import { useUIContext } from './service/ui-context';

const TableVirtualStickyGrid = (props: ITableVirtualStickyGrid) => {
  const { width, height, gridRef, outerRef, onScrollTouchBottom } = props;

  const {
    rowHeight,
    adjustedColumnWidth,
    setAdjustedColumnWidth,
    useAutoWidth,
    setOuterSize,
    setScrollbarWidth,
    isLoading,
    isScrolling,
    setIsScrolling,
    useFooter,
    onRightClickCell,
  } = useUIContext();

  const { finalDataSource } = useDataContext();

  const {
    nonFreezedHeaders,
    totalCountColumnNonFreezedHeaders,
    totalCountColumnNonFreezedHeadersExceptFixedWidth,
    totalCountFixedWidthNonFreezedHeaders,
    totalCountColumnAllHeaders,
  } = useHeaderContext();

  const gridColumnWidths = useMemo((): number[] => {
    return nonFreezedHeaders?.map(({ fixedWidth }) => fixedWidth || adjustedColumnWidth) || [];
  }, [nonFreezedHeaders, adjustedColumnWidth]);

  useEffect(() => {
    if (!outerRef.current) return;
    const scrollbarWidth = outerRef.current.offsetWidth - outerRef.current.clientWidth;

    setOuterSize?.({ width: outerRef.current.offsetWidth, height: outerRef.current.offsetHeight });
    setScrollbarWidth?.(scrollbarWidth);

    if (useAutoWidth) {
      const calculatedOuterWidth = width - (totalCountFixedWidthNonFreezedHeaders || 0);

      setAdjustedColumnWidth?.(
        Math.ceil((calculatedOuterWidth - scrollbarWidth) / (totalCountColumnNonFreezedHeadersExceptFixedWidth || 1)) -
          1
      );
    }
  }, [width, height, useAutoWidth]);

  const itemKey = useCallback(
    ({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) => {
      const col = nonFreezedHeaders?.[columnIndex];
      return `${rowIndex}-${col?.key || columnIndex}`;
    },
    [nonFreezedHeaders]
  );

  const { handleScroll } = useGridScrolling({
    gridRef,
    finalDataSource,
    isLoading,
    rowHeight,
    onScrollTouchBottom,
  });

  return (
    <div className="size-max relative">
      <Grid
        key={'table-virtual-grid' + adjustedColumnWidth + totalCountColumnAllHeaders}
        itemKey={itemKey}
        className="border border-gray-300"
        ref={gridRef}
        outerRef={outerRef}
        width={width}
        height={height}
        rowHeight={() => rowHeight}
        columnWidth={(index) => gridColumnWidths[index]}
        columnCount={totalCountColumnNonFreezedHeaders || 0}
        rowCount={finalDataSource?.length || 0}
        innerElementType={tableVirtualInnerElement}
        onScroll={(props) => {
          handleScroll?.(props);
          onRightClickCell?.(null);
          const scrollTop = props.scrollTop;

          if (!useFooter) return;
          if (scrollTop >= 36 && !isScrolling) {
            setIsScrolling?.(true);
          } else if (scrollTop <= 36 && isScrolling) {
            setIsScrolling?.(false);
          }
        }}
      >
        {({ columnIndex, rowIndex, style }) => (
          <TableVirtualCell rowIndex={rowIndex} columnIndex={columnIndex} style={style} />
        )}
      </Grid>

      {!finalDataSource?.length && !isLoading && <TableVirtualEmptyData />}
    </div>
  );
};

export default memo(TableVirtualStickyGrid);
