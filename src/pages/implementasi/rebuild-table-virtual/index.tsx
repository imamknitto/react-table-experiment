import Header from '../../../components/header';
import { generateTableFilterOptions } from '../../../components/table-virtual-v1/utils';
import TableVirtual from '../../../components/table-virtual-v2/table-virtual';

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
  { key: 'nama_produk', caption: 'Nama Produk', fixedWidth: 500, freezed: false },
  { key: 'kategori', caption: 'Kategori', freezed: false },
  { key: 'harga', caption: 'Harga (Rp)', fixedWidth: 300, freezed: true },
  { key: 'stok', caption: 'Stok (pcs)' },
  { key: 'terjual', caption: 'Terjual (pcs)' },
  { key: 'rating', caption: 'Rating', freezed: true },
  { key: 'supplier', caption: 'Supplier' },
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
];

const dataSourceV2: IDummyData[] = Array(50000)
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
    kategori: `Kategori ${randomString(20)} ${idx}`,
    harga: Math.random() * 1000000,
    stok: randomNumber(1, 1000),
    terjual: randomNumber(1, 200),
    rating: Array(randomNumber(1, 5))
      .fill(true)
      .map(() => '⭐')
      .join(''),
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
  }));

export default function RebuildTableVirtual() {
  const modifiedHeaders = dummyHeaders?.map(({ key, caption, freezed, fixedWidth }, idx) => ({
    key,
    caption,
    className: `!w-[180px] ${key === 'rating' && '!text-end'}`,
    filterOptions: generateTableFilterOptions(dataSourceV2, key),
    useSingleFilter: idx === 3 ? true : false,
    useAdvanceFilter: idx !== -1,
    freezed,
    fixedWidth,
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
        <h1>Rebuild Table Virtual</h1>

        <div className="ms-5">showed: {dataSourceV2.length}</div>
      </Header>

      <div className="flex-1 w-full">
        <TableVirtual
          useFooter
          //   useAutoWidth
          isLoading={false}
          headers={modifiedHeaders || []}
          dataSource={dataSourceV2 || []}
          stickyFooterHeight={30}
          onChangeAdvanceFilter={(props) => console.log('CHANGE ADVANCE FILTER', props)}
          onChangeFilter={(props) => console.log('CHANGE FILTER', props)}
          onChangeSort={(sortKey, sortBy) => console.log('CHANGE SORT', sortKey, sortBy)}
          onScrollTouchBottom={() => console.log('SCROLL TOUCH BOTTOM')}
          onClickRow={(data, rowIndex) => console.log('CLICK ROW', { data, rowIndex })}
        />
      </div>
    </div>
  );
}
