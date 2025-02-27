import { GridChildComponentProps, VariableSizeGrid as Grid } from 'react-window';
import { useTableVirtual } from './service/table-virtual-context';
import tableVirtualInnerElement from './table-virtual-inner-element';
import { useEffect } from 'react';

interface Props {
  gridRef: React.RefObject<Grid | null>;
  children: React.FC<GridChildComponentProps>;
  width: number;
  height: number;
}

export default function TableVirtualStickyGrid({ children, width, height, gridRef }: Props) {
  const { rowHeight, columnWidth, headers, freezedHeaders, finalDataSource, setAdjustedColumnWidth, useAutoWidth } =
    useTableVirtual();

  const columnCount = [...headers, ...freezedHeaders].length || 0;

  useEffect(() => {
    if (!useAutoWidth) return;
    setAdjustedColumnWidth?.(Math.ceil(width / (columnCount || 1)) - 1);
  }, [width, height]);

  return (
    <Grid
      ref={gridRef}
      columnCount={columnCount}
      rowCount={finalDataSource?.length || 0}
      columnWidth={() => columnWidth}
      rowHeight={() => rowHeight}
      width={width}
      height={height}
      innerElementType={tableVirtualInnerElement}
    >
      {children}
    </Grid>
  );
}
