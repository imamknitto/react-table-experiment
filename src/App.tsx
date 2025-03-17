import { Route, Routes } from 'react-router';
import Home from './pages/home';
import BikinSendiri from './pages/research/bikin-sendiri';
import TableDataGrid from './pages/research/table-data-grid';
import ReactVirtuoso from './pages/research/react-virtuoso';
import ImplementasiBikinSendiriApi from './pages/implementasi/bikin-sendiri-api';
import RebuildTableVirtual from './pages/implementasi/rebuild-table-virtual';
import ImplementasiBikinSendiriApiMultiTab from './pages/implementasi/bikin-sendiri-api-multi-tab';
import Resizable from './pages/research/resizable';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/research/bikin-sendiri" element={<BikinSendiri />} />
      <Route path="/research/table-data-grid" element={<TableDataGrid />} />
      <Route path="/research/react-virtuoso" element={<ReactVirtuoso />} />
      <Route path="/implementasi/rebuild-table-virtual" element={<RebuildTableVirtual />} />
      <Route path="/implementasi/bikin-sendiri-api" element={<ImplementasiBikinSendiriApi />} />
      <Route
        path="/implementasi/bikin-sendiri-api-multi-tab"
        element={<ImplementasiBikinSendiriApiMultiTab />}
      />
      <Route path="/research/resizable-div" element={<Resizable />} />
      <Route path="/implementasi/table-data-grid" element={<></>} />
      <Route path="/implementasi/react-virtuoso" element={<></>} />
    </Routes>
  );
}

export default App;
