import { AdmDialog } from './AdmDialog';
import { AdmButton } from './AdmButton';

interface AdmConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdmConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: AdmConfirmDialogProps) {
  return (
    <AdmDialog open={open} onClose={onCancel} title={title} size="sm">
      <div className="p-5">
        <p className="text-body text-ink dark:text-d-text">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <AdmButton variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </AdmButton>
          <AdmButton variant={variant} size="sm" onClick={onConfirm} disabled={loading}>
            {loading ? '…' : confirmLabel}
          </AdmButton>
        </div>
      </div>
    </AdmDialog>
  );
}
