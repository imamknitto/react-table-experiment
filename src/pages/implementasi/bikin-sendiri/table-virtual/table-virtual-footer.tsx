import clsx from 'clsx';

interface ITableVirtualFooter {
  stickyHeight: number;
  parentHeight: number;
  scrollBarWidth: number;
}

export default function TableVirtualFooter({ parentHeight, scrollBarWidth }: ITableVirtualFooter) {
  return (
    <div style={{ position: 'sticky', top: parentHeight - 36 - scrollBarWidth, left: 0, height: 36 }} className="z-[4]">
      <div className="absolute">
        {Array(5)
          .fill(true)
          .map((_, colIndex) => {
            return (
              <div
                key={'table-footer' + colIndex}
                style={{ width: 180, height: 36, left: colIndex * 180 }}
                className={clsx(
                  'absolute bg-gray-300 flex justify-center items-center',
                  'px-1.5 border-t border-t-gray-400',
                  colIndex !== 6 - 1 && 'border-r border-r-gray-400'
                )}
              >
                <p>Footer {colIndex}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
