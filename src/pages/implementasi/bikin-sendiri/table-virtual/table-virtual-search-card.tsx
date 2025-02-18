import clsx from 'clsx';
import Portal from '../../../../components/portal';
import { ITableVirtualSearchCard } from './types';
import { useState } from 'react';

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
          <input
            type="text"
            placeholder="Cari..."
            className=" outline-none border border-gray-200 rounded h-8 px-1.5 w-44 text-xs"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleClickApply();
              }
            }}
          />
        </div>

        <div className="flex justify-end space-x-2.5 border-t border-t-gray-300 p-2 text-xs">
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
