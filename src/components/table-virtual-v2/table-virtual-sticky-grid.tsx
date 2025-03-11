import { VariableSizeGrid as Grid } from 'react-window';
import { memo, useEffect, useMemo } from 'react';
import { useTableVirtual } from './service/table-virtual-context';
import { ITableVirtualStickyGrid } from './types';
import tableVirtualInnerElement from './table-virtual-inner-element';
import TableVirtualEmptyData from './table-virtual-empty-data';
import TableVirtualCell from './table-virtual-cell';

const TableVirtualStickyGrid = (props: ITableVirtualStickyGrid) => {
  const { width, height, gridRef, outerRef, onGridScroll } = props;

  const {
    rowHeight,
    adjustedColumnWidth,
    freezedHeaders,
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
    onRightClickCell,
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

  //  Masukan ke key grid agar ketika ada perubahan di header length maka grid di re render.
  const allHeadersLength = [...freezedHeaders, ...nonFreezedHeaders].length;

  return (
    <div className="size-max relative">
      <Grid
        key={'table-virtual-grid' + adjustedColumnWidth + allHeadersLength}
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
