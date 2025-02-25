import { Children, forwardRef, useEffect, useState } from 'react';
import { ITableVirtualInnerElement } from './types';
import { getRenderedCursor } from './utils';
import TableVirtualStickyHeaders from './table-virtual-sticky-headers';
import TableVirtualStickyFooters from './table-virtual-sticky-footers';
import TableVirtualStickyColumns from './table-virtual-sticky-columns';
import TableVirtualEmptyData from './table-virtual-empty-data';
import { useTableVirtual } from './table-virtual-context';

const TableVirtualInnerElement = forwardRef<HTMLDivElement, ITableVirtualInnerElement>((props, ref) => {
  const { stickyHeight, stickyWidth, finalDataSource, isLoading, freezedHeaders, useFooter, stickyFooterHeight } =
    useTableVirtual();
  const [minRow, maxRow, _minColumn, _maxColumn] = getRenderedCursor(Children.toArray(props.children));

  const [gridViewportSize, setGridViewportSize] = useState<{ height: number; width: number }>({ height: 0, width: 0 });
  const [scrollBarWidth, setScrollBarWidth] = useState<number>(0);

  useEffect(() => {
    const getGridViewportSize = () => {
      const element = document.querySelector('.parent-grid') as HTMLElement | null;

      if (element) {
        const height = element.offsetHeight;
        const width = element.offsetWidth;
        setGridViewportSize({ height, width });

        const scrollbarWidth = element.offsetWidth - element.clientWidth;
        setScrollBarWidth(scrollbarWidth);
      }
    };

    getGridViewportSize();

    window.addEventListener('resize', getGridViewportSize);
    return () => {
      window.removeEventListener('resize', getGridViewportSize);
    };
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
      <TableVirtualStickyColumns minRow={minRow} maxRow={maxRow} />

      {useFooter && (
        <TableVirtualStickyFooters parentHeight={gridViewportSize.height} scrollBarWidth={scrollBarWidth} />
      )}

      {!finalDataSource?.length && !isLoading && (
        <TableVirtualEmptyData style={{ width: gridViewportSize.width, height: gridViewportSize.height - 10 }} />
      )}

      <div
        className="absolute"
        style={{
          top: minRow > 0 && useFooter ? -(stickyHeight - (stickyHeight - stickyFooterHeight)) : stickyHeight,
          left: stickyWidth * (freezedHeaders?.length || 0),
        }}
      >
        {props.children}
      </div>
    </div>
  );
});

export default TableVirtualInnerElement;
