import { useEffect, useState } from 'react';
import clsx from 'clsx';

export type ToastKind = 'success' | 'error' | 'info';
export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let listeners: Listener[] = [];
let nextId = 1;

function emit() {
  for (const l of listeners) l(toasts);
}

export function pushToast(kind: ToastKind, message: string, durationMs = 3500): void {
  const toast: Toast = { id: nextId++, kind, message };
  toasts = [...toasts, toast];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== toast.id);
    emit();
  }, durationMs);
}

const KIND_CLASS: Record<ToastKind, string> = {
  success: 'bg-ok/15 text-ok border-ok/30',
  error: 'bg-danger/15 text-danger border-danger/30',
  info: 'bg-info/15 text-info border-info/30',
};

export function AdmToaster() {
  const [list, setList] = useState<Toast[]>(toasts);
  useEffect(() => {
    const l = (t: Toast[]) => setList(t);
    listeners.push(l);
    return () => {
      listeners = listeners.filter((x) => x !== l);
    };
  }, []);

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
