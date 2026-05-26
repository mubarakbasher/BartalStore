import type { ReactNode } from 'react';

interface OrdersShellProps {
  breadcrumb: string;
  children: ReactNode;
}

export function OrdersShell({ breadcrumb, children }: OrdersShellProps) {
  return (
    <>
      <div className="max-w-[1240px] mx-auto px-6 pt-5">
        <div className="text-micro text-ink-mute normal-case tracking-normal">{breadcrumb}</div>
      </div>
      <div className="max-w-[1240px] mx-auto px-6 pt-4 pb-10">{children}</div>
    </>
  );
}
