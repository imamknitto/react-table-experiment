import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import Header from '../../../components/header';
import TableVirtual from '../bikin-sendiri/table-virtual/table-virtual';
import { ITableVirtual } from '../bikin-sendiri/table-virtual/types';
import { getDataStreamApi, IResponse, IStreamApi } from './data';
import { generateTableFilterOptions } from '../bikin-sendiri/table-virtual/utils';

const getHeaders = (dataSource?: IStreamApi[]): ITableVirtual<IStreamApi>['headers'] => {
  return [
    {
      key: '_id',
      caption: '_ID',
      filterOptions: generateTableFilterOptions(dataSource || [], '_id'),
      useSingleFilter: true,
    },
    { key: 'tanggal', caption: 'Tanggal', useFilter: false },
    {
      key: 'pathUrl',
      caption: 'Path Url',
      filterOptions: generateTableFilterOptions(dataSource || [], 'pathUrl'),
    },
    { key: 'request', caption: 'Request', useFilter: false },
    { key: 'response', caption: 'Response', useFilter: false },
    {
      key: 'status',
      caption: 'Status',
      filterOptions: generateTableFilterOptions(dataSource || [], 'status'),
      useSingleFilter: true,
    },
    {
      key: 'level',
      caption: 'Level',
      filterOptions: generateTableFilterOptions(dataSource || [], 'level'),
      useSingleFilter: true,
    },
    {
      key: 'tipe',
      caption: 'Tipe',
      filterOptions: generateTableFilterOptions(dataSource || [], 'tipe'),
    },
    {
      key: 'ingest_date',
      filterOptions: [''],
      caption: 'Ingest Date',
      render: (value) => dayjs(value).format('DD MMM YYYY'),
      useFilter: false,
    },
    { key: 'response_time', filterOptions: [''], caption: 'Response Time', useFilter: false },
    { key: 'request_id', filterOptions: [''], caption: 'Request ID', useFilter: false },
  ];
};

export default function ImplementasiBikinSendiriApi() {
  const [dataSource, setDataSource] = useState<IStreamApi[]>([]);
  const firstEntry = useRef<boolean>(true);

  const [pagination, setPagination] = useState<IResponse<IStreamApi[]>['result']['pagination']>({
    currentPage: 1,
    totalPage: 1,
    totalData: 0,
    perPage: 10,
    search: [],
  });
  const [loading, setLoading] = useState(false);

  async function fetchDataFromApi(page?: number) {
    setLoading(true);
    const params = { limit: 50000, page: page || 1 };
    const res = await getDataStreamApi<IResponse<IStreamApi[]>>(params);

    if (res) {
      setDataSource((prev) => [...prev, ...res.result.data]);
      setPagination(res.result.pagination);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (firstEntry.current) {
      firstEntry.current = false;
      fetchDataFromApi();
    }
  }, []);

  return (
    <div className="p-4 flex flex-col h-screen w-full space-y-2.5">
      <Header>
        <h1>Implementasi Table Bikin Sendiri [API]</h1>
      </Header>

      <div className="py-2 bg-yellow-400/20 w-max px-2 text-gray-900">
        <pre>{JSON.stringify({ ...pagination, showed: dataSource.length })}</pre>
      </div>

      <div className="flex-1 w-full">
        <TableVirtual
          isLoading={loading}
          headers={getHeaders(dataSource)}
          dataSource={dataSource || []}
          columnWidth={200}
          rowHeaderHeight={36}
          rowHeight={36}
          onScrollTouchBottom={() => fetchDataFromApi(pagination.currentPage + 1)}
        />
      </div>
    </div>
  );
}
