import { CSSProperties } from 'react';

export default function TableVirtualEmptyData({ style }: { style: CSSProperties }) {
  return (
    <div style={style} className="flex justify-center items-center sticky left-0">
      <p className="text-base text-gray-600">Data tidak tersedia</p>
    </div>
  );
}
