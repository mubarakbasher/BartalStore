import { forwardRef, type TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface AdmTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const AdmTextarea = forwardRef<HTMLTextAreaElement, AdmTextareaProps>(function AdmTextarea(
  { className, invalid, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={clsx(
        'w-full px-3 py-2 bg-sand dark:bg-d-raised border rounded-bartal text-body text-ink dark:text-d-text placeholder:text-ink-mute dark:placeholder:text-d-textMute',
        'focus:outline-none focus:bg-white dark:focus:bg-d-bg transition-colors resize-y',
        invalid
          ? 'border-danger focus:border-danger'
          : 'border-line dark:border-d-line focus:border-amber',
        className,
      )}
      {...rest}
    />
  );
});
