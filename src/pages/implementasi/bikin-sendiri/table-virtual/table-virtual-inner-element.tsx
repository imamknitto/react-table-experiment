import { Children, forwardRef } from 'react';
import { useTableVirtual } from './table-virtual-context';
import TableVirtualHeader from './table-virtual-header';
import { ITableVirtualInnerElement } from './types';
import { getRenderedCursor } from './utils';

const TableVirtualInnerElement = forwardRef<HTMLDivElement, ITableVirtualInnerElement>((props, ref) => {
  const { stickyHeight, stickyWidth } = useTableVirtual();
  const [_minRow, _maxRow, _minColumn, _maxColumn] = getRenderedCursor(Children.toArray(props.children));

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
      <div className="absolute" style={{ top: stickyHeight, left: 0 }}>
        {props.children}
      </div>
    </div>
  );
});

export default TableVirtualInnerElement;
