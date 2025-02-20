import { Children, forwardRef, useEffect, useState } from 'react';
import { useTableVirtual } from './table-virtual-context';
import TableVirtualStickyHeader from './table-virtual-sticky-header';
import { ITableVirtualInnerElement } from './types';
import { getRenderedCursor } from './utils';
import TableVirtualEmptyData from './table-virtual-empty-data';
import TableVirtualStickyColumn from './table-virtual-sticky-column';

const TableVirtualInnerElement = forwardRef<HTMLDivElement, ITableVirtualInnerElement>((props, ref) => {
  const { stickyHeight, stickyWidth, finalDataSource, rowHeight } = useTableVirtual();
  const [minRow, maxRow, _minColumn, _maxColumn] = getRenderedCursor(Children.toArray(props.children));

  const [gridBoxSize, setGridBoxSize] = useState<{ height: number; width: number }>({ height: 0, width: 0 });
  const [_scrollBarWidth, setScrollBarWidth] = useState<number>(0);

  useEffect(() => {
    const element = document.querySelector('.parent-grid') as HTMLElement | null;
    if (element) {
      const height = element.offsetHeight;
      const width = element.offsetWidth;
      setGridBoxSize({ height, width });

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
      className="relative bg-green-50"
    >
      <TableVirtualStickyHeader />

      {/* <TableVirtualFooter stickyHeight={stickyHeight} parentHeight={parentHeight} scrollBarWidth={scrollBarWidth} /> */}

      <div className="h-full w-max sticky left-0 top-[50px] z-[2]">
        <div className="size-full flex flex-row relative">
          <TableVirtualStickyColumn
            minRow={minRow}
            maxRow={maxRow}
            rowHeight={rowHeight}
            stickyHeight={stickyHeight}
            stickyWidth={stickyWidth}
            dataSource={finalDataSource}
          />
          <TableVirtualStickyColumn
            minRow={minRow}
            maxRow={maxRow}
            rowHeight={rowHeight}
            stickyHeight={stickyHeight}
            stickyWidth={stickyWidth}
            dataSource={finalDataSource}
            className="!left-[180px]"
          />
        </div>
      </div>
      {!finalDataSource?.length && (
        <TableVirtualEmptyData style={{ width: gridBoxSize.width, height: gridBoxSize.height - 10 }} />
      )}

      <div className="absolute" style={{ top: stickyHeight, left: 0 }}>
        {props.children}
      </div>
    </div>
  );
});

export default TableVirtualInnerElement;
