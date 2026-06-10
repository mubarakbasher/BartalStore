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

export function subscribeToasts(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((x) => x !== listener);
  };
}

export function currentToasts(): Toast[] {
  return toasts;
}
