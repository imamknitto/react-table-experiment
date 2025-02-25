import { useEffect, useRef, useState } from 'react';
import { getFixedCardPosition } from '../utils';
import useOnClickOutside from './use-click-outside';
import { TAdvanceFilterName } from '../types';

type IActiveAdvanceFilters<T> = Record<keyof T, { filterName: TAdvanceFilterName; value: string }>;

interface IAdvanceFilterTable<TDataSource> {
  data: TDataSource[];
  onChangeAdvanceFilter?: (data: IActiveAdvanceFilters<TDataSource>) => void;
  useServerAdvanceFilter?: boolean;
}

export default function useFilterAdvanceTable<TDataSource>({
  data,
  onChangeAdvanceFilter,
  useServerAdvanceFilter = false,
}: IAdvanceFilterTable<TDataSource>) {
  //   console.log({ data, onChangeAdvanceFilter, useServerAdvanceFilter });

  const filterAdvanceCardRef = useRef<HTMLDivElement | null>(null);
  const [filteredAdvanceData, setFilteredAdvanceData] = useState<TDataSource[]>(data);

  const [isFilterAdvanceCardOpen, setIsFilterAdvanceCardOpen] = useState({ show: false, key: '' });
  const [filterAdvanceCardPosition, setFilterAdvanceCardPosition] = useState({
    top: 0,
    left: 0,
  });
  const [activeAdvanceFilters, setActiveAdvanceFilters] = useState<IActiveAdvanceFilters<TDataSource>>(
    {} as IActiveAdvanceFilters<TDataSource>
  );

  useOnClickOutside(filterAdvanceCardRef, () => setIsFilterAdvanceCardOpen({ show: false, key: '' }));

  useEffect(() => {
    // Jika tidak ada filter yang di aktifkan, tampilkan data original.
    if (Object.keys(activeAdvanceFilters).length === 0) {
      setFilteredAdvanceData(data);
      return;
    }

    // Jika gunakan server filter, panggil callback function dengan parameter yang sesuai.
    if (useServerAdvanceFilter) {
      onChangeAdvanceFilter?.(activeAdvanceFilters);
      return;
    }

    // Jika tidak gunakan server filter:
    // 1. Filter data dengan dataKey dan filter yang aktif dan sesuai.
    // 2. Panggil callback function dengan parameter yang sesuai.
    const filterData = (data: TDataSource[], filters: IActiveAdvanceFilters<TDataSource>) => {
      return data.filter((item) => {
        return Object.entries(filters).every(([key, filter]) => {
          const itemValue = String(item[key as keyof TDataSource]).toLowerCase();
          const filterValue = (filter as { value: string })?.value?.toLowerCase();

          switch ((filter as { filterName: TAdvanceFilterName })?.filterName) {
            case 'equal':
              return itemValue === filterValue;
            case 'notEqual':
              return itemValue !== filterValue;
            case 'startsWith':
              return itemValue.startsWith(filterValue);
            case 'endsWith':
              return itemValue.endsWith(filterValue);
            case 'contains':
              return itemValue.includes(filterValue);
            case 'notContains':
              return !itemValue.includes(filterValue);
            default:
              return true;
          }
        });
      });
    };

    const cpData = filterData(data, activeAdvanceFilters);
    setFilteredAdvanceData(cpData);
    onChangeAdvanceFilter?.(activeAdvanceFilters);
  }, [data, activeAdvanceFilters]);

  const handleOpenAdvanceFilter = (e: React.MouseEvent<HTMLElement>, activeFilterKey: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { calculatedTop, calculatedLeft } = getFixedCardPosition(rect);

    setFilterAdvanceCardPosition({ top: calculatedTop, left: calculatedLeft });
    setIsFilterAdvanceCardOpen({ show: true, key: activeFilterKey });
  };

  const applyAdvanceFilter = (dataKey: keyof TDataSource, filterName: TAdvanceFilterName, value: string) => {
    setActiveAdvanceFilters((prev) => ({
      ...prev,
      [dataKey]: { filterName, value },
    }));
    setIsFilterAdvanceCardOpen({ show: false, key: '' });
  };

  const resetAdvanceFilter = (dataKey: keyof TDataSource) => {
    setActiveAdvanceFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[dataKey];
      return newFilters;
    });
    setFilteredAdvanceData(data);
    setIsFilterAdvanceCardOpen({ show: false, key: '' });
  };

  return {
    filteredAdvanceData,
    filterAdvanceCardPosition,
    filterAdvanceCardRef,
    isFilterAdvanceCardOpen,
    setIsFilterAdvanceCardOpen,
    handleOpenAdvanceFilter,
    applyAdvanceFilter,
    resetAdvanceFilter,
    activeAdvanceFilters,
  };
}
