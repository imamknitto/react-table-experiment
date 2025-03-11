import clsx from 'clsx';
import { ReactNode } from 'react';

interface CheckboxProps extends React.ComponentPropsWithoutRef<'input'> {
  checked: boolean;
  onChecked?: (checked: boolean) => void;
  label?: ReactNode | string;
  classNameLabel?: string;
}

export default function Checkbox({ checked, onChecked, label, classNameLabel, ...props }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer">
      <div className={clsx('w-4 h-4 relative', label && 'mr-2')}>
        <input
          type="checkbox"
          className="w-4 h-4 cursor-pointer absolute opacity-0 z-[100]"
          checked={checked}
          onChange={(e) => onChecked && onChecked(e.target.checked)}
          {...props}
        />
        <div
          className={clsx('w-4 h-4 flex justify-center items-center border border-black-40 absolute', {
            'bg-knitto-blue-100': checked,
            'bg-white': !checked,
          })}
        >
          {checked && <CheckedIcon />}
        </div>
      </div>

      {typeof label === 'string' ? <span className={clsx('text-sm -mt-0.5', classNameLabel)}>{label}</span> : label}
    </label>
  );
}

function CheckedIcon() {
  return (
    <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 4L4.57407 7L10.5 1" stroke="white" strokeWidth="2" />
    </svg>
  );
}
