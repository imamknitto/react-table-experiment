import { CSSProperties, memo, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

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
        <div className={clsx(!useSingleFilter && 'p-1.5 flex flex-col space-y-2.5')}>
          <TableVirtualInput
            className={clsx(useSingleFilter && 'm-1.5')}
            value={searchValue}
            onChange={(e) => handleChangeSearch(e.target.value)}
          />

          <div className="h-40">
            <AutoSizer>
              {({ width, height }) => {
                return !filteredOptions?.length ? (
                  <EmptyFilter searchVal={searchValue} height={height} width={width} />
                ) : (
                  <List height={height} itemCount={filteredOptions?.length || 0} itemSize={23} width={width}>
                    {({ style, index }) => {
                      const filterValue = filteredOptions?.[index] || '';

                      return (
                        <ItemFilter
                          style={style}
                          isSingle={useSingleFilter || false}
                          value={filterValue}
                          isSelected={!!activeFilter.includes(filterValue)}
                          onSelect={(value, type) => {
                            if (type === 'single') handleSelectSingleOption(value);
                            handleChangeActiveFilter(value);
                          }}
                        />
                      );
                    }}
                  </List>
                );
              }}
            </AutoSizer>
          </div>
        </div>

        <div className="flex justify-between space-x-2.5 border-t border-t-gray-300 p-2 text-xs">
          <button className="cursor-pointer" onClick={handleClickReset}>
            Reset
          </button>

          {!useSingleFilter && (
            <button className="cursor-pointer px-1.5 py-1 bg-blue-950 text-white rounded" onClick={handleClickApply}>
              Filter
            </button>
          )}
        </div>
      </div>
    </Portal>
  );
};

interface IEmptyFilter {
  searchVal: string;
  height: number;
  width: number;
}

// Empty filter jika tidak ada data yang ditemukan.
const EmptyFilter = ({ searchVal, height, width }: IEmptyFilter) => (
  <div style={{ height, width }} className="flex justify-center items-center px-5">
    <p className="text-center text-xs text-gray-800">
      Pencarian <b>{searchVal ?? ''}</b> tidak ditemukan
    </p>
  </div>
);

interface IItemFilter {
  isSingle: boolean;
  style: CSSProperties;
  value: string;
  isSelected: boolean;
  onSelect: (value: string, type: 'single' | 'multiple') => void;
}

// Item filter dengan 2 tipe yang berbeda yaitu single dan multiple.
const ItemFilter = ({ isSingle, onSelect, style, value, isSelected }: IItemFilter) => {
  return isSingle ? (
    <div
      style={style}
      className={clsx(
        'text-xs px-1.5 py-1 hover:bg-blue-950 hover:text-white cursor-pointer truncate',
        isSelected && 'bg-blue-950 text-white'
      )}
      onClick={() => onSelect(value, 'single')}
    >
      {value}
    </div>
  ) : (
    <div style={style}>
      <TableVirtualCheckbox
        label={<p className="text-xs truncate">{value}</p>}
        checked={isSelected}
        onChecked={() => onSelect(value, 'multiple')}
      />
    </div>
  );
};

export default memo(TableVirtualFilterCard);
