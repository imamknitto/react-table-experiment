import { memo, useEffect, useState } from 'react';
import clsx from 'clsx';

import { ITableVirtualFilterAdvanceCard, TAdvanceFilterName } from './types';
import { ADVANCE_FILTER_NAMES } from './constants';
import { getKeyByValue } from './utils';
import TableVirtualDropdown from './components/table-virtual-dropdown';
import TableVirtualInput from './components/table-virtual-input';
import Portal from './components/portal';

const TableVirtualAdvanceFilterCard = ({
  filterDataKey,
  filterCardRef,
  filterCardPosition,
  onApplyAdvanceFilter,
  onResetAdvanceFilter,
  className,
  activeAdvanceFilters,
  ...props
}: ITableVirtualFilterAdvanceCard) => {
  const { filterName, value } = activeAdvanceFilters ?? {};
  const [selectedFilterName, setSelectedFilterName] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>(value || '');

  useEffect(() => {
    if (filterName?.length) {
      setSelectedFilterName(ADVANCE_FILTER_NAMES?.[filterName as TAdvanceFilterName]);
    }

    if (value?.length) setFilterValue(value);
  }, [filterName, value]);

  const handleClickApply = () => {
    if (selectedFilterName === 'None') {
      onResetAdvanceFilter?.(filterDataKey);
      return;
    }

    const key = getKeyByValue(ADVANCE_FILTER_NAMES, selectedFilterName) as TAdvanceFilterName;
    onApplyAdvanceFilter?.(filterDataKey, key, filterValue);
  };

  const handleClickReset = () => {
    onResetAdvanceFilter?.(filterDataKey);
  };

  const handleChangeFilterOpt = (value: string) => {
    setSelectedFilterName(value);
    if (value === 'None') setFilterValue('');
  };

  const filterOptions: string[] = Object.keys(ADVANCE_FILTER_NAMES).map(
    (key) => ADVANCE_FILTER_NAMES[key as keyof typeof ADVANCE_FILTER_NAMES]
  );

  return (
    <>
      <Portal>
        <div
          ref={filterCardRef}
          className={clsx(
            'fixed !z-[9999] bg-white shadow-md shadow-gray-300 border border-gray-200 rounded-md mt-2.5 w-48',
            className
          )}
          style={{ top: filterCardPosition.top, left: filterCardPosition.left }}
          {...props}
        >
          <div className="p-2.5 flex flex-col space-y-1.5">
            <p className="text-xs">Filter dengan:</p>
            <TableVirtualDropdown
              placeholder="None"
              value={selectedFilterName === 'None' ? '' : selectedFilterName}
              onSelectOption={handleChangeFilterOpt}
              options={filterOptions}
            />
            {selectedFilterName && selectedFilterName !== 'None' && (
              <TableVirtualInput
                className="w-full !text-[0.75rem]"
                placeholder="Masukkan nilai"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                onClickEnter={handleClickApply}
              />
            )}
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
    </>
  );
};

export default memo(TableVirtualAdvanceFilterCard) as typeof TableVirtualAdvanceFilterCard;
