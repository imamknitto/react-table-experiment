export interface ISelection extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  options?: ISelectionOption[];
  isMultiple?: boolean;
  onSelectOption?: (option: ISelectionOption | ISelectionOption[] | string | null, query?: string) => void;
  onSelectSingleOption?: (option: ISelectionOption | null, query?: string) => void;
  onSelectMultipleOption?: (option: ISelectionOption[] | null, query?: string) => void;
  selectedOption?: ISelectionOption | ISelectionOption[] | string | null;
  bypassSearchValue?: string;
  searchQuery?: string;
  isLoading?: boolean;
  isKeepFreeText?: boolean;
  isError?: boolean;
  isResetQuery?: boolean;
  placeHolder?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
  disableSearch?: boolean;
}

export interface ISelectionOption {
  label: string;
  value: string | number;
}

export interface ISelectionDropdown extends React.HTMLAttributes<HTMLDivElement> {
  options?: ISelectionOption[];
  selectedOption?: ISelectionOption | ISelectionOption[] | string | null;
  onHideDropdown?: () => void;
  onSelectOption?: (data: ISelectionOption) => void;
  isLoading?: boolean;
  isMultiple?: boolean;
}

export interface ISelectionDropdownItem {
  onSelect?: () => void;
  label: string;
  selectedOption?: ISelectionOption | ISelectionOption[] | string | null;
  optionIndex: number;
  selectedIndex: number;
  isMultiple?: boolean;
}
