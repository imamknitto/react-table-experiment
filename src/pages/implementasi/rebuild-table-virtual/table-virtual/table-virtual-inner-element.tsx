import { Children, CSSProperties, forwardRef, memo, ReactNode } from 'react';
import TableVirtualStickyHeaders from './table-virtual-sticky-headers';
import { useTableVirtual } from './service/table-virtual-context';
import TableVirtualStickyColumns from './table-virtual-sticky-columns';
import { getRenderedCursor } from './utils';
import TableVirtualStickyFooters from './table-virtual-sticky-footers';

interface Props {
  children: ReactNode;
  style: CSSProperties;
}

const TableVirtualInnerElement = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { stickyHeaderHeight, outerSize, useFooter, stickyFooterHeight, adjustedColumnWidth, freezedHeaders } =
    useTableVirtual();
  const [minRow, maxRow, _minColumn, _maxColumn] = getRenderedCursor(Children.toArray(props.children));

  return (
    <div
      ref={ref}
      style={{
        ...props.style,
        width: props.style.width || 0 + adjustedColumnWidth,
        height: props.style.height || 0 + stickyHeaderHeight,
      }}
    >
      <TableVirtualStickyHeaders />
      <TableVirtualStickyColumns minRow={minRow} maxRow={maxRow} />
      {useFooter && <TableVirtualStickyFooters parentHeight={outerSize.height} scrollBarWidth={8} />}

      <div
        className="absolute"
        style={{
          top:
            minRow > 0 && useFooter
              ? -(stickyHeaderHeight - (stickyHeaderHeight - stickyFooterHeight))
              : stickyHeaderHeight,
          left: adjustedColumnWidth * (freezedHeaders?.length || 0),
        }}
      >
        {props.children}
      </div>
    </div>
  );
});

export default memo(TableVirtualInnerElement);
