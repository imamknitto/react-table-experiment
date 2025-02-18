import Header from '../../../components/header';
import ExampleTable from './example-table';

export default function TableDataGrid() {
  return (
    <div className="p-3 flex flex-col gap-3">
      <Header>
        <h1 className="text-lg">
          Table dengan library{' '}
          <a
            href="https://www.npmjs.com/package/react-data-grid"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline underline-offset-4"
          >
            react-data-grid
          </a>
        </h1>
      </Header>
      <ExampleTable />
    </div>
  );
}
