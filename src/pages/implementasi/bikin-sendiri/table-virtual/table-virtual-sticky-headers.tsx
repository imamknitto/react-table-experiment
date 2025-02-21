import { CSSProperties, memo, useMemo } from 'react';
import clsx from 'clsx';
import TableVirtualFilterCard from './table-virtual-filter-card';
import TableVirtualSearchCard from './table-virtual-search-card';
import { useTableVirtual } from './table-virtual-context';
import IcFilterMultiple from './icons/ic-filter-multiple';
import IcSearch from './icons/ic-search';
import IcFilter from './icons/ic-filter';
import IcSort from './icons/ic-sort';
import { TSortOrder } from './hooks/use-sort-table';

const TableVirtualStickyHeaders = ({ className }: { className?: string }) => {
  const { headers, sort, filter, search, stickyWidth, freezedHeaders } = useTableVirtual();

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

  const selectedHeader = useMemo(() => {
    return [...freezedHeaders, ...headers].find(({ key }) => key === isFilterCardOpen?.key);
  }, [freezedHeaders, headers, isFilterCardOpen]);

  return (
    <>
      <div className={clsx('sticky top-0 left-0 flex flex-row z-[3]', className)}>
        {freezedHeaders?.map(
          ({ key, caption, useFilter, useSort, useSearch, useSingleFilter, ...style }, columnIndex) => {
            return (
              <HeaderItem
                isFreezed
                key={'table-header-freezed-' + key + columnIndex}
                caption={caption}
                style={{ ...style, left: columnIndex * stickyWidth }}
                columnIndex={columnIndex}
                useFilter={useFilter}
                useSort={useSort}
                useSearch={useSearch}
                useSingleFilter={useSingleFilter}
                totalHeaders={headers.length}
                handleOpenFilter={(e) => handleOpenFilter?.(e, key)}
                handleOpenSearch={(e) => handleOpenSearch?.(e, key)}
                handleSort={() => handleSort?.(key)}
                sortValue={sortKey === key ? sortBy : 'unset'}
              />
            );
          }
        )}

        <div className="absolute">
          {headers?.map(({ key, caption, useFilter, useSort, useSearch, useSingleFilter, ...style }, colIndex) => {
            return (
              <HeaderItem
                key={'table-header' + key + colIndex}
                caption={caption}
                style={{ ...style, left: (colIndex + (freezedHeaders?.length || 0)) * stickyWidth }}
                columnIndex={colIndex}
                useFilter={useFilter}
                useSort={useSort}
                useSearch={useSearch}
                useSingleFilter={useSingleFilter}
                totalHeaders={headers.length}
                handleOpenFilter={(e) => handleOpenFilter?.(e, key)}
                handleOpenSearch={(e) => handleOpenSearch?.(e, key)}
                handleSort={() => handleSort?.(key)}
                sortValue={sortKey === key ? sortBy : 'unset'}
              />
            );
          })}
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
          filterOptions={selectedHeader?.filterOptions || []}
          useSingleFilter={selectedHeader?.useSingleFilter}
        />
      )}
    </>
  );
};

interface IHeaderItem {
  style: CSSProperties;
  columnIndex: number;
  caption: string;
  totalHeaders: number;
  useFilter?: boolean;
  useSort?: boolean;
  useSearch?: boolean;
  useSingleFilter?: boolean;
  handleOpenFilter?: (e: React.MouseEvent<HTMLElement>) => void;
  handleOpenSearch?: (e: React.MouseEvent<HTMLElement>) => void;
  handleSort?: () => void;
  sortValue?: TSortOrder;
  isFreezed?: boolean;
}

const HeaderItem = ({
  style,
  columnIndex,
  caption,
  totalHeaders,
  useFilter,
  useSort,
  useSearch,
  useSingleFilter,
  handleOpenFilter,
  handleOpenSearch,
  handleSort,
  sortValue,
  isFreezed = false,
}: IHeaderItem) => {
  return (
    <div
      className={clsx(
        isFreezed ? 'sticky z-[3]' : 'absolute',
        'bg-gray-100 flex flex-row space-x-3 items-center text-xs font-bold',
        'px-1.5 border-b border-b-gray-300',
        columnIndex !== totalHeaders - 1 && 'border-r border-r-gray-300'
      )}
      style={style}
    >
      <span>{caption}</span>

      <div className="flex flex-row space-x-1.5 shrink-0 ml-auto">
        {useFilter && (
          <button className="shrink-0 cursor-pointer" onClick={(e) => handleOpenFilter?.(e)}>
            {!useSingleFilter ? (
              <IcFilterMultiple className="!size-3 text-black" />
            ) : (
              <IcFilter className="!size-2.5 text-gray-800" />
            )}
          </button>
        )}
        {useSearch && (
          <button className="shrink-0 cursor-pointer" onClick={(e) => handleOpenSearch?.(e)}>
            <IcSearch className="!size-3" />
          </button>
        )}
        {useSort && (
          <button className="shrink-0 cursor-pointer" onClick={() => handleSort?.()}>
            <IcSort sort={sortValue} />
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(TableVirtualStickyHeaders);
