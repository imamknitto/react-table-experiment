import Header from '../../../components/header';
import TesTable from './table-v2/tes-table';

export default function BikinSendiri() {
  return (
    <div className="p-3 flex flex-col gap-3">
      <Header>
        <h1 className="text-lg">Table bikin sendiri</h1>
      </Header>

      <div className="flex flex-col space-y-2 mt-5 items-start">
        <span>Versi 2</span>
        <div className="w-full h-[600px]">
          <TesTable />
        </div>
      </div>
    </div>
  );
}
