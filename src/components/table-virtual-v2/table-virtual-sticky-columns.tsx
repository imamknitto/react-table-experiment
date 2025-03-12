import { Fragment, memo, useRef } from 'react';
import clsx from 'clsx';
import { ITableVirtualStickyColumns } from './types';
import useOnClickOutside from './hooks/use-click-outside';
import TableRightClickCardWrapper from './components/table-right-click-card-wrapper';
import { useHeaderContext } from './service/header-context';
import { useDataContext } from './service/data-context';
import { useUIContext } from './service/ui-context';

const TableVirtualStickyColumns = ({ minRow, maxRow }: ITableVirtualStickyColumns) => {
  const rightClickWrapperRef = useRef<HTMLDivElement>(null);

  const {
    selectedRowIndex,
    onClickGridRow,
    stickyFooterHeight,
    useFooter,
    stickyHeaderHeight,
    adjustedColumnWidth,
    rowHeight,
    isScrolling,
    onRightClickCell,
    cellPosition,
    renderRightClickRow,
    classNameCell,
  } = useUIContext();
  const { finalDataSource } = useDataContext();
  const { freezedHeaders } = useHeaderContext();

  useOnClickOutside(rightClickWrapperRef, () => onRightClickCell?.(null));

  if (!freezedHeaders?.length) return;

  let currentLeftPosition = 0;

  return (
    <div
      style={{ marginTop: isScrolling && useFooter ? -stickyHeaderHeight - stickyFooterHeight : 0 }}
    >
      {freezedHeaders.map(({ key: columnKeyName, render, fixedWidth }, idx) => {
        const columnIndex = idx;

        currentLeftPosition += fixedWidth || adjustedColumnWidth;

        return (
          <div
            key={'freezed-column-item-' + idx}
            className={clsx('sticky z-[2] bg-green-50')}
            style={{
              width: adjustedColumnWidth,
              height: `calc(100% - ${stickyHeaderHeight}px)`,
              //   left: idx * adjustedColumnWidth,
              left: currentLeftPosition - (fixedWidth || adjustedColumnWidth),
            }}
          >
            {Array.from({ length: maxRow - minRow + 1 }).map((_, idx) => {
              const rowIndex = minRow + idx;

              const cellValue =
                finalDataSource[rowIndex]?.[columnKeyName as keyof (typeof finalDataSource)[0]];
              const finalValue =
                typeof cellValue === 'number' && cellValue === 0 ? 0 : cellValue || '';
              const isFreezed = freezedHeaders?.find(({ key }) => key === columnKeyName)?.freezed;

              return (
                <Fragment key={'freezed-column-row-item-' + idx}>
                  <div
                    onClick={() => onClickGridRow?.(finalDataSource[rowIndex], rowIndex)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      onRightClickCell?.({
                        x: e.clientX,
                        y: e.clientY,
                        rowIndex,
                        columnIndex,
                        isFreezed: true,
                      });
                    }}
                    className={clsx(
                      'border-r border-r-gray-300 border-b border-b-gray-300',
                      'absolute flex items-center hover:bg-blue-100 hover:border hover:border-blue-900 group',
                      'px-1.5 text-xs bg-gray-100 cursor-pointer',
                      rowIndex % 2 !== 0 ? 'bg-gray-100' : 'bg-white',
                      {
                        '!border-y !border-y-blue-900 !bg-blue-100': rowIndex === selectedRowIndex,
                        '!border-l !border-l-blue-900':
                          rowIndex === selectedRowIndex && columnIndex === 0,
                      },
                      classNameCell?.(finalDataSource[rowIndex], rowIndex, columnIndex, true)
                    )}
                    style={{
                      height: rowHeight,
                      width: fixedWidth || adjustedColumnWidth,
                      top: (minRow + idx) * rowHeight,
                    }}
                  >
                    <div className="w-full truncate">
                      {render
                        ? render(finalValue as string | number, rowIndex)
                        : (finalValue as string | number)}
                    </div>
                  </div>

                  {renderRightClickRow &&
                    cellPosition &&
                    cellPosition.rowIndex === rowIndex &&
                    cellPosition.columnIndex === columnIndex &&
                    cellPosition.isFreezed === isFreezed && (
                      <TableRightClickCardWrapper
                        ref={rightClickWrapperRef}
                        position={cellPosition}
                      >
                        {renderRightClickRow?.(
                          finalDataSource[rowIndex],
                          finalValue as string | number,
                          () => onRightClickCell?.(null)
                        )}
                      </TableRightClickCardWrapper>
                    )}
                </Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default memo(TableVirtualStickyColumns);
