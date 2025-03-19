import { memo, useMemo } from 'react';
import clsx from 'clsx';

import TableVirtualFilterCard from './table-virtual-filter-card';
import TableVirtualAdvanceFilterCard from './table-virtual-advance-filter-card';
import { ITableVirtualStickyHeaders } from './types';
import { useHeaderContext } from './service/header-context';
import { useDataContext } from './service/data-context';
import TableVirtualStickyHeaderItem from './table-virtual-sticky-header-item';
import TableVirtualMenuCard from './table-virtual-menu-card';
import { HEADER_GROUP_HEIGHT } from './constants';

const TableVirtualStickyHeaders = ({ className, style }: ITableVirtualStickyHeaders) => {
  const { sort, filter, search, filterAdvance } = useDataContext();
  const {
    freezedHeaders,
    freezedGroupHeaders,
    nonFreezedHeaders,
    nonFreezedGroupHeaders,
    totalCountFreezedHeadersWidth,
    totalCountGridWidth,
    menuCard,
    headersHasChildren,
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

  let headerGroupLeftPosition = 0;
  let headerLeftPosition = 0;
  let headerGroupLeftFreezedPosition = 0;
  let headerLeftFreezedPosition = 0;

  return (
    <>
      <div
        id="headers"
        className={clsx('sticky top-0 flex flex-row z-[3]', className)}
        style={{ ...style, width: totalCountGridWidth }}
      >
        <div className="sticky top-0 left-0 w-max z-[999999999]">
          {headersHasChildren && (
            <div className="relative w-full h-[36px] flex">
              {freezedGroupHeaders?.map((groupHeader, groupIdx) => {
                const { hasChildren, caption, fixedWidth, width } = groupHeader ?? {};

                headerGroupLeftFreezedPosition += fixedWidth || width;

                return (
                  <div
                    key={'grou-header-freezed' + groupIdx}
                    className="bg-gray-100 border-r border-b border-gray-300 flex justify-center items-center text-xs font-bold"
                    style={{
                      height: HEADER_GROUP_HEIGHT,
                      width: fixedWidth || width,
                      left: headerGroupLeftFreezedPosition - (fixedWidth || width),
                    }}
                  >
                    {hasChildren ? caption : ''}
                  </div>
                );
              })}
            </div>
          )}

          <div className="relative w-full bg-yellow-50 flex">
            {freezedHeaders?.map((freezedHeader, columnIndex) => {
              const {
                key,
                caption,
                useAdvanceFilter,
                useFilter,
                useSort,
                useSingleFilter,
                fixedWidth,
                width,
                ...style
              } = freezedHeader;

              headerLeftFreezedPosition += fixedWidth || width;

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
                    width: fixedWidth || width,
                    left: headerLeftFreezedPosition - (fixedWidth || width),
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="absolute">
          {headersHasChildren &&
            nonFreezedGroupHeaders?.map((groupHeader, colIndex) => {
              const { hasChildren, caption, fixedWidth, width } = groupHeader ?? {};

              headerGroupLeftPosition += fixedWidth || width;

              return (
                <div
                  key={'grou-header-' + colIndex}
                  className="absolute bg-gray-100 border-r border-b border-gray-300 flex justify-center items-center text-xs font-bold"
                  style={{
                    ...style,
                    width: fixedWidth || width,
                    height: HEADER_GROUP_HEIGHT,
                    left:
                      (totalCountFreezedHeadersWidth || 0) +
                      headerGroupLeftPosition -
                      (fixedWidth || width),
                  }}
                >
                  {hasChildren ? caption : ''}
                </div>
              );
            })}

          {nonFreezedHeaders?.map((nonFreezedHeader, colIndex) => {
            const {
              key,
              caption,
              useAdvanceFilter,
              useFilter,
              useSort,
              useSingleFilter,
              fixedWidth,
              width,
              ...style
            } = nonFreezedHeader;

            headerLeftPosition += fixedWidth || width;

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
                  width: fixedWidth || width,
                  left:
                    (totalCountFreezedHeadersWidth || 0) +
                    headerLeftPosition -
                    (fixedWidth || width),
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
