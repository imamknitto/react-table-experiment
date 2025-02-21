import { CSSProperties } from 'react';
import clsx from 'clsx';
import useColumnOverflow from './hooks/use-column-overflow';

interface ITableVirtualStickyColumn {
  stickyHeight: number;
  stickyWidth: number;
  rowHeight: number;
  minRow: number;
  maxRow: number;
  style?: CSSProperties;
  dataCols: (string | number)[];
}

export default function TableVirtualStickyColumn({
  stickyHeight,
  stickyWidth,
  rowHeight,
  minRow,
  maxRow,
  style,
  dataCols,
}: ITableVirtualStickyColumn) {
  const { ref, isOverflow } = useColumnOverflow();

  return (
    <div
      className={clsx('sticky z-[2] bg-white')}
      style={{
        top: stickyHeight,
        width: stickyWidth,
        height: `calc(100% - ${stickyHeight}px)`,
        ...style,
      }}
    >
      {Array.from({ length: maxRow - minRow + 1 }).map((_, idx) => {
        const rowIndex = minRow + idx;

        return (
          <div
            key={'freezed-column-row-item-' + idx}
            className={clsx(
              'absolute flex items-center hover:bg-blue-900/20 group',
              'px-1.5 text-xs bg-gray-100 cursor-pointer',
              'border-r border-r-gray-300 border-b border-b-gray-300',
              rowIndex % 2 !== 0 ? 'bg-gray-100' : 'bg-white'
            )}
            style={{ height: rowHeight, width: stickyWidth, top: (minRow + idx) * rowHeight }}
          >
            <div ref={ref} className="w-full truncate">
              {dataCols?.[rowIndex]}
            </div>

            {isOverflow && (
              <div
                className={clsx(
                  'min-w-[200px] max-w-[400px] overflow-auto py-3 bg-white shadow-lg shadow-gray-300 border border-gray-200',
                  'px-2 absolute bottom-full ml-2 hidden group-hover:block z-[999999999] rounded font-semibold'
                )}
              >
                {dataCols?.[rowIndex]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
