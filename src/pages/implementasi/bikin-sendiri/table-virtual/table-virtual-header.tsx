import { memo } from 'react';
import clsx from 'clsx';
import TableVirtualFilterCard from './table-virtual-filter-card';
import TableVirtualSearchCard from './table-virtual-search-card';
import IcFilter from './icons/ic-filter';
import IcSearch from './icons/ic-search';
import IcSort from './icons/ic-sort';
import { useTableVirtual } from './table-virtual-context';
import IcFilterMultiple from './icons/ic-filter-multiple';

const TableVirtualHeader = () => {
  const { headers, sort, filter, search } = useTableVirtual();

  const { sortBy, sortKey, handleSort } = sort || {};
  const {
    isFilterCardOpen,
    handleOpenFilter,
    filterCardRef,
    filterCardPosition,
    activeFilters,
    updateFilter,
    resetFilter,
  } = filter || {};
  const {
    isSearchCardOpen,
    handleOpenSearch,
    searchCardRef,
    searchCardPosition,
    activeSearch,
    updateSearch,
    resetSearch,
  } = search || {};

  return (
    <>
      <div className="sticky top-0 left-0 flex flex-row z-[3]">
        <div className="absolute">
          {headers?.map(({ key, caption, useFilter, useSort, useSearch, useSingleFilter, ...style }, colIndex) => (
            <div
              key={'table-header' + key + colIndex}
              style={style}
              className={clsx(
                'absolute bg-gray-100 flex flex-row space-x-3 items-center text-xs font-bold',
                'px-1.5 border-b border-b-gray-300',
                colIndex !== headers.length - 1 && 'border-r border-r-gray-300'
              )}
            >
              <span>{caption}</span>

              <div className="flex flex-row space-x-1.5 shrink-0 ml-auto">
                {useFilter && (
                  <button className="shrink-0 cursor-pointer" onClick={(e) => handleOpenFilter?.(e, key)}>
                    {!useSingleFilter ? (
                      <IcFilterMultiple className="!size-3 text-black" />
                    ) : (
                      <IcFilter className="!size-2.5 text-gray-800" />
                    )}
                  </button>
                )}
                {useSearch && (
                  <button className="shrink-0 cursor-pointer" onClick={(e) => handleOpenSearch?.(e, key)}>
                    <IcSearch className="!size-3" />
                  </button>
                )}
                {useSort && (
                  <button className="shrink-0 cursor-pointer" onClick={() => handleSort?.(key)}>
                    <IcSort sort={sortKey === key ? sortBy : 'unset'} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isSearchCardOpen?.show && searchCardRef && searchCardPosition && (
        <TableVirtualSearchCard
          searchCardRef={searchCardRef}
          searchCardPosition={searchCardPosition}
          searchDataKey={isSearchCardOpen.key}
          onApplySearch={updateSearch}
          onResetSearch={resetSearch}
          activeSearch={activeSearch?.[isSearchCardOpen.key] || ''}
        />
      )}

      {isFilterCardOpen?.show && filterCardRef && filterCardPosition && (
        <TableVirtualFilterCard
          filterDataKey={isFilterCardOpen.key}
          filterCardRef={filterCardRef}
          filterPosition={filterCardPosition}
          onApplyFilter={updateFilter}
          onResetFilter={resetFilter}
          activeFilters={activeFilters?.[isFilterCardOpen.key] || []}
          filterOptions={headers.find(({ key }) => key === isFilterCardOpen.key)?.filterOptions || []}
          useSingleFilter={headers.find(({ key }) => key === isFilterCardOpen.key)?.useSingleFilter}
        />
      )}
    </>
  );
};

export default memo(TableVirtualHeader);
