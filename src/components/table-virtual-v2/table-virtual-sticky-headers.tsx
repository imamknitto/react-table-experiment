import { memo, useMemo } from 'react';
import clsx from 'clsx';

import TableVirtualFilterCard from './table-virtual-filter-card';
import TableVirtualAdvanceFilterCard from './table-virtual-advance-filter-card';
import { ITableVirtualStickyHeaders } from './types';
import { useHeaderContext } from './service/header-context';
import { useDataContext } from './service/data-context';
import { useUIContext } from './service/ui-context';
import TableVirtualStickyHeaderItem from './table-virtual-sticky-header-item';
import TableVirtualMenuCard from './table-virtual-menu-card';

const TableVirtualStickyHeaders = ({ className, style }: ITableVirtualStickyHeaders) => {
  const { adjustedColumnWidth } = useUIContext();
  const { sort, filter, search, filterAdvance } = useDataContext();
  const {
    freezedHeaders,
    nonFreezedHeaders,
    totalCountFreezedHeadersWidth,
    totalCountGridWidth,
    menuCard,
  } = useHeaderContext();

  const { menuCardRef, isMenuCardOpen, onOpenMenuCard } = menuCard ?? {};

  const { sortBy, sortKey, handleSort, handleSpecificSort } = sort || {};

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

  const { updateSearch, resetSearch } = search || {};

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
            useSingleFilter,
            fixedWidth,
            ...style
          } = freezedHeader;

          headerLeftFreezedPosition += fixedWidth || adjustedColumnWidth;

          return (
            <TableVirtualStickyHeaderItem
              isFreezed
              key={'table-header-freezed-' + key + columnIndex}
              keyName={key}
              caption={caption}
              columnIndex={columnIndex}
              useFilter={useFilter}
              useAdvanceFilter={useAdvanceFilter}
              useSort={useSort}
              useSingleFilter={useSingleFilter}
              totalHeaders={freezedHeaders.length}
              handleSort={() => handleSort?.(key)}
              sortValue={sortKey === key ? sortBy : 'unset'}
              handleOpenFilter={(e) => handleOpenFilter?.(e, key)}
              handleOpenAdvanceFilter={(e) => handleOpenAdvanceFilter?.(e, key)}
              handleOpenMenuCard={(e) => onOpenMenuCard?.(e, key)}
              handleApplySearch={updateSearch}
              handleResetSearch={resetSearch}
              style={{
                ...style,
                width: fixedWidth || adjustedColumnWidth,
                left: headerLeftFreezedPosition - (fixedWidth || adjustedColumnWidth),
              }}
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
              useSingleFilter,
              fixedWidth,
              ...style
            } = nonFreezedHeader;

            headerLeftPosition += fixedWidth || adjustedColumnWidth;

            return (
              <TableVirtualStickyHeaderItem
                key={'table-header-non-freezed-' + key + colIndex}
                keyName={key}
                caption={caption}
                columnIndex={colIndex}
                useFilter={useFilter}
                useAdvanceFilter={useAdvanceFilter}
                useSort={useSort}
                useSingleFilter={useSingleFilter}
                totalHeaders={nonFreezedHeaders.length}
                handleSort={() => handleSort?.(key)}
                sortValue={sortKey === key ? sortBy : 'unset'}
                handleOpenFilter={(e) => handleOpenFilter?.(e, key)}
                handleOpenAdvanceFilter={(e) => handleOpenAdvanceFilter?.(e, key)}
                handleOpenMenuCard={(e) => onOpenMenuCard?.(e, key)}
                handleApplySearch={updateSearch}
                handleResetSearch={resetSearch}
                style={{
                  ...style,
                  width: fixedWidth || adjustedColumnWidth,
                  left:
                    (totalCountFreezedHeadersWidth || 0) +
                    headerLeftPosition -
                    (fixedWidth || adjustedColumnWidth),
                }}
              />
            );
          })}
        </div>
      </div>

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

      {isMenuCardOpen?.show && (
        <TableVirtualMenuCard
          ref={menuCardRef}
          position={isMenuCardOpen.position}
          onSort={(order) => handleSpecificSort?.(isMenuCardOpen.dataKey as string, order)}
        />
      )}
    </>
  );
};

export default memo(TableVirtualStickyHeaders);
