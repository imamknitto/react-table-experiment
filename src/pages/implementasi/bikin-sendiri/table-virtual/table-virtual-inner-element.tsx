import { Children, forwardRef, useEffect, useState } from 'react';
import { useTableVirtual } from './table-virtual-context';
import TableVirtualHeader from './table-virtual-header';
import { ITableVirtualInnerElement } from './types';
import { getRenderedCursor } from './utils';
import TableVirtualEmptyData from './table-virtual-empty-data';
import TableVirtualLoading from './table-virtual-loading';

const TableVirtualInnerElement = forwardRef<HTMLDivElement, ITableVirtualInnerElement>((props, ref) => {
  const { stickyHeight, stickyWidth, finalDataSource, isLoading } = useTableVirtual();
  const [_minRow, maxRow, _minColumn, _maxColumn] = getRenderedCursor(Children.toArray(props.children));

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
      className="relative"
    >
      <TableVirtualHeader />

      {isLoading && <TableVirtualLoading style={{ width: gridBoxSize.width, height: gridBoxSize.height - 10 }} />}

      {!finalDataSource?.length && !isLoading && (
        <TableVirtualEmptyData style={{ width: gridBoxSize.width, height: gridBoxSize.height - 10 }} />
      )}
      <div className="absolute" style={{ top: stickyHeight, left: 0 }}>
        {props.children}
      </div>
    </div>
  );
});

export default TableVirtualInnerElement;
