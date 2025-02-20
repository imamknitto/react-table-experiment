import clsx from 'clsx';
import { CSSProperties } from 'react';

export default function TableVirtualLoading({ style }: { style: CSSProperties }) {
  return (
    <div className="sticky left-0 top-0 bg-black/20 z-[3]">
      <div style={style} className="flex justify-center items-center sticky left-0">
        <div
          className={clsx(
            'border-[.625rem] !border-t-blue-950 border-blue-900/20',
            'border-solid rounded-full animate-spin size-[4.375rem]'
          )}
        />
      </div>
    </div>
  );
}
