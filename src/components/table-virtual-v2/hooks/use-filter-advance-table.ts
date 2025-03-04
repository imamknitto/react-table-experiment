import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';

import { getFixedCardPosition } from '../utils';
import useOnClickOutside from './use-click-outside';
import { TAdvanceFilterName } from '../types';

type IActiveAdvanceFilters<T> = Record<keyof T, { filterName: TAdvanceFilterName; value: string }>;

interface IAdvanceFilterTable<TDataSource> {
  gridRef: React.RefObject<Grid | null>;
  data: TDataSource[];
  onChangeAdvanceFilter?: (data: IActiveAdvanceFilters<TDataSource>) => void;
  useServerAdvanceFilter?: boolean;
}

export default function useFilterAdvanceTable<TDataSource>(props: IAdvanceFilterTable<TDataSource>) {
  const { gridRef, data, onChangeAdvanceFilter, useServerAdvanceFilter = false } = props;

  const filterAdvanceCardRef = useRef<HTMLDivElement | null>(null);
  const [isFilterAdvanceCardOpen, setIsFilterAdvanceCardOpen] = useState({ show: false, key: '' });
  const [filterAdvanceCardPosition, setFilterAdvanceCardPosition] = useState({ top: 0, left: 0 });
  const [activeAdvanceFilters, setActiveAdvanceFilters] = useState<IActiveAdvanceFilters<TDataSource>>(
    {} as IActiveAdvanceFilters<TDataSource>
  );

  useOnClickOutside(filterAdvanceCardRef, () => setIsFilterAdvanceCardOpen({ show: false, key: '' }));

  useEffect(() => {
    onChangeAdvanceFilter?.(activeAdvanceFilters);
  }, [activeAdvanceFilters, onChangeAdvanceFilter]);

  const filteredAdvanceData = useMemo(() => {
    if (Object.keys(activeAdvanceFilters).length === 0) return data;
    if (useServerAdvanceFilter) return data;

    return data.filter((item) => {
      return Object.entries(activeAdvanceFilters).every(([key, filter]) => {
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
  }, [data, activeAdvanceFilters, useServerAdvanceFilter]);

  const handleOpenAdvanceFilter = useCallback((e: React.MouseEvent<HTMLElement>, activeFilterKey: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { calculatedTop, calculatedLeft } = getFixedCardPosition(rect);

    setFilterAdvanceCardPosition({ top: calculatedTop, left: calculatedLeft });
    setIsFilterAdvanceCardOpen({ show: true, key: activeFilterKey });
  }, []);

  const applyAdvanceFilter = useCallback(
    (dataKey: keyof TDataSource | string, filterName: TAdvanceFilterName, value: string) => {
      setActiveAdvanceFilters((prev) => ({
        ...prev,
        [dataKey]: { filterName, value },
      }));
      setIsFilterAdvanceCardOpen({ show: false, key: '' });
    },
    []
  );

  const resetAdvanceFilter = useCallback((dataKey: keyof TDataSource | string) => {
    gridRef.current?.scrollTo({ scrollTop: 0 });

    setActiveAdvanceFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[dataKey as keyof TDataSource];
      return newFilters;
    });
    setIsFilterAdvanceCardOpen({ show: false, key: '' });
  }, []);

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
