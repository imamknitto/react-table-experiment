import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useOnClickOutside from '../hooks/use-click-outside';
import IcChevron from '../icons/ic-chevon';

interface ITableVirtualDropdown {
  options: string[];
  onSelectOption?: (option: string) => void;
  value: string;
  placeholder?: string;
}

export default function TableVirtualDropdown({
  placeholder = 'Pilih...',
  options = [],
  onSelectOption,
  value,
}: ITableVirtualDropdown) {
  const dropdownWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownOptRef = useRef<HTMLDivElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOptIndex, setSelectedOptIndex] = useState(-1);

  useOnClickOutside(dropdownWrapperRef, () => setIsDropdownOpen(false));

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDropdownOpen) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedOptIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedOptIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      } else if (event.key === 'Enter' && selectedOptIndex >= 0) {
        event.preventDefault();
        onSelectOption?.(options[selectedOptIndex]);
        setIsDropdownOpen(false);
      } else if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen, selectedOptIndex, options]);

  return (
    <div ref={dropdownWrapperRef} className="relative inline-block text-left">
      <div>
        <button
          id="table-virtual-dropdown"
          type="button"
          className={clsx(
            'inline-flex w-full gap-x-1.5 rounded px-1.5 h-8 ring-1 ring-inset  items-center',
            'ring-gray-300 bg-white hover:bg-gray-50 cursor-pointer',
            'text-xs text-black font-semibold',
            !value && '!text-gray-500 !font-normal'
          )}
          onClick={() => setIsDropdownOpen(true)}
        >
          {value || placeholder || '-'}

          <IcChevron
            className={clsx(
              '!text-gray-900 ml-auto transform transition-all duration-200',
              isDropdownOpen && 'rotate-180'
            )}
          />
        </button>
      </div>

      {isDropdownOpen && (
        <div
          ref={dropdownOptRef}
          className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
        >
          <div className="py-1">
            {!options.length ? (
              <div className="p-4 px-8 text-center text-gray-600 text-xs">Tidak ada opsi yang tersedia</div>
            ) : (
              options.map((opt, idx) => (
                <div
                  key={'table-virtual-dropdown-opt-' + idx}
                  className={clsx(
                    'py-1.5 px-2 hover:bg-blue-950 hover:text-white text-gray-900 cursor-pointer text-xs',
                    value === opt && 'bg-blue-950 text-white',
                    idx === selectedOptIndex && 'bg-blue-950 text-white'
                  )}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onSelectOption?.(opt);
                  }}
                >
                  {opt}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
