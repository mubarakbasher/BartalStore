import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-amber text-white hover:bg-amber-hover active:bg-amber-active disabled:bg-line disabled:text-ink-mute',
  secondary:
    'bg-navy text-white hover:bg-navy-deep active:bg-navy-ink disabled:bg-line disabled:text-ink-mute',
  ghost:
    'bg-transparent text-navy border border-line hover:bg-sand active:bg-amber-tint disabled:text-ink-mute',
  destructive: 'bg-danger text-white hover:opacity-90 active:opacity-80',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-3 text-small rounded-bartal',
  md: 'h-11 px-5 text-body rounded-bartal',
  lg: 'h-13 px-6 text-body rounded-bartal',
};

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(function AppButton(
  { variant = 'primary', size = 'md', fullWidth, leadingIcon, trailingIcon, children, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40 focus-visible:ring-offset-2',
        variantClass[variant],
        sizeClass[size],
        fullWidth && 'w-full',
        rest.disabled && 'cursor-not-allowed opacity-70',
        className,
      )}
      {...rest}
    >
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </button>
  );
});
