import clsx from 'clsx';
import { ITableVirtualColumn } from './types';
import useColumnOverflow from './hooks/use-column-overflow';
import { useTableVirtual } from './table-virtual-context';

export default function TableVirtualColumn<TDataSource>({
  rowIndex,
  columnIndex,
  style,
  activeRowIndex,
  onClickRow,
}: ITableVirtualColumn<TDataSource>) {
  const { ref, isOverflow } = useColumnOverflow();
  const { headers, finalDataSource } = useTableVirtual();

  const headerKey = headers?.[columnIndex]?.key;
  const headerClassName = headers?.[columnIndex]?.className;
  const headerRender = headers?.[columnIndex]?.render;

  const cellValue = finalDataSource[rowIndex]?.[headerKey as keyof (typeof finalDataSource)[0]];
  const finalValue = typeof cellValue === 'number' && cellValue === 0 ? 0 : cellValue || '';

  const handleClickColumn = () => {
    if (onClickRow) {
      onClickRow?.(finalDataSource[rowIndex] as TDataSource, rowIndex);
      return;
    }
  };

  return (
    <div
      style={style}
      onClick={handleClickColumn}
      className={clsx(
        'relative group text-xs hover:bg-blue-900/20',
        'flex flex-row items-center px-1.5 border-b border-b-gray-300',
        columnIndex !== headers?.length - 1 && 'border-r border-r-gray-300',
        onClickRow && '!cursor-pointer',
        rowIndex % 2 !== 0 ? 'bg-gray-100' : 'bg-white',
        headerClassName,
        {
          '!border-y !border-y-blue-900 !bg-blue-800/20': rowIndex === activeRowIndex,
          '!border-l !border-l-blue-900': rowIndex === activeRowIndex && columnIndex === 0,
          '!border-r !border-r-blue-900': rowIndex === activeRowIndex && columnIndex === headers?.length - 1,
        }
      )}
    >
      <div ref={ref} className="truncate w-full">
        {headerRender ? headerRender(finalValue as string | number, rowIndex) : (finalValue as string | number)}
      </div>

      {isOverflow && (
        <div
          className={clsx(
            'min-w-[200px] max-w-[400px] overflow-auto py-3 bg-white shadow-lg shadow-gray-300 border border-gray-200',
            'px-2 absolute bottom-full ml-2 hidden group-hover:block z-[999999] rounded font-semibold'
          )}
        >
          {finalValue as string | number}
        </div>
      )}
    </div>
  );
}
