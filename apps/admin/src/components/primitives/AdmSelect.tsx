import { forwardRef, type SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

interface AdmSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const AdmSelect = forwardRef<HTMLSelectElement, AdmSelectProps>(function AdmSelect(
  { className, invalid, children, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={clsx(
        'h-11 px-3 bg-sand dark:bg-d-raised border rounded-bartal text-body text-ink dark:text-d-text',
        'focus:outline-none focus:bg-white dark:focus:bg-d-bg transition-colors',
        invalid
          ? 'border-danger focus:border-danger'
          : 'border-line dark:border-d-line focus:border-amber',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
});
