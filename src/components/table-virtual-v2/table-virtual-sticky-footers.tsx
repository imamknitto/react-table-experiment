import { CSSProperties, memo, ReactNode } from 'react';
import clsx from 'clsx';
import { useHeaderContext } from './service/header-context';
import { useDataContext } from './service/data-context';
import { useUIContext } from './service/ui-context';

const TableVirtualStickyFooters = () => {
  const {
    adjustedColumnWidth,
    stickyFooterHeight,
    rowHeight,
    useAutoWidth,
    outerSize,
    scrollbarWidth,
    columnWidth,
  } = useUIContext();
  const { finalDataSource } = useDataContext();
  const { freezedHeaders, nonFreezedHeaders, totalCountFreezedHeadersWidth, totalCountGridWidth } =
    useHeaderContext();

  const useAbsolutePosition = finalDataSource?.length * rowHeight < outerSize.height;

  const allHeaders = [...(freezedHeaders || []), ...(nonFreezedHeaders || [])];
  const hasScrollHorizontal = allHeaders?.length * columnWidth > outerSize.width;

  let footerLeftPosition = 0;
  let footerLeftFreezedPosition = 0;

  return (
    <>
      <div
        id="footers"
        className={clsx('sticky left-0 flex flex-row z-[3]')}
        style={{
          position: useAbsolutePosition ? 'absolute' : 'sticky',
          top: useAbsolutePosition
            ? outerSize.height - stickyFooterHeight - scrollbarWidth
            : outerSize.height -
              stickyFooterHeight -
              (useAutoWidth || !hasScrollHorizontal ? 2 : scrollbarWidth),
          height: stickyFooterHeight,
          width: totalCountGridWidth,
          //   width: adjustedColumnWidth * [...freezedHeaders, ...nonFreezedHeaders].length,
        }}
      >
        {freezedHeaders?.map(({ key, renderSummary, fixedWidth, ...style }, columnIndex) => {
          footerLeftFreezedPosition += fixedWidth || adjustedColumnWidth;

          return (
            <FooterItem
              isFreezed
              key={'table-footer-freezed-' + key + columnIndex}
              value={renderSummary?.() || ''}
              columnIndex={columnIndex}
              totalHeaders={[...freezedHeaders, ...(nonFreezedHeaders || [])].length}
              style={{
                ...style,
                width: fixedWidth || adjustedColumnWidth,
                height: stickyFooterHeight,
                // left: columnIndex * adjustedColumnWidth,
                left: footerLeftFreezedPosition - (fixedWidth || adjustedColumnWidth),
              }}
            />
          );
        })}

        <div className="absolute">
          {nonFreezedHeaders?.map(({ key, renderSummary, fixedWidth, ...style }, colIndex) => {
            footerLeftPosition += fixedWidth || adjustedColumnWidth;

            return (
              <FooterItem
                key={'table-footer' + key + colIndex}
                columnIndex={colIndex}
                value={renderSummary?.() || ''}
                totalHeaders={[...(freezedHeaders || []), ...nonFreezedHeaders].length}
                style={{
                  ...style,
                  //   width: adjustedColumnWidth,
                  width: fixedWidth || adjustedColumnWidth,
                  height: stickyFooterHeight,
                  //   left: (colIndex + (freezedHeaders?.length || 0)) * adjustedColumnWidth,
                  left:
                    totalCountFreezedHeadersWidth +
                    footerLeftPosition -
                    (fixedWidth || adjustedColumnWidth),
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

const FooterItem = (props: IFooterItem) => {
  const { style, columnIndex, value, totalHeaders, isFreezed = false } = props;

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

export default memo(TableVirtualStickyFooters);
