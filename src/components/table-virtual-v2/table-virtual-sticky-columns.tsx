import clsx from 'clsx';
import { useTableVirtual } from './service/table-virtual-context';
import { ITableVirtualStickyColumns } from './types';

export default function TableVirtualStickyColumns({ minRow, maxRow }: ITableVirtualStickyColumns) {
  const {
    selectedRowIndex,
    onClickRow,
    finalDataSource,
    freezedHeaders,
    stickyFooterHeight,
    useFooter,
    stickyHeaderHeight,
    adjustedColumnWidth,
    rowHeight,
    isScrolling,
  } = useTableVirtual();

  if (!freezedHeaders?.length) return;

  let currentLeftPosition = 0;

  return (
    <div style={{ marginTop: isScrolling && useFooter ? -stickyHeaderHeight - stickyFooterHeight : 0 }}>
      {freezedHeaders.map(({ key: columnKeyName, render, fixedWidth }, idx) => {
        currentLeftPosition += fixedWidth || adjustedColumnWidth;

        const columnIndex = idx;

        return (
          <div
            key={'freezed-column-item-' + idx}
            className={clsx('sticky z-[2] bg-green-50')}
            style={{
              width: adjustedColumnWidth,
              height: `calc(100% - ${stickyHeaderHeight}px)`,
              //   left: idx * adjustedColumnWidth,
              left: currentLeftPosition - (fixedWidth || adjustedColumnWidth),
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
                      '!border-l !border-l-blue-900': rowIndex === selectedRowIndex && columnIndex === 0,
                    }
                  )}
                  style={{
                    height: rowHeight,
                    width: fixedWidth || adjustedColumnWidth,
                    top: (minRow + idx) * rowHeight,
                  }}
                >
                  <div className="w-full truncate">
                    {render ? render(finalValue as string | number, rowIndex) : (finalValue as string | number)}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
