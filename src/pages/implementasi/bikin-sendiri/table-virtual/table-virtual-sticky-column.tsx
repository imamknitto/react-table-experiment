import { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';
import useColumnOverflow from './hooks/use-column-overflow';
import { useTableVirtual } from './table-virtual-context';

interface ITableVirtualStickyColumn {
  columnKeyName: string;
  stickyHeight: number;
  stickyWidth: number;
  rowHeight: number;
  minRow: number;
  maxRow: number;
  style?: CSSProperties;
  render?: (value?: number | string, rowIndex?: number) => ReactNode | string;
}

export default function TableVirtualStickyColumn({
  stickyHeight,
  stickyWidth,
  rowHeight,
  minRow,
  maxRow,
  style,
  render,
  columnKeyName,
}: ITableVirtualStickyColumn) {
  const { ref, isOverflow } = useColumnOverflow();
  const { selectedRowIndex, onClickRow, finalDataSource } = useTableVirtual();

  return (
    <div
      className={clsx('sticky z-[2] bg-white')}
      style={{
        width: stickyWidth,
        height: `calc(100% - ${stickyHeight}px)`,
        ...style,
      }}
    >
      {Array.from({ length: maxRow - minRow + 1 }).map((_, idx) => {
        const rowIndex = minRow + idx;
        const cellValue = finalDataSource[rowIndex]?.[columnKeyName as keyof (typeof finalDataSource)[0]];
        const finalValue = typeof cellValue === 'number' && cellValue === 0 ? 0 : cellValue || '';

        return (
          <div
            key={'freezed-column-row-item-' + idx}
            onClick={() => onClickRow?.(finalDataSource[rowIndex], rowIndex)}
            className={clsx(
              'border-r border-r-gray-300 border-b border-b-gray-300',
              'absolute flex items-center hover:bg-blue-100 group',
              'px-1.5 text-xs bg-gray-100 cursor-pointer',
              rowIndex % 2 !== 0 ? 'bg-gray-100' : 'bg-white',
              {
                '!border-y !border-y-blue-900 !bg-blue-100': rowIndex === selectedRowIndex,
                '!border-l !border-l-blue-900': rowIndex === selectedRowIndex && selectedRowIndex === 0,
              }
            )}
            style={{ height: rowHeight, width: stickyWidth, top: (minRow + idx) * rowHeight }}
          >
            <div ref={ref} className="whitespace-nowrap w-[150px] truncate">
              {render ? render(finalValue as string | number, rowIndex) : (finalValue as string | number)}
            </div>

            {isOverflow && (
              <div
                className={clsx(
                  'max-h-[300px] min-w-[200px] max-w-[400px] overflow-auto py-3 bg-white shadow-lg shadow-gray-300 border border-gray-200',
                  'px-2 absolute bottom-full ml-2 hidden group-hover:block z-[999999] rounded font-semibold'
                )}
              >
                {finalValue as string | number}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
