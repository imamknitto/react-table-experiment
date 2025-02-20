import { useEffect, useState } from 'react';

export type TSortOrder = 'asc' | 'desc' | 'unset';

interface ISortTable<TDataSource> {
  data: TDataSource[];
  onChangeSort?: (sortKey: string, sortBy: TSortOrder) => void;
  useServerSort?: boolean;
}

export default function useSortTable<TDataSource>({
  data,
  onChangeSort,
  useServerSort = false,
}: ISortTable<TDataSource>) {
  const [sortedData, setSortedData] = useState<TDataSource[]>(data);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<TSortOrder>('unset');

  useEffect(() => {
    if (!sortKey) {
      setSortedData(data);
      return;
    }

    if (useServerSort) {
      onChangeSort?.(sortKey, sortBy);
      return;
    }

    const sorted = [...data].sort((a, b) => {
      if (a[sortKey as keyof TDataSource] < b[sortKey as keyof TDataSource]) return sortBy === 'asc' ? -1 : 1;
      if (a[sortKey as keyof TDataSource] > b[sortKey as keyof TDataSource]) return sortBy === 'asc' ? 1 : -1;
      return 0;
    });

    setSortedData(sortBy === 'unset' ? data : sorted);
    onChangeSort?.(sortKey, sortBy);
  }, [sortKey, sortBy, data, onChangeSort, useServerSort]);

  const handleSort = (key: string) => {
    let newOrder: TSortOrder = 'asc';
    if (sortKey === key && sortBy === 'asc') {
      newOrder = 'desc';
    } else if (sortKey === key && sortBy === 'desc') {
      newOrder = 'unset';
    }

    setSortKey(newOrder ? key : null);
    setSortBy(newOrder);
  };

  return { sortedData, handleSort, sortKey, sortBy };
}
