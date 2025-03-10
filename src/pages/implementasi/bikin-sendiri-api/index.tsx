import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import Header from '../../../components/header';
import { getDataStreamApi, IResponse, IStreamApi } from './data';
import { generateTableFilterOptions } from '../../../components/table-virtual-v1/utils';
import { TableVirtualV2 } from '../../../components/table-virtual-v2';
import { ITableVirtual } from '../../../components/table-virtual-v2/types';
import IcDelete from '../../../components/table-virtual-v2/icons/ic-delete';
import IcCopy from '../../../components/table-virtual-v2/icons/ic-copy';

const getHeaders = (dataSource?: IStreamApi[]): ITableVirtual<IStreamApi>['headers'] => {
  return [
    {
      key: '_id',
      caption: '_ID',
      filterOptions: generateTableFilterOptions(dataSource || [], '_id'),
      useSingleFilter: true,
      freezed: true,
    },
    { key: 'tanggal', caption: 'Tanggal', useFilter: false },
    {
      key: 'pathUrl',
      caption: 'Path Url',
      filterOptions: generateTableFilterOptions(dataSource || [], 'pathUrl'),
      freezed: true,
      useAdvanceFilter: true,
      renderSummary: () => (
        <div className="bg-blue-950 size-full text-white flex justify-center items-center">Footer</div>
      ),
    },
    {
      key: 'request',
      caption: 'Request',
      useAdvanceFilter: true,
      useSingleFilter: true,
      filterOptions: generateTableFilterOptions(dataSource || [], 'request'),
      fixedWidth: 400,
    },
    { key: 'response', caption: 'Response', useFilter: false },
    {
      key: 'status',
      caption: 'Status',
      className: '!text-end',
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
    const params = { limit: 200, page: page || 1 };
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
        <TableVirtualV2
          isLoading={loading}
          headers={getHeaders(dataSource)}
          dataSource={dataSource || []}
          columnWidth={200}
          rowHeight={36}
          onScrollTouchBottom={() => fetchDataFromApi(pagination.currentPage + 1)}
          onChangeSort={(sortKey, sortBy) => console.log('On Change Sort: ', { sortKey, sortBy })}
          onChangeFilter={(data) => console.log('On Change Filter: ', data)}
          onChangeAdvanceFilter={(data) => console.log('On Change Advance Filter: ', data)}
          renderRightClickRow={(data, value, callbackFn) => (
            <RightClickContent data={data} value={value} callbackFn={callbackFn} />
          )}
        />
      </div>
    </div>
  );
}

interface IRightClickContentProps {
  data: Record<string, string | number> | null;
  value: string | number;
  callbackFn?: () => void;
}

const RightClickContent = ({ data, value, callbackFn }: IRightClickContentProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClickHapus = () => {
    alert(`Hapus: ${JSON.stringify(data, null, 2)}`);
    callbackFn?.();
  };

  const handleClickCopy = () => {
    navigator.clipboard.writeText(value.toString());
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
      callbackFn?.();
    }, 1000);
  };

  return (
    <div className="max-w-sm overflow-auto p-4 text-sm flex flex-col gap-2">
      <button
        className="cursor-pointer p-1.5 bg-red-600 text-white rounded inline-flex items-center"
        onClick={handleClickHapus}
      >
        <IcDelete className="me-2 !w-[1.1rem]" />
        Hapus
      </button>
      <button
        className="cursor-pointer p-1.5 bg-blue-950 text-white rounded inline-flex items-center"
        onClick={handleClickCopy}
      >
        <IcCopy className="me-2 !size-[1.1rem]" />
        {isCopied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
};
