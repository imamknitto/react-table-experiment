import { memo } from 'react';
import clsx from 'clsx';
import Checkbox from '../checkbox';
import { useHeaderContext } from './service/header-context';

const TableVirtualVisibilityColumnsCard = () => {
  const { visibilityColumnsCardOptions, visibleColumns, onChangeVisibilityColumns } =
    useHeaderContext();

  return (
    <div
      className={clsx(
        'bg-white shadow-md shadow-gray-300 border border-gray-200 rounded-md mt-2.5 overflow-auto w-full'
      )}
    >
      <div className="flex flex-col max-h-[40vh] overflow-auto">
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
  );
};

export default memo(TableVirtualVisibilityColumnsCard);
