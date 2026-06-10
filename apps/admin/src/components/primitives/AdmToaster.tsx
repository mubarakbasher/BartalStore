import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { currentToasts, subscribeToasts, type Toast, type ToastKind } from './toast-bus';

const KIND_CLASS: Record<ToastKind, string> = {
  success: 'bg-ok/15 text-ok border-ok/30',
  error: 'bg-danger/15 text-danger border-danger/30',
  info: 'bg-info/15 text-info border-info/30',
};

export function AdmToaster() {
  const [list, setList] = useState<Toast[]>(currentToasts());
  useEffect(() => subscribeToasts(setList), []);

  return (
    <div className="fixed bottom-4 end-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {list.map((t) => (
        <div
          key={t.id}
          role="status"
          className={clsx(
            'pointer-events-auto px-4 py-2.5 rounded-bartal border text-small font-semibold shadow-card',
            KIND_CLASS[t.kind],
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
