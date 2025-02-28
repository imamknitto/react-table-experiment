import { memo } from 'react';
import clsx from 'clsx';
import { ITableVirtualCell } from './types';
import useColumnOverflow from './hooks/use-column-overflow';
import { useTableVirtual } from './service/table-virtual-context';

const TableVirtualCell = ({ rowIndex, columnIndex, style }: ITableVirtualCell) => {
  const { ref, isOverflow } = useColumnOverflow();
  const { nonFreezedHeaders, finalDataSource, selectedRowIndex, onClickRow, freezedHeaders } = useTableVirtual();

  const headerKey = nonFreezedHeaders?.[columnIndex]?.key;
  const headerRender = nonFreezedHeaders?.[columnIndex]?.render;

  const cellValue = finalDataSource[rowIndex]?.[headerKey as keyof (typeof finalDataSource)[0]];
  const finalValue = typeof cellValue === 'number' && cellValue === 0 ? 0 : cellValue || '';

  const handleClickColumn = () => {
    if (onClickRow) {
      onClickRow?.(finalDataSource[rowIndex], rowIndex);
      return;
    }
  };

  return (
    <div
      style={{ ...style }}
      onClick={handleClickColumn}
      className={clsx(
        'relative group text-xs hover:bg-blue-100',
        'flex flex-row items-center px-1.5 border-b border-b-gray-300',
        columnIndex !== nonFreezedHeaders?.length - 1 && 'border-r border-r-gray-300',
        onClickRow && '!cursor-pointer',
        rowIndex % 2 !== 0 ? 'bg-gray-100' : 'bg-white',
        {
          '!border-y !border-y-blue-900 !bg-blue-100': rowIndex === selectedRowIndex,
          '!border-l !border-l-blue-900': rowIndex === selectedRowIndex && columnIndex === 0 && !freezedHeaders?.length,
          '!border-r !border-r-blue-900':
            rowIndex === selectedRowIndex && columnIndex === nonFreezedHeaders?.length - 1,
        }
      )}
    >
      <div ref={ref} className="truncate w-full">
        {headerRender ? headerRender(finalValue as string | number, rowIndex) : (finalValue as string | number)}
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
};

export default memo(TableVirtualCell);
