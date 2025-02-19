import clsx from 'clsx';
import useColumnOverflow from './hooks/use-column-overflow';

interface ITableVirtualStickyColumn<TData> {
  stickyHeight: number;
  stickyWidth: number;
  rowHeight: number;
  minRow: number;
  maxRow: number;
  dataSource: TData[];
  className?: string;
}

export default function TableVirtualStickyColumn<TData>({
  stickyHeight,
  stickyWidth,
  rowHeight,
  minRow,
  maxRow,
  dataSource,
  className,
}: ITableVirtualStickyColumn<TData>) {
  const { ref, isOverflow } = useColumnOverflow();

  return (
    <div
      className={clsx('sticky left-0 z-[2] bg-white', className)}
      style={{
        top: stickyHeight,
        width: stickyWidth,
        height: `calc(100% - ${stickyHeight}px)`,
      }}
    >
      {Array.from({ length: maxRow - minRow + 1 }).map((_, idx) => {
        const rowIndex = minRow + idx;

        return (
          <div
            key={'sticky-column-row-item' + idx}
            className={clsx(
              'absolute flex items-center hover:bg-blue-900/20 group',
              'px-1.5 text-xs bg-gray-100 cursor-pointer',
              'border-r border-r-gray-300 border-b border-b-gray-300',
              rowIndex % 2 !== 0 ? 'bg-gray-100' : 'bg-white'
            )}
            style={{ height: rowHeight, width: stickyWidth, top: (minRow + idx) * rowHeight }}
          >
            <div ref={ref} className="w-full truncate">
              {dataSource[rowIndex]?.['nama_produk' as keyof (typeof dataSource)[0]] as string | number}
            </div>

            {isOverflow && (
              <div
                className={clsx(
                  'min-w-[200px] max-w-[400px] overflow-auto py-3 bg-white shadow-lg shadow-gray-300 border border-gray-200',
                  'px-2 absolute bottom-full ml-2 hidden group-hover:block z-[999999999] rounded font-semibold'
                )}
              >
                {dataSource[rowIndex]?.['nama_produk' as keyof (typeof dataSource)[0]] as string | number}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
