import { memo, useState } from 'react';
import clsx from 'clsx';
import Checkbox from '../../../../components/checkbox';
import Portal from '../../../../components/portal';
import { ITableVirtualFilterCard } from './types';

const TableVirtualFilterCard = ({
  filterDataKey,
  filterOptions,
  filterCardRef,
  filterPosition,
  activeFilters,
  onResetFilter,
  onApplyFilter,
  className,
  useSingleFilter,
  ...props
}: ITableVirtualFilterCard) => {
  const [activeFilter, setActiveFilter] = useState<string[]>(activeFilters || []);

  const handleChangeActiveFilter = (filter: string) => {
    setActiveFilter((prev) => (prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]));
  };

  const handleSelectSingleOption = (filter: string) => {
    onApplyFilter?.(filterDataKey, [filter]);
    handleChangeActiveFilter(filter);
  };

  const handleClickReset = () => {
    onResetFilter?.(filterDataKey);
    setActiveFilter([]);
  };

  const handleClickApply = () => {
    onApplyFilter?.(filterDataKey, activeFilter);
  };

  return (
    <Portal>
      <div
        ref={filterCardRef}
        style={{ top: filterPosition.top, left: filterPosition.left }}
        className={clsx(
          'fixed !z-[9999] bg-white shadow-md shadow-gray-300 border border-gray-200 rounded-md mt-2.5',
          className
        )}
        {...props}
      >
        <div
          className={clsx(
            'max-h-44 overflow-auto flex flex-col space-y-1 p-2 w-48',
            useSingleFilter && '!p-0 !space-y-0'
          )}
        >
          {filterOptions?.map((filter, idx) =>
            !useSingleFilter ? (
              <Checkbox
                key={'checkbox-filter-multiple' + filterDataKey + idx}
                label={<p className="text-xs">{filter}</p>}
                checked={!!activeFilter.includes(filter)}
                onChecked={() => handleChangeActiveFilter(filter)}
              />
            ) : (
              <div
                key={'checkbox-filter-single' + filterDataKey + idx}
                className={clsx(
                  'text-xs px-2 py-1 hover:bg-blue-950 hover:text-white cursor-pointer',
                  !!activeFilter.includes(filter) && 'bg-blue-950 text-white'
                )}
                onClick={() => handleSelectSingleOption(filter)}
              >
                {filter}
              </div>
            )
          )}
        </div>

        <div className="flex justify-end space-x-2.5 border-t border-t-gray-300 p-2 text-xs font-semibold">
          <button className="cursor-pointer" onClick={handleClickReset}>
            Reset
          </button>
          {!useSingleFilter && (
            <button className="cursor-pointer px-2 py-1 bg-blue-950 text-white rounded" onClick={handleClickApply}>
              Apply
            </button>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default memo(TableVirtualFilterCard);
