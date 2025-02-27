import { CSSProperties, forwardRef, memo, ReactNode } from 'react';
import { useTableVirtual } from './service/table-virtual-context';
import TableVirtualStickyHeaders from './table-virtual-sticky-headers';

interface Props {
  children: ReactNode;
  style: CSSProperties;
}

const TableVirtualInnerElement = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { stickyHeaderHeight, columnWidth } = useTableVirtual();

  return (
    <div
      ref={ref}
      style={{
        ...props.style,
        width: props.style.width || 0 + columnWidth,
        height: props.style.height || 0 + stickyHeaderHeight,
      }}
    >
      <TableVirtualStickyHeaders />

      <div className="absolute" style={{ top: stickyHeaderHeight, left: 0 }}>
        {props.children}
      </div>
    </div>
  );
});

export default memo(TableVirtualInnerElement);
