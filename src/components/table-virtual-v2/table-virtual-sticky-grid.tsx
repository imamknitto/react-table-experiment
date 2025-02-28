import { VariableSizeGrid as Grid } from 'react-window';
import { memo, useEffect } from 'react';
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
  } = useTableVirtual();

  const columnCount = nonFreezedHeaders.length || 0;

  useEffect(() => {
    if (!outerRef.current) return;
    const scrollbarWidth = outerRef.current.offsetWidth - outerRef.current.clientWidth;

    setOuterSize?.({ width: outerRef.current.offsetWidth, height: outerRef.current.offsetHeight });
    setScrollbarWidth?.(scrollbarWidth);

    if (useAutoWidth) {
      setAdjustedColumnWidth?.(Math.ceil((width - scrollbarWidth) / (columnCount || 1)) - 1);
    }
  }, [width, height, useAutoWidth]);

  return (
    <div className="size-max relative">
      <Grid
        key={'table-virtual-grid' + adjustedColumnWidth}
        ref={gridRef}
        outerRef={outerRef}
        width={width}
        height={height}
        rowHeight={() => rowHeight}
        columnWidth={() => adjustedColumnWidth}
        columnCount={columnCount}
        rowCount={finalDataSource?.length || 0}
        onScroll={onGridScroll}
        innerElementType={tableVirtualInnerElement}
      >
        {children}
      </Grid>

      {!finalDataSource?.length && !isLoading && <TableVirtualEmptyData />}
    </div>
  );
};

export default memo(TableVirtualStickyGrid);
