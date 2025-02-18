import { memo, useMemo } from 'react';
import { TableVirtuoso } from 'react-virtuoso';

function Table() {
  const users = useMemo(() => {
    return Array.from({ length: 1000 }, (_, index) => ({
      name: `User ${index}`,
      description: `Description for user ${index}`,
    }));
  }, []);

  return (
    <TableVirtuoso
      style={{ height: 400 }}
      data={users}
      fixedHeaderContent={() => (
        <>
          <th className="bg-gray-200 border-b border-x w-[180px] shrink-0">Name</th>
          <th className="bg-gray-200 border-b border-x w-[180px] shrink-0">Description</th>
          <th className="bg-gray-200 border-b border-x w-[180px] shrink-0">Header 3</th>
          <th className="bg-gray-200 border-b border-x w-[180px] shrink-0">Header 4</th>
          <th className="bg-gray-200 border-b border-x w-[180px] shrink-0">Header 5</th>
          <th className="bg-gray-200 border-b border-x w-[180px] shrink-0">Header 6</th>
          <th className="bg-gray-200 border-b border-x w-[180px] shrink-0">Header 7</th>
          <th className="bg-gray-200 border-b border-x w-[180px] shrink-0">Header 8</th>
          <th className="bg-gray-200 border-b border-x w-[180px] shrink-0">Header 9</th>
          <th className="bg-gray-200 border-b border-x w-[180px] shrink-0">Header 10</th>
        </>
      )}
      itemContent={(_, user) => (
        <>
          <td className="w-[180px] border-b border-x">{user.name}</td>
          <td className="w-[180px] border-b border-x">{user.description}</td>
          <td className="w-[180px] border-b border-x">{user.description}</td>
          <td className="w-[180px] border-b border-x">{user.description}</td>
          <td className="w-[180px] border-b border-x">{user.description}</td>
          <td className="w-[180px] border-b border-x">{user.description}</td>
          <td className="w-[180px] border-b border-x">{user.description}</td>
          <td className="w-[180px] border-b border-x">{user.description}</td>
          <td className="w-[180px] border-b border-x">{user.description}</td>
          <td className="w-[180px] border-b border-x">{user.description}</td>
        </>
      )}
    />
  );
}

export default memo(Table);
