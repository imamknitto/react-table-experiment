import { Children, forwardRef, useEffect, useState } from 'react';
import { useTableVirtual } from './table-virtual-context';
import TableVirtualHeader from './table-virtual-header';
import { ITableVirtualInnerElement } from './types';
import { getRenderedCursor } from './utils';

const TableVirtualInnerElement = forwardRef<HTMLDivElement, ITableVirtualInnerElement>((props, ref) => {
  const { stickyHeight, stickyWidth } = useTableVirtual();
  const [minRow, _maxRow, _minColumn, _maxColumn] = getRenderedCursor(Children.toArray(props.children));

  const [_parentHeight, setParentHeight] = useState<number>(0);
  const [_scrollBarWidth, setScrollBarWidth] = useState<number>(0);

  useEffect(() => {
    const element = document.querySelector('.parent-grid') as HTMLElement | null;
    if (element) {
      const height = element.offsetHeight;
      setParentHeight(height);

      const scrollbarWidth = element.offsetWidth - element.clientWidth;
      setScrollBarWidth(scrollbarWidth);
    }
  }, []);

  return (
    <div
      ref={ref}
      style={{
        ...props.style,
        width: props.style.width || 0 + stickyWidth,
        height: props.style.height || 0 + stickyHeight,
      }}
    >
      <TableVirtualHeader />

      {/* <div
        style={{ position: 'sticky', top: parentHeight - 36 - scrollBarWidth, left: 0, height: 36 }}
        className="bg-emerald-200 z-[4]"
      >
        FOOTER
      </div> */}

      {/* <div
        className="sticky left-0 z-[2]"
        style={{
          top: stickyHeight,
          width: stickyWidth,
          height: `calc(100% - ${stickyHeight}px)`,
        }}
      >
        {Array(finalDataSource.length)
          .fill(true)
          .map((_, idx) => {
            return <div key={'col' + idx} className="h-[36px] bg-blue-50"></div>;
          })}
      </div> */}

      <div className="absolute" style={{ top: minRow > 3 ? 0 : stickyHeight, left: 0 }}>
        {props.children}
      </div>
    </div>
  );
});

export default TableVirtualInnerElement;
