import { Children, forwardRef, memo } from 'react';
import { useTableVirtual } from './service/table-virtual-context';
import { ITableVirtualInnerElement } from './types';
import { getRenderedCursor } from './utils';
import TableVirtualStickyHeaders from './table-virtual-sticky-headers';
import TableVirtualStickyColumns from './table-virtual-sticky-columns';
import TableVirtualStickyFooters from './table-virtual-sticky-footers';

const TableVirtualInnerElement = forwardRef<HTMLDivElement, ITableVirtualInnerElement>((props, ref) => {
  const {
    stickyHeaderHeight,
    useFooter,
    stickyFooterHeight,
    freezedHeaders,
    isScrolling,
    totalCountGridWidth,
    totalCountFreezedHeadersWidth,
  } = useTableVirtual();
  const [minRow, maxRow, _minColumn, _maxColumn] = getRenderedCursor(Children.toArray(props.children));

  return (
    <div
      id="innerbase-grid"
      ref={ref}
      style={{
        ...props.style,
        // width: props.style.width || 0 + adjustedColumnWidth,
        width: totalCountGridWidth,
        height: props.style.height || 0 + stickyHeaderHeight,
      }}
    >
      <TableVirtualStickyHeaders />
      <TableVirtualStickyColumns minRow={minRow} maxRow={maxRow} />
      {useFooter && <TableVirtualStickyFooters />}

      <div
        className="absolute"
        style={{
          top:
            isScrolling && useFooter
              ? -(stickyHeaderHeight - (stickyHeaderHeight - stickyFooterHeight))
              : stickyHeaderHeight,
          //   left: adjustedColumnWidth * (freezedHeaders?.length || 0),
          left: freezedHeaders?.length ? totalCountFreezedHeadersWidth : 0,
        }}
      >
        {props.children}
      </div>
    </div>
  );
});

export default memo(TableVirtualInnerElement);
