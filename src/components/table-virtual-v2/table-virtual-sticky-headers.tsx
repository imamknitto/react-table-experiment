import { CSSProperties, memo, useMemo } from 'react';
import clsx from 'clsx';

import { TSortOrder } from './hooks/use-sort-table';
import TableVirtualFilterCard from './table-virtual-filter-card';
import TableVirtualSearchCard from './table-virtual-search-card';
import IcFilterMultiple from './icons/ic-filter-multiple';
import IcFilterAdvance from './icons/ic-filter-advance';
import IcSearch from './icons/ic-search';
import IcFilter from './icons/ic-filter';
import IcSort from './icons/ic-sort';
import TableVirtualAdvanceFilterCard from './table-virtual-advance-filter-card';
import { ITableVirtualStickyHeaders } from './types';
import useResizableHeader from './hooks/use-resizable-header';
import { useHeaderContext } from './service/header-context';
import { useDataContext } from './service/data-context';
import { useUIContext } from './service/ui-context';
import IcColumn from './icons/ic-column';
import TableVirtualVisibilityColumnsCard from './table-virtual-visibility-columns-card';

const TableVirtualStickyHeaders = ({ className, style }: ITableVirtualStickyHeaders) => {
  const { adjustedColumnWidth } = useUIContext();
  const { sort, filter, search, filterAdvance } = useDataContext();
  const {
    freezedHeaders,
    nonFreezedHeaders,
    totalCountFreezedHeadersWidth,
    totalCountGridWidth,
    onOpenVisibilityColumnsCard,
    isVisibilityColumnsCard,
    visibilityColumnsCardRef,
  } = useHeaderContext();

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
    isFilterAdvanceCardOpen,
    handleOpenAdvanceFilter,
    filterAdvanceCardRef,
    filterAdvanceCardPosition,
    applyAdvanceFilter,
    resetAdvanceFilter,
    activeAdvanceFilters,
  } = filterAdvance || {};

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
    return [...(freezedHeaders || []), ...(nonFreezedHeaders || [])]?.find(
      ({ key }) => key === isFilterCardOpen?.key
    );
  }, [freezedHeaders, nonFreezedHeaders, isFilterCardOpen]);

  let headerLeftPosition = 0;
  let headerLeftFreezedPosition = 0;

  return (
    <>
      <div
        id="headers"
        className={clsx('sticky top-0 flex flex-row z-[3]', className)}
        style={{ ...style, width: totalCountGridWidth }}
      >
        {freezedHeaders?.map((freezedHeader, columnIndex) => {
          const {
            key,
            caption,
            useAdvanceFilter,
            useFilter,
            useSort,
            useSearch,
            useSingleFilter,
            fixedWidth,
            ...style
          } = freezedHeader;

          headerLeftFreezedPosition += fixedWidth || adjustedColumnWidth;

          return (
            <HeaderItem
              isFreezed
              key={'table-header-freezed-' + key + columnIndex}
              caption={caption}
              style={{
                ...style,
                width: fixedWidth || adjustedColumnWidth,
                left: headerLeftFreezedPosition - (fixedWidth || adjustedColumnWidth),
              }}
              columnIndex={columnIndex}
              useFilter={useFilter}
              useAdvanceFilter={useAdvanceFilter}
              useSort={useSort}
              useSearch={useSearch}
              useSingleFilter={useSingleFilter}
              totalHeaders={freezedHeaders.length}
              handleSort={() => handleSort?.(key)}
              sortValue={sortKey === key ? sortBy : 'unset'}
              handleOpenFilter={(e) => handleOpenFilter?.(e, key)}
              handleOpenSearch={(e) => handleOpenSearch?.(e, key)}
              handleOpenAdvanceFilter={(e) => handleOpenAdvanceFilter?.(e, key)}
              handleOpenVisibilityColumnsCard={(e) => onOpenVisibilityColumnsCard?.(e)}
            />
          );
        })}

        <div className="absolute">
          {nonFreezedHeaders?.map((nonFreezedHeader, colIndex) => {
            const {
              key,
              caption,
              useAdvanceFilter,
              useFilter,
              useSort,
              useSearch,
              useSingleFilter,
              fixedWidth,
              ...style
            } = nonFreezedHeader;

            headerLeftPosition += fixedWidth || adjustedColumnWidth;

            return (
              <HeaderItem
                key={'table-header' + key + colIndex}
                caption={caption}
                style={{
                  ...style,
                  width: fixedWidth || adjustedColumnWidth,
                  left:
                    (totalCountFreezedHeadersWidth || 0) +
                    headerLeftPosition -
                    (fixedWidth || adjustedColumnWidth),
                }}
                columnIndex={colIndex}
                useFilter={useFilter}
                useAdvanceFilter={useAdvanceFilter}
                useSort={useSort}
                useSearch={useSearch}
                useSingleFilter={useSingleFilter}
                totalHeaders={nonFreezedHeaders.length}
                handleSort={() => handleSort?.(key)}
                sortValue={sortKey === key ? sortBy : 'unset'}
                handleOpenFilter={(e) => handleOpenFilter?.(e, key)}
                handleOpenSearch={(e) => handleOpenSearch?.(e, key)}
                handleOpenAdvanceFilter={(e) => handleOpenAdvanceFilter?.(e, key)}
                handleOpenVisibilityColumnsCard={(e) => onOpenVisibilityColumnsCard?.(e)}
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

      {isFilterAdvanceCardOpen?.show && filterAdvanceCardRef && filterAdvanceCardPosition && (
        <TableVirtualAdvanceFilterCard
          filterDataKey={isFilterAdvanceCardOpen.key}
          filterCardRef={filterAdvanceCardRef}
          filterCardPosition={filterAdvanceCardPosition}
          onApplyAdvanceFilter={applyAdvanceFilter}
          onResetAdvanceFilter={resetAdvanceFilter}
          activeAdvanceFilters={activeAdvanceFilters?.[isFilterAdvanceCardOpen.key]}
        />
      )}

      {isVisibilityColumnsCard?.show && (
        <TableVirtualVisibilityColumnsCard
          ref={visibilityColumnsCardRef}
          position={isVisibilityColumnsCard?.position}
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
  useAdvanceFilter?: boolean;
  useSort?: boolean;
  useSearch?: boolean;
  useSingleFilter?: boolean;
  handleOpenFilter?: (e: React.MouseEvent<HTMLElement>) => void;
  handleOpenAdvanceFilter?: (e: React.MouseEvent<HTMLElement>) => void;
  handleOpenSearch?: (e: React.MouseEvent<HTMLElement>) => void;
  handleOpenVisibilityColumnsCard?: (e: React.MouseEvent<HTMLElement>) => void;
  handleSort?: () => void;
  sortValue?: TSortOrder;
  isFreezed?: boolean;
}

const HeaderItem = (props: IHeaderItem) => {
  const {
    style,
    columnIndex,
    caption,
    totalHeaders,
    useFilter,
    useAdvanceFilter,
    useSort,
    useSearch,
    useSingleFilter,
    handleOpenFilter,
    handleOpenAdvanceFilter,
    handleOpenSearch,
    handleOpenVisibilityColumnsCard,
    handleSort,
    sortValue,
    isFreezed = false,
  } = props;

  const { boxRef, handleMouseDown } = useResizableHeader({
    caption,
    columnIndex,
    currentWidth: Number(style.width || 180),
    isFreezed,
  });

  const actionButtons = [
    {
      condition: useAdvanceFilter,
      icon: <IcFilterAdvance className="!size-5 text-gray-600" />,
      onClick: handleOpenAdvanceFilter,
    },
    {
      condition: useFilter,
      icon: !useSingleFilter ? (
        <IcFilterMultiple className="!size-[0.85rem] text-gray-600" />
      ) : (
        <IcFilter className="!size-[1rem] text-gray-600 stroke-0" />
      ),
      onClick: handleOpenFilter,
    },
    {
      condition: useSearch,
      icon: <IcSearch className="!size-[0.85rem] text-gray-600" />,
      onClick: handleOpenSearch,
    },
    { condition: useSort, icon: <IcSort sort={sortValue} />, onClick: handleSort },
  ];

  return (
    <div
      ref={boxRef}
      className={clsx(isFreezed ? 'sticky' : 'absolute')}
      style={{
        ...style,
        zIndex: isFreezed ? 99999999 - columnIndex : 9999999 - columnIndex,
      }}
    >
      <div
        className={clsx(
          'bg-gray-100 relative flex flex-row justify-between space-x-3 items-center text-xs font-bold h-full group',
          'px-1.5 border-b border-b-gray-300',
          columnIndex !== totalHeaders - 1 && 'border-r border-r-gray-300',
          isFreezed && '!border-r !border-r-gray-300'
        )}
      >
        <span>{caption}</span>

        <div className="flex flex-row space-x-1.5 shrink-0 -mr-0">
          <button
            key="btn-column-visibility"
            className="shrink-0 cursor-pointer"
            onClick={handleOpenVisibilityColumnsCard}
          >
            <IcColumn className="!h-5 !text-gray-700" />
          </button>

          {actionButtons.map(
            ({ condition, icon, onClick }, index) =>
              condition && (
                <button
                  key={index}
                  className="shrink-0 cursor-pointer"
                  onClick={(e) => onClick?.(e)}
                >
                  {icon}
                </button>
              )
          )}
        </div>

        <div
          className="w-1 h-full absolute right-0 cursor-col-resize top-1/2 -translate-y-1/2 group-hover:bg-blue-300/20 z-[9999]"
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default memo(TableVirtualStickyHeaders);
