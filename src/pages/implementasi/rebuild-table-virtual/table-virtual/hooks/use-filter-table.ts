import { useEffect, useRef, useState } from 'react';
import { getFixedCardPosition } from '../utils';
import useOnClickOutside from './use-click-outside';

interface IFilterTable<TDataSource> {
  data: TDataSource[];
  onChangeFilter?: (data: Record<keyof TDataSource, string[]>) => void;
  useServerFilter?: boolean;
}

export default function useFilterTable<TDataSource>({
  data,
  onChangeFilter,
  useServerFilter = false,
}: IFilterTable<TDataSource>) {
  const filterCardRef = useRef<HTMLDivElement | null>(null);

  const [filteredData, setFilteredData] = useState<TDataSource[]>(data);
  const [activeFilters, setActiveFilters] = useState<Record<keyof TDataSource, string[]>>(
    {} as Record<keyof TDataSource, string[]>
  );

  const [isFilterCardOpen, setIsFilterCardOpen] = useState({ show: false, key: '' });
  const [filterCardPosition, setFilterCardPosition] = useState({
    top: 0,
    left: 0,
  });

  useOnClickOutside(filterCardRef, () => setIsFilterCardOpen({ show: false, key: '' }));

  useEffect(() => {
    if (Object.keys(activeFilters).length === 0) {
      setFilteredData(data);
      return;
    }

    if (useServerFilter) {
      onChangeFilter?.(activeFilters);
      return;
    }

    let cpData = [...data];
    Object.entries(activeFilters).forEach(([columnName, filterValues]) => {
      if ((filterValues as []).length > 0) {
        cpData = cpData?.filter((row) =>
          (filterValues as string[]).some((value) => value == row[columnName as keyof TDataSource])
        );
      }
    });
    setFilteredData(cpData);
    onChangeFilter?.(activeFilters);
  }, [data, activeFilters, onChangeFilter, useServerFilter]);

  const handleOpenFilter = (e: React.MouseEvent<HTMLElement>, activeFilterKey: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { calculatedTop, calculatedLeft } = getFixedCardPosition(rect);

    setFilterCardPosition({ top: calculatedTop, left: calculatedLeft });
    setIsFilterCardOpen({ show: true, key: activeFilterKey });
  };

  const updateFilter = (dataKey: keyof TDataSource, filterValues: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [dataKey]: filterValues,
    }));
    setIsFilterCardOpen({ show: false, key: '' });
  };

  const resetFilter = (dataKey: keyof TDataSource) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[dataKey];
      return newFilters;
    });
    setFilteredData(data);
    setIsFilterCardOpen({ show: false, key: '' });
  };

  const resetAllFilter = () => setActiveFilters({} as Record<keyof TDataSource, string[]>);

  return {
    filteredData,
    filterCardRef,
    filterCardPosition,
    isFilterCardOpen,
    handleOpenFilter,
    updateFilter,
    resetFilter,
    activeFilters,
    resetAllFilter,
  };
}
