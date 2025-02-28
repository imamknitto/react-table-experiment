import { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';
import { useTableVirtual } from './service/table-virtual-context';

interface ITableVirtualFooter {
  parentHeight: number;
  scrollBarWidth: number;
}

const TableVirtualStickyFooters = ({ parentHeight, scrollBarWidth }: ITableVirtualFooter) => {
  const { nonFreezedHeaders, adjustedColumnWidth, stickyFooterHeight, freezedHeaders, finalDataSource, rowHeight } =
    useTableVirtual();
  const useAbsolutePosition = finalDataSource?.length * rowHeight < parentHeight;

  return (
    <>
      <div
        id="footers"
        className={clsx('sticky left-0 flex flex-row z-[3]')}
        style={{
          position: useAbsolutePosition ? 'absolute' : 'sticky',
          top: useAbsolutePosition
            ? parentHeight - stickyFooterHeight - 8
            : parentHeight - stickyFooterHeight - scrollBarWidth,
          height: stickyFooterHeight,
          width: adjustedColumnWidth * [...freezedHeaders, ...nonFreezedHeaders].length,
        }}
      >
        {freezedHeaders?.map(({ key, renderSummary, ...style }, columnIndex) => {
          return (
            <FooterItem
              isFreezed
              key={'table-footer-freezed-' + key + columnIndex}
              value={renderSummary?.() || ''}
              columnIndex={columnIndex}
              totalHeaders={[...freezedHeaders, ...nonFreezedHeaders].length}
              style={{ ...style, height: stickyFooterHeight, left: columnIndex * adjustedColumnWidth }}
            />
          );
        })}

        <div className="absolute">
          {nonFreezedHeaders?.map(({ key, renderSummary, ...style }, colIndex) => {
            return (
              <FooterItem
                key={'table-footer' + key + colIndex}
                columnIndex={colIndex}
                value={renderSummary?.() || ''}
                totalHeaders={[...freezedHeaders, ...nonFreezedHeaders].length}
                style={{
                  ...style,
                  height: stickyFooterHeight,
                  left: (colIndex + (freezedHeaders?.length || 0)) * adjustedColumnWidth,
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

interface IFooterItem {
  style: CSSProperties;
  columnIndex: number;
  value: ReactNode | string;
  totalHeaders: number;
  isFreezed?: boolean;
}

const FooterItem = ({ style, columnIndex, value, totalHeaders, isFreezed = false }: IFooterItem) => {
  return (
    <div
      className={clsx(
        isFreezed ? 'sticky z-[3]' : 'absolute',
        'bg-gray-100 flex flex-row space-x-3 items-center text-xs font-bold border-t border-t-gray-500',
        columnIndex !== totalHeaders - 1 && 'border-r border-r-gray-300'
      )}
      style={style}
    >
      {value}
    </div>
  );
};

export default TableVirtualStickyFooters;
