import clsx from 'clsx';

export default function TableVirtualLoading() {
  return (
    <div className="absolute inset-0 bg-black/20 flex justify-center items-center">
      <div
        className={clsx(
          'border-[.625rem] !border-t-blue-950 border-blue-900/20',
          'border-solid rounded-full animate-spin size-[4.375rem]'
        )}
      />
    </div>
  );
}
