import Header from '../../../components/header';
import Table from './table';

export default function ReactVirtuoso() {
  return (
    <div className="p-3 flex flex-col gap-3">
      <Header>
        <h1 className="text-lg">React Virtuoso</h1>
      </Header>

      <div className="w-full h-[calc(100vh-10rem)] border">
        <Table />
      </div>
    </div>
  );
}
