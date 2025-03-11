import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ISelectionDropdownItem, ISelectionDropdown, ISelectionOption } from './types';
import clsx from 'clsx';
import { useOnClickOutside, useSensorKeyboard } from './hooks';
import IcClose from './ic-close';
import Checkbox from '../checkbox';

const SelectionDropdown = (props: ISelectionDropdown) => {
  const { onHideDropdown, options, selectedOption, onSelectOption, isLoading, isMultiple, className, ...properties } =
    props;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1);

  useOnClickOutside(dropdownRef, (currentTarget, _) => {
    if (currentTarget?.closest('.selection')?.contains(dropdownRef.current)) return;
    onHideDropdown?.();
  });

  useSensorKeyboard(['ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Escape'], (key, e) => {
    if (key === 'ArrowDown' || key === 'ArrowUp') e?.preventDefault();

    switch (key) {
      case 'ArrowUp':
        setSelectedOptionIndex((prev) => (prev > 0 ? prev - 1 : options?.length ?? 0 - 1));
        break;
      case 'ArrowDown':
        setSelectedOptionIndex((prev) => (prev < (options?.length ?? 0 - 1) ? prev + 1 : 0));
        break;
      case 'Enter':
        onSelectOption?.(options?.[selectedOptionIndex] as ISelectionOption);
        break;
      case 'Tab':
        onHideDropdown?.();
        break;
      case 'Escape':
        onHideDropdown?.();
        break;
    }
  });

  useEffect(() => {
    if (selectedOptionIndex !== null) {
      scrollToActiveItem(selectedOptionIndex);
    }
  }, [selectedOptionIndex]);

  const scrollToActiveItem = useCallback((optionIndex: number) => {
    if (!dropdownRef.current) return;
    const activeItem = dropdownRef.current?.querySelectorAll(`.dropdown-item`);
    if (!activeItem) return;
    activeItem?.[optionIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        'absolute z-[999999999] top-full mt-1',
        'w-full max-h-56 overflow-auto',
        'bg-white rounded-md shadow-lg',
        className
      )}
      {...properties}
    >
      {isLoading ? (
        <div className="text-center text-black-40 p-10 text-sm">Sedang memuat...</div>
      ) : !options?.length ? (
        <div className="text-center text-black-40 p-10 text-sm">Data tidak tersedia</div>
      ) : (
        options?.map((option, index) => (
          <SelectionDropdownItem
            key={'selection-dropdown-item-' + index}
            label={option.label}
            onSelect={() => onSelectOption?.(option)}
            selectedOption={selectedOption}
            optionIndex={index}
            selectedIndex={selectedOptionIndex}
            isMultiple={isMultiple}
          />
        ))
      )}
    </div>
  );
};

const SelectionDropdownItem = (props: ISelectionDropdownItem) => {
  const { onSelect, label, selectedOption, optionIndex, selectedIndex, isMultiple } = props;

  const isSelected = useMemo(() => {
    if (!selectedOption) return false;
    if (Array.isArray(selectedOption)) {
      return (selectedOption as ISelectionOption[]).some((item) => item.label === label);
    } else if (typeof selectedOption === 'object') {
      return selectedOption.label === label;
    } else {
      return false;
    }
  }, [selectedOption, label]);

  return (
    <div
      className={clsx(
        'dropdown-item flex items-center gap-2 px-3 py-2 cursor-pointer',
        'hover:!bg-blue-950/50 hover:!text-white',
        isSelected && '!bg-blue-950 !text-white',
        optionIndex === selectedIndex && '!bg-blue-950/50 !text-white'
      )}
      onClick={() => onSelect?.()}
    >
      {isMultiple && <Checkbox readOnly checked={isSelected} />}
      <p className="text-sm">{label}</p>
    </div>
  );
};

export default SelectionDropdown;
