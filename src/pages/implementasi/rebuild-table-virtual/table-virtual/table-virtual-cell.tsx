import { CSSProperties } from 'react';

interface Props {
  rowIndex: number;
  columnIndex: number;
  style: CSSProperties;
}

export default function TableVirtualCell({ rowIndex, columnIndex, style }: Props) {
  return (
    <div style={style} className="border-r border-b border-gray-300 bg-white flex items-center px-1.5">
      <p className="font-mono text-xs">
        X {columnIndex} {rowIndex}
      </p>
    </div>
  );
}
