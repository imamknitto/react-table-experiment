import { CSSProperties, memo, useRef } from 'react';
import clsx from 'clsx';

import useResizableHeader from './hooks/use-resizable-header';
import { ITableVirtualHeaderItem } from './types';
import TableVirtualInput from './components/table-virtual-input';
import IcFilterMultiple from './icons/ic-filter-multiple';
import IcFilterAdvance from './icons/ic-filter-advance';
import IcFilter from './icons/ic-filter';
import IcClose from './icons/ic-close';
import IcSort from './icons/ic-sort';
import IcMenu from './icons/ic-menu';
import { useUIContext } from './service/ui-context';
import { useDataContext } from './service/data-context';
import { useHeaderContext } from './service/header-context';

const TableVirtualStickyHeaderItem = (props: ITableVirtualHeaderItem) => {
  const {
    style,
    columnIndex,
    keyName,
    caption,
    totalHeaders,
    useFilter,
    useAdvanceFilter,
    useSort,
    useSingleFilter,
    handleOpenFilter,
    handleOpenAdvanceFilter,
    handleOpenMenuCard,
    handleSort,
    handleApplySearch,
    handleResetSearch,
    sortValue,
    isFreezed = false,
  } = props;
  const { showHeaderFilter, headerFilterHeight, outerSize, scrollbarWidth } = useUIContext();
  const { filter, filterAdvance } = useDataContext();
  const { visibilityColumnsCardOptions, visibleColumns } = useHeaderContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const { boxRef, handleMouseDown, resizableWidth, isTempResize } = useResizableHeader({
    caption,
    columnIndex,
    currentWidth: Number(style.width || 180),
    isFreezed,
  });

  const handleEnterSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplySearch?.(keyName, inputRef.current?.value || '');
    }
  };

  const handleClickResetSearch = () => {
    if (inputRef.current?.value.length) {
      handleResetSearch?.(keyName);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const wrapperStyle: CSSProperties = {
    ...style,
    zIndex: isFreezed ? 99999999 - columnIndex : 9999999 - columnIndex,
  };

  const contentStyle: CSSProperties = {
    height: showHeaderFilter ? Number(style.height) - headerFilterHeight : Number(style.height),
  };

  const isHiddenColumn = visibilityColumnsCardOptions?.length !== visibleColumns.length;

  return (
    <div
      ref={boxRef}
      className={clsx('group/outer', isFreezed ? 'sticky' : 'absolute')}
      style={wrapperStyle}
    >
      <ResizeIndicator onMouseDown={handleMouseDown} />

      {isTempResize && (
        <ResizeMovingIndicator
          height={outerSize.height - scrollbarWidth}
          left={resizableWidth - 8}
        />
      )}

      <div
        style={contentStyle}
        className={clsx(
          'cursor-pointer',
          'bg-gray-100 relative flex flex-row justify-between space-x-3 items-center text-xs font-bold h-full',
          'px-1.5 border-b border-b-gray-300',
          columnIndex !== totalHeaders - 1 && 'border-r border-r-gray-300',
          isFreezed && '!border-r !border-r-gray-300'
        )}
        onClick={handleSort}
      >
        <div className="inline-flex items-center shrink-0">
          {caption}
          {useSort && (
            <button
              key="btn-column-visibility"
              className="shrink-0 cursor-pointer ms-2"
              onClick={handleSort}
            >
              <IcSort sort={sortValue} />
            </button>
          )}
        </div>

        <button
          key="btn-column-visibility"
          className="shrink-0 cursor-pointer -mr-0 relative"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenMenuCard?.(e);
          }}
        >
          <IcMenu className="!h-4 !text-gray-700" />

          {isHiddenColumn && <NodeActiveFilter className="!-top-[.2rem] !-right-[.1rem]" />}
        </button>
      </div>

      {showHeaderFilter && (
        <div
          style={{ height: headerFilterHeight }}
          className="bg-gray-100 border-r border-b border-gray-300 flex justify-center items-center gap-2 px-2"
        >
          <div className="!w-full relative group/input">
            <TableVirtualInput
              ref={inputRef}
              placeholder=""
              className="!h-[1.8rem] !bg-white !text-sm !w-full !border-gray-300 focus:!border-blue-950 pr-5"
              onKeyDown={handleEnterSearch}
            />

            <IcClose
              onClick={handleClickResetSearch}
              className={clsx(
                '!w-4 absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer',
                'opacity-0 group-hover/input:opacity-100 transition-opacity duration-200 hover:text-red-600'
              )}
            />
          </div>

          {useAdvanceFilter && (
            <button className="shrink-0 cursor-pointer relative" onClick={handleOpenAdvanceFilter}>
              <IcFilterAdvance className="!size-5 text-gray-600" />
              {filterAdvance?.activeAdvanceFilters?.[keyName] !== undefined && (
                <NodeActiveFilter className="!-top-[.1rem] !-right-[.1rem]" />
              )}
            </button>
          )}

          {useFilter && (
            <button className="shrink-0 cursor-pointer relative" onClick={handleOpenFilter}>
              {!useSingleFilter ? (
                <IcFilterMultiple className="!size-[0.85rem] text-gray-600" />
              ) : (
                <IcFilter className="!size-[1rem] text-gray-600 stroke-0" />
              )}

              {filter?.activeFilters?.[keyName] !== undefined && (
                <NodeActiveFilter className="!-top-[.3rem] !-right-[.25rem]" />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const ResizeIndicator = (props: { onMouseDown: (e: React.MouseEvent<HTMLElement>) => void }) => (
  <div
    className={clsx(
      'w-1.5 h-full  cursor-col-resize z-[9999] group-hover/outer:bg-blue-500/20',
      'absolute right-0 top-1/2 -translate-y-1/2'
    )}
    onMouseDown={props.onMouseDown}
  />
);

const ResizeMovingIndicator = (props: { height: number; left: number }) => {
  const { height, left } = props;

  return (
    <div
      className="bg-blue-500/20 absolute z-[99999999999]"
      style={{ height, width: 6, left: left }}
    />
  );
};

const NodeActiveFilter = ({ className }: { className: string }) => (
  <div
    className={clsx('size-[.45rem] rounded-full bg-blue-900 absolute -top-[.3rem]', className)}
  />
);

export default memo(TableVirtualStickyHeaderItem);
