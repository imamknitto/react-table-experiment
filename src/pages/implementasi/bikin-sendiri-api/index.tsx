import { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import Header from '../../../components/header';
import { getDataStreamApi, IResponse, IStreamApi } from './data';
import { generateTableFilterOptions } from '../../../components/table-virtual-v1/utils';
import { TableVirtualV2 } from '../../../components/table-virtual-v2';
import { ITableVirtual } from '../../../components/table-virtual-v2/types';
import IcDelete from '../../../components/table-virtual-v2/icons/ic-delete';
import IcCopy from '../../../components/table-virtual-v2/icons/ic-copy';
import { ISelectionOption, Selection } from '../../../components/selection';

const headerOptions: ISelectionOption[] = [
  { label: '_ID', value: '_id' },
  { label: 'Tanggal', value: 'tanggal' },
  { label: 'Path Url', value: 'pathUrl' },
  { label: 'Request', value: 'request' },
  { label: 'Response', value: 'response' },
  { label: 'Status', value: 'status' },
  { label: 'Level', value: 'level' },
  { label: 'Tipe', value: 'tipe' },
  { label: 'Ingest Date', value: 'ingest_date' },
  { label: 'Response Time', value: 'response_time' },
  { label: 'Request ID', value: 'request_id' },
];

export default function ImplementasiBikinSendiriApi() {
  const firstEntry = useRef<boolean>(true);

  const [dataSource, setDataSource] = useState<IStreamApi[]>([]);
  const [selectedHeader, setSelectedHeader] = useState<ISelectionOption[] | null>(headerOptions);

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
    const params = { limit: 5000, page: page || 1 };
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

  const headerData = useMemo((): ITableVirtual<IStreamApi>['headers'] => {
    if (!selectedHeader) return [];

    const arrSelectedHeader = new Set(selectedHeader.map((item) => item.value));

    const getFilterOptions = (key: string) => generateTableFilterOptions(dataSource || [], key as keyof IStreamApi);

    return [
      {
        key: '_id',
        caption: '_ID',
        filterOptions: getFilterOptions('_id'),
        useSingleFilter: true,
        freezed: false,
        isHide: !arrSelectedHeader.has('_id'),
      },
      {
        key: 'tanggal',
        caption: 'Tanggal',
        useFilter: false,
        freezed: true,
        isHide: !arrSelectedHeader.has('tanggal'),
      },
      {
        key: 'pathUrl',
        caption: 'Path Url',
        filterOptions: getFilterOptions('pathUrl'),
        freezed: true,
        useAdvanceFilter: true,
        renderSummary: () => (
          <div className="bg-blue-950 size-full text-white flex justify-center items-center">Footer</div>
        ),
        isHide: !arrSelectedHeader.has('pathUrl'),
      },
      {
        key: 'request',
        caption: 'Request',
        useAdvanceFilter: true,
        useSingleFilter: true,
        filterOptions: getFilterOptions('request'),
        fixedWidth: 400,
        isHide: !arrSelectedHeader.has('request'),
      },
      {
        key: 'response',
        caption: 'Response',
        useFilter: false,
        isHide: !arrSelectedHeader.has('response'),
      },
      {
        key: 'status',
        caption: 'Status',
        className: '!text-end',
        filterOptions: getFilterOptions('status'),
        useSingleFilter: true,
        isHide: !arrSelectedHeader.has('status'),
      },
      {
        key: 'level',
        caption: 'Level',
        filterOptions: getFilterOptions('level'),
        useSingleFilter: true,
        isHide: !arrSelectedHeader.has('level'),
      },
      {
        key: 'tipe',
        caption: 'Tipe',
        filterOptions: getFilterOptions('tipe'),
        isHide: !arrSelectedHeader.has('tipe'),
      },
      {
        key: 'ingest_date',
        filterOptions: [''],
        caption: 'Ingest Date',
        render: (value) => dayjs(value).format('DD MMM YYYY'),
        useFilter: false,
        isHide: !arrSelectedHeader.has('ingest_date'),
      },
      {
        key: 'response_time',
        filterOptions: [''],
        caption: 'Response Time',
        useFilter: false,
        isHide: !arrSelectedHeader.has('response_time'),
      },
      {
        key: 'request_id',
        filterOptions: [''],
        caption: 'Request ID',
        useFilter: false,
        isHide: !arrSelectedHeader.has('request_id'),
      },
    ];
  }, [dataSource, selectedHeader]);
  return (
    <div className="p-4 flex flex-col h-screen w-full space-y-2.5">
      <Header>
        <h1>Implementasi Table Bikin Sendiri [API]</h1>
      </Header>

      <div className="flex justify-between">
        <div className="py-2 bg-yellow-400/20 w-max px-2 text-gray-900">
          <pre>{JSON.stringify({ ...pagination, showed: dataSource.length })}</pre>
        </div>

        <Selection
          className="!w-44"
          placeHolder="Header Visibility"
          disableSearch
          options={headerOptions}
          selectedOption={selectedHeader}
          onSelectMultipleOption={setSelectedHeader}
          isMultiple
        />
      </div>

      <div className="flex-1 w-full">
        <TableVirtualV2
          isLoading={loading}
          headers={headerData}
          dataSource={dataSource || []}
          columnWidth={200}
          rowHeight={36}
          onScrollTouchBottom={() => fetchDataFromApi(pagination.currentPage + 1)}
          renderRightClickRow={(data, value, callbackFn) => (
            <RightClickContent data={data} value={value} callbackFn={callbackFn} />
          )}
          //   onChangeSort={(sortKey, sortBy) => console.log('On Change Sort: ', { sortKey, sortBy })}
          //   onChangeFilter={(data) => console.log('On Change Filter: ', data)}
          //   onChangeAdvanceFilter={(data) => console.log('On Change Advance Filter: ', data)}
          //   classNameCell={(_data, rowIndex, _columnIndex, _isFreezed) => {
          //     return rowIndex === 1 ? '!bg-red-200' : '';
          //   }}
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
    }, 200);
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
