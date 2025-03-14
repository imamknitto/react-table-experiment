import { HTMLAttributes, memo, useState } from 'react';
import clsx from 'clsx';
import Portal from './components/portal';
import TableVirtualVisibilityColumnsCard from './table-virtual-visibility-columns-card';
import { useUIContext } from './service/ui-context';

interface Props extends HTMLAttributes<HTMLDivElement> {
  ref: React.LegacyRef<HTMLDivElement>;
  position?: { top: number; left: number };
  onSort: (order: 'asc' | 'desc' | 'unset') => void;
}

const LIST_MENU = ['Sort Ascending', 'Sort Descending', 'Unsort', 'Kolom', 'Tutup Filter'] as const;

const TableVirtualMenuCard = (props: Props) => {
  const { onSort, className, position, ref, ...properties } = props;
  const { onToggleHeaderFilter, showHeaderFilter } = useUIContext();

  const [isKolomOpen, setIsKolomOpen] = useState({
    show: false,
    position: { top: 0, left: 0 },
  });

  const handleClickMenu = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    menu: (typeof LIST_MENU)[number]
  ) => {
    switch (menu) {
      case 'Kolom':
        return handleOpenColumnVibilityCard(e);
      case 'Sort Ascending':
        return onSort('asc');
      case 'Sort Descending':
        return onSort('desc');
      case 'Unsort':
        return onSort('unset');
      case 'Tutup Filter':
        return onToggleHeaderFilter?.();
      default:
        break;
    }

    setIsKolomOpen({ show: false, position: { top: 0, left: 0 } });
  };

  const handleOpenColumnVibilityCard = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const innerWidth = window.innerWidth;
    const rect = e.currentTarget.getBoundingClientRect();
    let calculatedLeft = rect.left + rect.width;

    if (rect.left + rect.width > innerWidth - rect.width) {
      calculatedLeft = rect.left - rect.width;
    }

    setIsKolomOpen({
      show: true,
      position: { top: rect.top, left: calculatedLeft },
    });
  };

  const menuCardStyle = {
    top: position?.top,
    left: position?.left,
  };

  return (
    <Portal>
      <div
        ref={ref}
        className={clsx(
          'fixed !z-[9999] bg-white shadow-md shadow-gray-300 border border-gray-200 rounded-md mt-2.5 overflow-auto',
          className
        )}
        style={menuCardStyle}
        {...properties}
      >
        <div className="!w-48 flex flex-col max-h-[40vh] overflow-auto">
          {LIST_MENU.map((menu) => {
            return (
              <button
                key={'menu-card-item-' + menu}
                className={clsx(
                  'dropdown-item flex items-center gap-2 px-3 py-2 cursor-pointer',
                  'hover:bg-blue-950 hover:text-white'
                )}
                onClick={(e) => handleClickMenu(e, menu)}
              >
                <p className={clsx('text-sm')}>
                  {menu === 'Tutup Filter' && !showHeaderFilter ? 'Buka Filter' : menu}
                </p>
              </button>
            );
          })}

          {isKolomOpen.show && (
            <div
              className="fixed w-48 p-1"
              style={{ top: isKolomOpen.position.top, left: isKolomOpen.position.left }}
            >
              <TableVirtualVisibilityColumnsCard />
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default memo(TableVirtualMenuCard);
