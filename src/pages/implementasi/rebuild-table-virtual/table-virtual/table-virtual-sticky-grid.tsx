import { GridChildComponentProps, VariableSizeGrid as Grid } from 'react-window';
import { memo, useEffect, useRef } from 'react';
import tableVirtualInnerElement from './table-virtual-inner-element';
import { useTableVirtual } from './service/table-virtual-context';

interface Props {
  children: React.FC<GridChildComponentProps>;
  width: number;
  height: number;
}

const TableVirtualStickyGrid = ({ children, width, height }: Props) => {
  const gridRef = useRef<Grid>(null);
  const outerRef = useRef<HTMLElement>(null);

  const {
    rowHeight,
    adjustedColumnWidth,
    nonFreezedHeaders,
    finalDataSource,
    setAdjustedColumnWidth,
    useAutoWidth,
    setOuterSize,
  } = useTableVirtual();

  const columnCount = nonFreezedHeaders.length || 0;

  useEffect(() => {
    if (!outerRef.current) return;
    setOuterSize?.({ width: outerRef.current.offsetWidth, height: outerRef.current.offsetHeight });

    if (useAutoWidth) {
      const scrollbarWidth = outerRef.current.offsetWidth - outerRef.current.clientWidth;
      setAdjustedColumnWidth?.(Math.ceil((width - scrollbarWidth) / (columnCount || 1)) - 1);
    }
  }, [width, height, useAutoWidth]);

  return (
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
      innerElementType={tableVirtualInnerElement}
    >
      {children}
    </Grid>
  );
};

export default memo(TableVirtualStickyGrid);
