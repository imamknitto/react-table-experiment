import { Children, forwardRef, useEffect, useState } from 'react';
import { useTableVirtual } from './table-virtual-context';
import TableVirtualStickyHeaders from './table-virtual-sticky-headers';
import { ITableVirtualInnerElement } from './types';
import { getRenderedCursor } from './utils';
import TableVirtualEmptyData from './table-virtual-empty-data';
import TableVirtualLoading from './table-virtual-loading';
import TableVirtualStickyColumn from './table-virtual-sticky-column';

const TableVirtualInnerElement = forwardRef<HTMLDivElement, ITableVirtualInnerElement>((props, ref) => {
  const { stickyHeight, stickyWidth, finalDataSource, isLoading, rowHeight, freezedHeaders } = useTableVirtual();
  const [minRow, maxRow, _minColumn, _maxColumn] = getRenderedCursor(Children.toArray(props.children));

  const [gridViewportSize, setGridViewportSize] = useState<{ height: number; width: number }>({ height: 0, width: 0 });
  const [_scrollBarWidth, setScrollBarWidth] = useState<number>(0);

  useEffect(() => {
    const element = document.querySelector('.parent-grid') as HTMLElement | null;
    if (element) {
      const height = element.offsetHeight;
      const width = element.offsetWidth;
      setGridViewportSize({ height, width });

      const scrollbarWidth = element.offsetWidth - element.clientWidth;
      setScrollBarWidth(scrollbarWidth);
    }
  }, [maxRow]);

  return (
    <div
      ref={ref}
      style={{
        ...props.style,
        width: props.style.width || 0 + stickyWidth,
        height: props.style.height || 0 + stickyHeight,
      }}
    >
      <TableVirtualStickyHeaders />

      {isLoading && (
        <TableVirtualLoading style={{ width: gridViewportSize.width, height: gridViewportSize.height - 10 }} />
      )}

      {!finalDataSource?.length && !isLoading && (
        <TableVirtualEmptyData style={{ width: gridViewportSize.width, height: gridViewportSize.height - 10 }} />
      )}

      {freezedHeaders?.length && (
        <div className="flex flex-row">
          {freezedHeaders.map(({ key }, idx) => {
            return (
              <TableVirtualStickyColumn
                key={'freezed-column-item-' + idx}
                style={{ left: idx * stickyWidth }}
                minRow={minRow}
                maxRow={maxRow}
                rowHeight={rowHeight}
                stickyHeight={stickyHeight}
                stickyWidth={stickyWidth}
                dataCols={finalDataSource?.map((item) => item[key]) || []}
              />
            );
          })}
        </div>
      )}

      <div className="absolute" style={{ top: stickyHeight, left: stickyWidth * (freezedHeaders?.length || 0) }}>
        {props.children}
      </div>
    </div>
  );
});

export default TableVirtualInnerElement;
