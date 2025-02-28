import { useState } from 'react';
import clsx from 'clsx';
import { ITableVirtualSearchCard } from './types';
import TableVirtualInput from './components/table-virtual-input';
import Portal from './components/portal';

export default function TableVirtualSearchCard({
  searchDataKey,
  searchCardRef,
  searchCardPosition,
  onResetSearch,
  onApplySearch,
  activeSearch,
  className,
  ...props
}: ITableVirtualSearchCard) {
  const [searchValue, setSearchValue] = useState<string>(activeSearch || '');

  const handleClickReset = () => {
    onResetSearch?.(searchDataKey);
    setSearchValue('');
  };

  const handleClickApply = () => {
    onApplySearch?.(searchDataKey, searchValue);
  };

  return (
    <Portal>
      <div
        ref={searchCardRef}
        className={clsx(
          'fixed !z-[9999] bg-white shadow-md shadow-gray-300 border border-gray-200 rounded-md mt-2.5',
          className
        )}
        style={{ top: searchCardPosition.top, left: searchCardPosition.left }}
        {...props}
      >
        <div className="p-2.5">
          <TableVirtualInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClickEnter={handleClickApply}
          />
        </div>

        <div className="flex justify-between space-x-2.5 border-t border-t-gray-300 p-2 text-xs">
          <button className="cursor-pointer" onClick={handleClickReset}>
            Reset
          </button>
          <button className="cursor-pointer px-2 py-1 bg-blue-950 text-white rounded" onClick={handleClickApply}>
            Apply
          </button>
        </div>
      </div>
    </Portal>
  );
}
