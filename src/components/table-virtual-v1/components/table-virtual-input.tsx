import clsx from 'clsx';

interface ITableVirtualInput extends React.InputHTMLAttributes<HTMLInputElement> {
  onClickEnter?: () => void;
}

export default function TableVirtualInput({ onClickEnter, className, value, onChange, ...props }: ITableVirtualInput) {
  return (
    <input
      type="text"
      placeholder="Cari..."
      className={clsx(
        'outline-none border border-gray-200 rounded h-8 px-1.5 w-44 text-xs focus:border-blue-950',
        'transition-all duration-300',
        className
      )}
      value={value}
      onChange={onChange}
      onKeyDown={(e) => e.key === 'Enter' && onClickEnter?.()}
      {...props}
    />
  );
}
