import clsx from 'clsx';

export default function TableVirtualFooter() {
  return (
    <div className="sticky bottom-0 left-0 flex flex-row z-[5]">
      <div className="absolute">
        {Array(5)
          .fill(true)
          .map((_, colIndex) => {
            return (
              <div
                key={'table-footer' + colIndex}
                style={{ width: 180, height: 50, left: colIndex * 180 }}
                className={clsx(
                  'absolute bg-gray-100 flex flex-row space-x-3 items-center text-xs font-bold',
                  'px-1.5 border-b border-b-gray-300',
                  colIndex !== 6 - 1 && 'border-r border-r-gray-300'
                )}
              >
                FOOTER {colIndex}
              </div>
            );
          })}
      </div>
    </div>
  );
}
