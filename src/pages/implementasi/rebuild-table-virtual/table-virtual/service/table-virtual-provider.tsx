import { ITableVirtualContext } from '../types';
import { TableVirtualContext } from './table-virtual-context';

const TableVirtualProvider = ({ children, value }: { children: React.ReactNode; value: ITableVirtualContext }) => {
  return <TableVirtualContext.Provider value={value}>{children}</TableVirtualContext.Provider>;
};

export default TableVirtualProvider;
