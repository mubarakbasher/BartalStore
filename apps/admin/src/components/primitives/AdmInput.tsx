import { forwardRef, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface AdmInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const AdmInput = forwardRef<HTMLInputElement, AdmInputProps>(function AdmInput(
  { className, invalid, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={clsx(
        'w-full h-11 px-3 bg-sand dark:bg-d-raised border rounded-bartal text-body text-ink dark:text-d-text placeholder:text-ink-mute dark:placeholder:text-d-textMute',
        'focus:outline-none focus:bg-white dark:focus:bg-d-bg transition-colors',
        invalid
          ? 'border-danger focus:border-danger'
          : 'border-line dark:border-d-line focus:border-amber',
        className,
      )}
      {...rest}
    />
  );
});
