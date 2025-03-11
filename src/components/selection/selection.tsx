import clsx from 'clsx';
import { memo, useEffect, useMemo, useState } from 'react';
import { ISelection, ISelectionOption } from './types';
import SelectionDropdown from './selection-dropdown';
import Input from '../input/input';
import IcCaret from './ic-caret';

const Selection = (props: ISelection) => {
  const {
    label,
    options,
    isMultiple,
    selectedOption,
    onSelectOption,
    onSelectSingleOption,
    onSelectMultipleOption,
    isLoading,
    isKeepFreeText,
    isError,
    isResetQuery = false,
    placeHolder = '',
    bypassSearchValue,
    inputRef,
    disabled,
    className,
    disableSearch,
    ...properties
  } = props;

  const [isSelectionOpen, setIsSelectionOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (bypassSearchValue) setSearchQuery(bypassSearchValue);
    // else setSearchQuery('');
  }, [bypassSearchValue]);

  useEffect(() => {
    if (isResetQuery) setSearchQuery('');
  }, [isResetQuery]);

  const selectionOptions = useMemo(() => {
    return options?.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, options]);

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);

    onSelectOption?.(null, isKeepFreeText ? query : '');
    onSelectSingleOption?.(null, isKeepFreeText ? query : '');

    if (!isMultiple) onSelectMultipleOption?.(null, isKeepFreeText ? query : '');

    if (!isSelectionOpen) setIsSelectionOpen(true);
  };

  const handleSelectOption = (option: ISelectionOption) => {
    setSearchQuery('');

    /**
     * Jika tidak multiple kirim nilai single option.
     *
     * Jika multiple kirim nilai array option:
     *  - jika selected value belum ada maka kirim array baru dengan 1 single option.
     *  - jika selected value sudah ada maka kirim array dengan push 1 single option baru.
     *  - jika selected value mengandung option yang sama maka kirim array dengan filter 1 single option.
     */
    if (!isMultiple) {
      setIsSelectionOpen(false);
      onSelectSingleOption?.(option);
    } else {
      const arrSelectedOption = selectedOption as ISelectionOption[];

      const finalValues = arrSelectedOption?.some((item) => item.value === option.value)
        ? arrSelectedOption?.filter((item) => item.value !== option.value)
        : [...(arrSelectedOption || []), option];

      onSelectMultipleOption?.(finalValues);
    }
  };

  const getDisplayValue = () => {
    if (searchQuery) return searchQuery;

    if (selectedOption && typeof selectedOption === 'object') {
      return (selectedOption as ISelectionOption)?.label || '';
    }

    return '';
  };

  return (
    <div className={clsx('flex flex-col space-y-1 w-full', className)} {...properties}>
      {label && <p className="text-sm">{label || '-'}</p>}

      {/* {Array.isArray(selectedOption) && (
        <div className="w-full flex overflow-auto gap-2">
          {selectedOption?.map((option, index) => (
            <p key={'selected-option-' + index} className="text-xs shrink-0">
              {option.label}
            </p>
          ))}
        </div>
      )} */}

      <div className="selection relative w-full h-10">
        <div
          className={clsx(
            'relative size-full border border-black-40 rounded-md cursor-pointer',
            'transform transition-all duration-200',
            isSelectionOpen && 'border-gray-700',
            isError && 'border-red-500'
          )}
          onClick={() => !disabled && setIsSelectionOpen(true)}
        >
          <Input
            ref={inputRef}
            placeholder={placeHolder}
            className="cursor-pointer pr-7 border-none !h-full !bg-white"
            onChange={(e) => handleSearchQuery(e.target.value)}
            value={getDisplayValue()}
            disabled={disabled || disableSearch}
            readOnly={disabled || disableSearch}
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 ">
            <IcCaret color="#1D1F26" className="w-[.8125rem]" rotate={isSelectionOpen ? 'top' : 'bottom'} />
          </div>
        </div>

        {isSelectionOpen && !disabled && (
          <SelectionDropdown
            options={selectionOptions}
            selectedOption={selectedOption}
            onHideDropdown={() => setIsSelectionOpen(false)}
            onSelectOption={handleSelectOption}
            isLoading={isLoading}
            isMultiple={isMultiple}
          />
        )}
      </div>
    </div>
  );
};

export default memo(Selection);
