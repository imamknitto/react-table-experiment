import { useEffect, useRef, useState } from 'react';
import useOnClickOutside from '../../../../../hooks/use-click-outside';
import { getFixedCardPosition } from '../utils';

interface ISearchTable<TData> {
  data?: TData[];
}

export default function useSearchTable<TData>({ data }: ISearchTable<TData>) {
  const searchCardRef = useRef<HTMLDivElement | null>(null);
  const [isSearchCardOpen, setIsSearchCardOpen] = useState({ show: false, key: '' });
  const [searchCardPosition, setSearchCardPosition] = useState({
    top: 0,
    left: 0,
  });

  const [searchedData, setSearchedData] = useState<TData[]>(data || []);
  const [activeSearch, seActiveSearch] = useState<Record<keyof TData, string>>({} as Record<keyof TData, string>);

  useOnClickOutside(searchCardRef, () => setIsSearchCardOpen({ show: false, key: '' }));

  useEffect(() => {
    let cpData = [...(data || [])];
    Object.entries(activeSearch).forEach(([dataKey, searchValue]) => {
      if ((searchValue as string).length > 0) {
        cpData = cpData?.filter((row) =>
          (row[dataKey as keyof TData] as string).toLowerCase().includes((searchValue as string).toLowerCase())
        );
      }
    });
    setSearchedData(cpData);
  }, [data, activeSearch]);

  const handleOpenSearch = (e: React.MouseEvent<HTMLElement>, activeSearchKey: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { calculatedTop, calculatedLeft } = getFixedCardPosition(rect);

    setSearchCardPosition({ top: calculatedTop, left: calculatedLeft });
    setIsSearchCardOpen({ show: true, key: activeSearchKey });
  };

  const updateSearch = (dataKey: keyof TData, searchValue: string) => {
    seActiveSearch((prev) => ({
      ...prev,
      [dataKey]: searchValue,
    }));
    setIsSearchCardOpen({ show: false, key: '' });
  };

  const resetSearch = (dataKey: keyof TData) => {
    seActiveSearch((prev) => {
      const cpActiveSearch = { ...prev };
      delete cpActiveSearch[dataKey];
      return cpActiveSearch;
    });
    setIsSearchCardOpen({ show: false, key: '' });
  };

  const resetAllSearch = () => seActiveSearch({} as Record<keyof TData, string>);

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
