import { Children, forwardRef, memo } from 'react';
import { ITableVirtualInnerElement } from './types';
import { getRenderedCursor } from './utils';
import TableVirtualStickyHeaders from './table-virtual-sticky-headers';
import TableVirtualStickyColumns from './table-virtual-sticky-columns';
import TableVirtualStickyFooters from './table-virtual-sticky-footers';
import { useHeaderContext } from './service/header-context';
import { useUIContext } from './service/ui-context';
import { HEADER_GROUP_HEIGHT } from './constants';

const TableVirtualInnerElement = forwardRef<HTMLDivElement, ITableVirtualInnerElement>(
  (props, ref) => {
    const { stickyHeaderHeight, useFooter, stickyFooterHeight, isScrolling } = useUIContext();
    const {
      freezedHeaders,
      totalCountFreezedHeadersWidth,
      totalCountGridWidth,
      headersHasChildren,
    } = useHeaderContext();

    const [minRow, maxRow, _minColumn, _maxColumn] = getRenderedCursor(
      Children.toArray(props.children)
    );

    return (
      <div
        id="innerbase-grid"
        ref={ref}
        style={{
          ...props.style,
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
                : stickyHeaderHeight + (headersHasChildren ? HEADER_GROUP_HEIGHT : 0),
            left: freezedHeaders?.length ? totalCountFreezedHeadersWidth : 0,
          }}
        >
          {props.children}
        </div>
      </div>
    );
  }
);

export default memo(TableVirtualInnerElement);
