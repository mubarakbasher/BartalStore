import { useState } from 'react';
import { AdmDialog } from '@/components/primitives/AdmDialog';
import { AdmInput } from '@/components/primitives/AdmInput';
import { AdmTextarea } from '@/components/primitives/AdmTextarea';
import { AdmButton } from '@/components/primitives/AdmButton';
import { useCreateRefund } from '@/lib/api/mutations';
import { pushToast } from '@/components/primitives/toast-bus';
import type { AdminLocale } from '@/lib/state/prefs-store';

interface Props {
  open: boolean;
  onClose: () => void;
  locale: AdminLocale;
}

interface ApiError {
  response?: { data?: { error?: { code?: string; message_en?: string; message_ar?: string } } };
  message?: string;
}

export function RefundCreateDialog({ open, onClose, locale }: Props) {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const create = useCreateRefund();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !amount.trim() || reason.trim().length < 3) return;
    create.mutate(
      { order_id: orderId.trim(), amount: Number(amount), reason: reason.trim() },
      {
        onSuccess: (res) => {
          pushToast(
            'success',
            locale === 'ar'
              ? `تم إنشاء طلب الاسترداد ${res.refund_number}`
              : `Refund ${res.refund_number} created`,
          );
          setOrderId('');
          setAmount('');
          setReason('');
          onClose();
        },
        onError: (err: unknown) => {
          const e = err as ApiError;
          const apiErr = e.response?.data?.error;
          const msg = apiErr
            ? locale === 'ar' ? apiErr.message_ar : apiErr.message_en
            : e.message ?? 'Error';
          pushToast('error', msg ?? 'Error');
        },
      },
    );
  };

  return (
    <AdmDialog
      open={open}
      onClose={onClose}
      size="md"
      title={locale === 'ar' ? 'إنشاء طلب استرداد' : 'Create refund request'}
    >
      <form onSubmit={submit} className="p-5 space-y-4">
        <div className="text-small text-ink-mute dark:text-d-textMute">
          {locale === 'ar'
            ? 'أنشئ سجل استرداد للعميل الذي تواصل معنا عبر واتساب أو الهاتف. سيظهر هنا قيد الانتظار حتى تتم الموافقة.'
            : 'Create a refund record on behalf of a customer who reported via WhatsApp / phone. It enters as PENDING until approved.'}
        </div>

        <div>
          <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
            {locale === 'ar' ? 'معرّف الطلب' : 'Order ID'}
          </label>
          <AdmInput
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="cuid…"
            required
          />
          <div className="text-micro text-ink-mute dark:text-d-textMute mt-1">
            {locale === 'ar'
              ? 'تجده في صفحة تفاصيل الطلب أو من قائمة الطلبات.'
              : 'You can find this in the order detail page URL.'}
          </div>
        </div>

        <div>
          <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
            {locale === 'ar' ? 'المبلغ (ج.س)' : 'Amount (SDG)'}
          </label>
          <AdmInput
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="50000"
            required
          />
        </div>

        <div>
          <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
            {locale === 'ar' ? 'السبب' : 'Reason'}
          </label>
          <AdmTextarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={
              locale === 'ar'
                ? 'مثال: تم استلام المنتج تالفاً'
                : 'e.g. Item arrived damaged'
            }
            rows={3}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-line dark:border-d-line">
          <AdmButton type="button" variant="ghost" onClick={onClose}>
            {locale === 'ar' ? 'إلغاء' : 'Cancel'}
          </AdmButton>
          <AdmButton
            type="submit"
            variant="primary"
            disabled={create.isPending}
          >
            {create.isPending
              ? locale === 'ar' ? 'جارٍ الإنشاء…' : 'Creating…'
              : locale === 'ar' ? 'إنشاء الاسترداد' : 'Create refund'}
          </AdmButton>
        </div>
      </form>
    </AdmDialog>
  );
}
