import { memo, useState } from 'react';
import clsx from 'clsx';
import Portal from './components/portal';
import { ITableVirtualFilterCard } from './types';
import TableVirtualInput from './components/table-virtual-input';
import TableVirtualCheckbox from './components/table-virtual-checkbox';

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
  const [filteredOptions, setFilteredOptions] = useState(filterOptions);
  const [searchValue, setSearchValue] = useState('');

  const handleChangeSearch = (searchValue: string) => {
    setSearchValue(searchValue);
    setFilteredOptions(filterOptions?.filter((option) => option.toLowerCase().includes(searchValue.toLowerCase())));
  };

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
          'fixed !z-[9999] bg-white shadow-md shadow-gray-300 border border-gray-200 rounded-md mt-2.5 max-w-48',
          className
        )}
        {...props}
      >
        <div className={clsx(!useSingleFilter && 'p-2 flex flex-col space-y-2.5')}>
          <TableVirtualInput
            className={clsx(useSingleFilter && 'm-2')}
            value={searchValue}
            onChange={(e) => handleChangeSearch(e.target.value)}
          />

          <div
            className={clsx(
              'max-h-44 overflow-auto flex flex-col space-y-1 w-full',
              useSingleFilter && '!p-0 !space-y-0'
            )}
          >
            {filteredOptions?.map((filter, idx) =>
              !useSingleFilter ? (
                <TableVirtualCheckbox
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
        </div>

        <div className="flex justify-between space-x-2.5 border-t border-t-gray-300 p-2 text-xs">
          <button className="cursor-pointer" onClick={handleClickReset}>
            Reset
          </button>

          {!useSingleFilter && (
            <button className="cursor-pointer px-2 py-1 bg-blue-950 text-white rounded" onClick={handleClickApply}>
              Filter
            </button>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default memo(TableVirtualFilterCard);
