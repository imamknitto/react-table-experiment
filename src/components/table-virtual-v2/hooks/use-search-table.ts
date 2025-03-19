import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';

import { getFixedCardPosition } from '../utils';
import useOnClickOutside from './use-click-outside';

interface ISearchTable<TDataSource> {
  gridRef: React.RefObject<Grid | null>;
  data: TDataSource[];
  onChangeSearch?: (data: Record<keyof TDataSource, string>) => void;
  useServerSearch?: boolean;
}

export default function useSearchTable<TDataSource>(props: ISearchTable<TDataSource>) {
  const { data, gridRef, useServerSearch, onChangeSearch } = props;

  const searchCardRef = useRef<HTMLDivElement | null>(null);
  const [isSearchCardOpen, setIsSearchCardOpen] = useState({ show: false, key: '' });
  const [searchCardPosition, setSearchCardPosition] = useState({ top: 0, left: 0 });

  const [activeSearch, seActiveSearch] = useState<Record<keyof TDataSource, string>>(
    {} as Record<keyof TDataSource, string>
  );

  useEffect(() => {
    onChangeSearch?.(activeSearch);
  }, [activeSearch]);

  useOnClickOutside(searchCardRef, () => setIsSearchCardOpen({ show: false, key: '' }));

  const searchedData = useMemo(() => {
    if (!activeSearch || Object.keys(activeSearch).length === 0) return data || [];
    if (useServerSearch) return data;

    return (data || []).filter((row) =>
      Object.entries(activeSearch).every(([dataKey, searchValue]) =>
        (searchValue as string).length === 0
          ? true
          : row[dataKey as keyof TDataSource]
              ?.toString()
              ?.toLowerCase()
              ?.includes((searchValue as string).toLowerCase())
      )
    );
  }, [data, activeSearch]);

  const handleOpenSearch = useCallback(
    (e: React.MouseEvent<HTMLElement>, activeSearchKey: string) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const { calculatedTop, calculatedLeft } = getFixedCardPosition(rect);

      setSearchCardPosition({ top: calculatedTop, left: calculatedLeft });
      setIsSearchCardOpen({ show: true, key: activeSearchKey });
    },
    []
  );

  const updateSearch = useCallback((dataKey: keyof TDataSource | string, searchValue: string) => {
    gridRef.current?.scrollTo({ scrollTop: 0 });

    seActiveSearch((prev) => ({
      ...prev,
      [dataKey]: searchValue,
    }));
    setIsSearchCardOpen({ show: false, key: '' });
  }, []);

  const resetSearch = useCallback((dataKey: keyof TDataSource | string) => {
    seActiveSearch((prev) => {
      const cpActiveSearch = { ...prev };
      delete cpActiveSearch[dataKey as keyof TDataSource];
      return cpActiveSearch;
    });
    setIsSearchCardOpen({ show: false, key: '' });
  }, []);

  const resetAllSearch = useCallback(
    () => seActiveSearch({} as Record<keyof TDataSource, string>),
    []
  );

  return {
    searchedData,
    searchCardRef,
    searchCardPosition,
    isSearchCardOpen,
    handleOpenSearch,
    updateSearch,
    resetSearch,
    activeSearch,
    resetAllSearch,
  };
}
