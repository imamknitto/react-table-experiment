import { VariableSizeGrid as Grid } from 'react-window';
import { memo, useEffect, useMemo } from 'react';
import { useTableVirtual } from './service/table-virtual-context';
import { ITableVirtualStickyGrid } from './types';
import tableVirtualInnerElement from './table-virtual-inner-element';
import TableVirtualEmptyData from './table-virtual-empty-data';

const TableVirtualStickyGrid = (props: ITableVirtualStickyGrid) => {
  const { children, width, height, gridRef, outerRef, onGridScroll } = props;

  const {
    rowHeight,
    adjustedColumnWidth,
    nonFreezedHeaders,
    finalDataSource,
    setAdjustedColumnWidth,
    useAutoWidth,
    setOuterSize,
    setScrollbarWidth,
    isLoading,
    isScrolling,
    setIsScrolling,
    useFooter,
  } = useTableVirtual();

  const totalColumn = nonFreezedHeaders?.length || 0;
  const totalColumnExceptFixedWidth = nonFreezedHeaders?.filter(({ fixedWidth }) => !fixedWidth)?.length || 0;
  const totalCountFixedColumnWidth = nonFreezedHeaders?.reduce((prev, curr) => prev + (curr.fixedWidth || 0), 0) || 0;

  const columnWidths = useMemo(() => {
    return nonFreezedHeaders.map(({ fixedWidth }) => fixedWidth || adjustedColumnWidth);
  }, [nonFreezedHeaders, adjustedColumnWidth]);

  useEffect(() => {
    if (!outerRef.current) return;
    const scrollbarWidth = outerRef.current.offsetWidth - outerRef.current.clientWidth;

    setOuterSize?.({ width: outerRef.current.offsetWidth, height: outerRef.current.offsetHeight });
    setScrollbarWidth?.(scrollbarWidth);

    if (useAutoWidth) {
      const calculatedOuterWidth = width - totalCountFixedColumnWidth;

      setAdjustedColumnWidth?.(
        Math.ceil((calculatedOuterWidth - scrollbarWidth) / (totalColumnExceptFixedWidth || 1)) - 1
      );
    }
  }, [width, height, useAutoWidth]);

  return (
    <div className="size-max relative">
      <Grid
        key={'table-virtual-grid' + adjustedColumnWidth}
        className="border border-gray-300"
        ref={gridRef}
        outerRef={outerRef}
        width={width}
        height={height}
        rowHeight={() => rowHeight}
        columnWidth={(index) => columnWidths[index]}
        columnCount={totalColumn}
        rowCount={finalDataSource?.length || 0}
        innerElementType={tableVirtualInnerElement}
        onScroll={(props) => {
          onGridScroll?.(props);
          const scrollTop = props.scrollTop;

          if (!useFooter) return;
          if (scrollTop >= 36 && !isScrolling) {
            setIsScrolling?.(true);
          } else if (scrollTop <= 36 && isScrolling) {
            setIsScrolling?.(false);
          }
        }}
      >
        {children}
      </Grid>

      {!finalDataSource?.length && !isLoading && <TableVirtualEmptyData />}
    </div>
  );
};

export default memo(TableVirtualStickyGrid);
