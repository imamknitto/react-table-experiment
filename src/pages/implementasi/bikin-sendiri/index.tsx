import Header from '../../../components/header';
import TableVirtual from './table-virtual/table-virtual';
import { ITableVirtual } from './table-virtual/types';
import { generateTableFilterOptions } from './table-virtual/utils';

const randomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
};

const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

interface IDummyData {
  nama_produk: string;
  kategori: string;
  harga: number;
  [key: string]: string | number;
}

const dummyHeaders = [
  { key: 'nama_produk', caption: 'Nama Produk', freezed: true },
  { key: 'kategori', caption: 'Kategori' },
  { key: 'harga', caption: 'Harga (Rp)' },
  { key: 'stok', caption: 'Stok (pcs)' },
  { key: 'terjual', caption: 'Terjual (pcs)' },
  { key: 'rating', caption: 'Rating', freezed: true },
  { key: 'supplier', caption: 'Supplier', freezed: true },
  { key: 'lokasi_gudang', caption: 'Lokasi Gudang' },
  { key: 'tanggal_update', caption: 'Tanggal Update' },
  { key: 'status', caption: 'Status' },
  { key: 'berat', caption: 'Berat (kg)' },
  { key: 'dimensi', caption: 'Dimensi (cm)' },
  { key: 'warna', caption: 'Warna' },
  { key: 'bahan', caption: 'Bahan' },
  { key: 'diskon', caption: 'Diskon (%)' },
  { key: 'harga_setelah_diskon', caption: 'Harga Setelah Diskon (Rp)' },
  { key: 'minimal_pemesanan', caption: 'Minimal Pemesanan' },
  { key: 'maksimal_pemesanan', caption: 'Maksimal Pemesanan' },
  { key: 'maksimal_pemesanan2', caption: 'Maksimal Pemesanan 2' },
  { key: 'maksimal_pemesanan3', caption: 'Maksimal Pemesanan 3' },
  { key: 'maksimal_pemesanan4', caption: 'Maksimal Pemesanan 4' },
  { key: 'maksimal_pemesanan5', caption: 'Maksimal Pemesanan 5' },
  { key: 'maksimal_pemesanan6', caption: 'Maksimal Pemesanan 6' },
];

const dataSourceV2: IDummyData[] = Array(50)
  .fill(true)
  .map((_, idx) => ({
    nama_produk:
      idx >= 0 && idx <= 5
        ? 'Laptop Lenovo Thinkpad'
        : idx > 5 && idx <= 10
        ? 'Laptop HP'
        : idx > 10 && idx <= 40
        ? `Laptop Macbook Pro M3`
        : `${randomString(5)} ${randomString(20)} ${randomString(5)}`,
    kategori: `Kategori ${randomString(5)} ${idx}`,
    harga: Math.random() * 1000000,
    stok: randomNumber(1, 1000),
    terjual: randomNumber(1, 200),
    rating:
      Array(randomNumber(1, 5))
        .fill(true)
        .map(() => '⭐')
        .join('') + idx,
    supplier: randomString(4) + ' ' + randomString(7),
    lokasi_gudang: `Lokasi Gudang ${idx}`,
    tanggal_update: new Date().toLocaleDateString(),
    status: `Status ${idx}`,
    berat: randomNumber(1, 20),
    dimensi: `Dimensi ${idx}`,
    warna: `Warna ${idx}`,
    bahan: `Bahan ${idx}`,
    diskon: Math.random() * 10,
    harga_setelah_diskon: Math.random() * 1000000,
    minimal_pemesanan: Math.random() * 10,
    maksimal_pemesanan: Math.random() * 10,
    maksimal_pemesanan2: Math.random() * 10,
    maksimal_pemesanan3: Math.random() * 10,
    maksimal_pemesanan4: Math.random() * 10,
    maksimal_pemesanan5: Math.random() * 10,
    maksimal_pemesanan6: Math.random() * 10,
  }));

export default function BikinSendiri() {
  const modifiedHeaders: ITableVirtual<IDummyData>['headers'] = dummyHeaders?.map(({ key, caption, freezed }, idx) => ({
    key,
    caption,
    className: `!w-[180px] ${key === 'rating' && '!text-end'}`,
    filterOptions: generateTableFilterOptions(dataSourceV2, key),
    useSingleFilter: idx === 3 ? true : false,
    freezed,
    renderSummary: () =>
      key === 'nama_produk' ? (
        <div className="size-full flex justify-center items-center bg-blue-950 text-white">TOTAL: </div>
      ) : (
        <div className="size-full flex justify-center items-center bg-blue-950/20 text-white" />
      ),
  }));

  return (
    <div className="p-4 flex flex-col h-screen w-full space-y-2.5">
      <Header>
        <h1>Implementasi Table Bikin Sendiri</h1>
      </Header>

      <div className="flex space-x-4 py-4">
        <span>
          Kolom: <b>{modifiedHeaders?.length}</b>
        </span>
        <span>
          Baris: <b>{dataSourceV2?.length}</b>
        </span>
      </div>

      <div className="flex-1 w-full">
        <TableVirtual
          isLoading={false}
          dataSource={dataSourceV2 || []}
          headers={modifiedHeaders || []}
          rowHeaderHeight={50}
          rowFooterHeight={40}
          onChangeFilter={(prop) => console.log('CHANGE FILTER', prop)}
          onChangeSort={(sortKey, sortBy) => console.log('CHANGE SORT', { sortKey, sortBy })}
          onClickRow={(data, rowIndex) => {
            console.log('CLICK ROW', data, rowIndex);
          }}
          useFooter
        />
      </div>
    </div>
  );
}
