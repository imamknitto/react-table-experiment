import { HTMLAttributes, memo } from 'react';
import Portal from './components/portal';
import clsx from 'clsx';
import Checkbox from '../checkbox';
import { useHeaderContext } from './service/header-context';

interface Props extends HTMLAttributes<HTMLDivElement> {
  ref: React.LegacyRef<HTMLDivElement>;
  position?: { top: number; left: number };
}

const TableVirtualVisibilityColumnsCard = (props: Props) => {
  const { ref, position, className, ...properties } = props;

  const { visibilityColumnsCardOptions, visibleColumns, onChangeVisibilityColumns } =
    useHeaderContext();

  return (
    <Portal>
      <div
        ref={ref}
        className={clsx(
          'fixed !z-[9999] bg-white shadow-md shadow-gray-300 border border-gray-200 rounded-md mt-2.5 overflow-auto',
          className
        )}
        style={{
          top: position?.top,
          left: position?.left,
        }}
        {...properties}
      >
        <div className="!w-48 flex flex-col max-h-[40vh] overflow-auto">
          {visibilityColumnsCardOptions?.map((name) => {
            return (
              <div
                key={'visibility-columns-card-item-' + name}
                className={clsx(
                  'dropdown-item flex items-center gap-2 px-3 py-2 cursor-pointer',
                  'hover:!bg-blue-950/50 hover:!text-white',
                  visibleColumns.includes(name) && '!bg-blue-950 !text-white'
                )}
                onClick={() => onChangeVisibilityColumns?.(name)}
              >
                <Checkbox readOnly checked={visibleColumns.includes(name)} />
                <p className="text-sm">{name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Portal>
  );
};

export default memo(TableVirtualVisibilityColumnsCard) as typeof TableVirtualVisibilityColumnsCard;
