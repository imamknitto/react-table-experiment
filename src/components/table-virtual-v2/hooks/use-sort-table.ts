import { useCallback, useMemo, useState } from 'react';

export type TSortOrder = 'asc' | 'desc' | 'unset';

interface ISortTable<TDataSource> {
  data: TDataSource[];
  onChangeSort?: (sortKey: string, sortBy: TSortOrder) => void;
  useServerSort?: boolean;
}

export default function useSortTable<TDataSource>({
  data,
  useServerSort,
  onChangeSort,
}: ISortTable<TDataSource>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<TSortOrder>('unset');

  const sortedData = useMemo(() => {
    if (!sortKey || sortBy === 'unset') return data;
    if (useServerSort) return data;

    const sorted = [...data].sort((a, b) => {
      if (a[sortKey as keyof TDataSource] < b[sortKey as keyof TDataSource])
        return sortBy === 'asc' ? -1 : 1;
      if (a[sortKey as keyof TDataSource] > b[sortKey as keyof TDataSource])
        return sortBy === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortKey, sortBy, useServerSort]);

  const handleSort = useCallback(
    (key: string) => {
      setSortKey((prevKey) => {
        const newSortBy =
          prevKey === key
            ? sortBy === 'asc'
              ? 'desc'
              : sortBy === 'desc'
              ? 'unset'
              : 'asc'
            : 'asc';

        setSortBy(newSortBy);
        onChangeSort?.(key, newSortBy);

        return newSortBy === 'unset' ? null : key;
      });
    },
    [sortBy, onChangeSort]
  );

  const handleSpecificSort = useCallback(
    (key: string, sortBy: TSortOrder) => {
      setSortKey(sortBy === 'unset' ? null : key);
      setSortBy(sortBy);
      onChangeSort?.(key, sortBy);
    },
    [onChangeSort]
  );

  return { sortedData, handleSort, handleSpecificSort, sortKey, sortBy };
}
