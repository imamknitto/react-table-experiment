import clsx from 'clsx';
import React from 'react';

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, IInputProps>(({ className, type, disabled, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={clsx(
        'h-10 rounded-[4px] text-base py-[.625rem] px-[.5rem] placeholder-black-40',
        'flex w-full text-black-100 border border-black-40 global-paragraph',
        'outline-none focus:border-navy-100 focus:text-black-60 focus:border-2',
        'read-only:bg-greyish-semi-dark-50',
        className,
        {
          'pointer-events-none bg-greyish-semi-dark-50': disabled,
        }
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
