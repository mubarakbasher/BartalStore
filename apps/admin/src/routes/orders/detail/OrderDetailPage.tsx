import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { OrderStatus } from '@bartal/shared';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmTextarea } from '@/components/primitives/AdmTextarea';
import { AdmStatusPill } from '@/components/primitives/AdmStatusPill';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { AdmDialog } from '@/components/primitives/AdmDialog';
import { PriceTag } from '@/components/primitives/PriceTag';
import { pushToast } from '@/components/primitives/toast-bus';
import { AdmStatusTimeline } from '@/components/orders/AdmStatusTimeline';
import { ReceiptViewerDialog } from '@/components/orders/ReceiptViewerDialog';
import { useAdminOrder } from '@/lib/api/queries';
import {
  useUpdateOrderPayment,
  useUpdateOrderStatus,
} from '@/lib/api/mutations';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { ApiClientError } from '@/lib/api/client';

function statusActions(status: OrderStatus): Array<{ label: 'confirm' | 'reject' | 'process' | 'ship' | 'deliver' | 'cancel' }> {
  switch (status) {
    case 'RECEIPT_UPLOADED' as OrderStatus:
      return [{ label: 'confirm' }, { label: 'reject' }];
    case 'PAYMENT_CONFIRMED' as OrderStatus:
      return [{ label: 'process' }, { label: 'cancel' }];
    case 'PROCESSING' as OrderStatus:
      return [{ label: 'ship' }, { label: 'cancel' }];
    case 'SHIPPED' as OrderStatus:
      return [{ label: 'deliver' }, { label: 'cancel' }];
    case 'PENDING' as OrderStatus:
    case 'AWAITING_PAYMENT' as OrderStatus:
    case 'PAYMENT_REJECTED' as OrderStatus:
      return [{ label: 'cancel' }];
    default:
      return [];
  }
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.nav.orders, id);
  const { data: order, isLoading, error } = useAdminOrder(id);

  const updateStatus = useUpdateOrderStatus(id ?? '');
  const updatePayment = useUpdateOrderPayment(id ?? '');

  const [receiptOpen, setReceiptOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelNote, setCancelNote] = useState('');

  if (isLoading || !order) {
    if (error) {
      return <AdmEmptyState title={dict.common.error} body={String(error)} />;
    }
    return <div className="text-small text-ink-mute dark:text-d-textMute">{dict.common.loading}</div>;
  }

  const actions = statusActions(order.status);
  const t = dict.orderDetail.actions;

  const handle = async (label: 'confirm' | 'reject' | 'process' | 'ship' | 'deliver' | 'cancel') => {
    try {
      if (label === 'confirm') {
        await updatePayment.mutateAsync({ status: 'PAID' });
        pushToast('success', locale === 'ar' ? 'تم تأكيد الدفع' : 'Payment confirmed');
        setReceiptOpen(false);
      } else if (label === 'reject') {
        if (!receiptOpen) {
          setRejectOpen(true);
          return;
        }
        setRejectOpen(true);
      } else if (label === 'process') {
        await updateStatus.mutateAsync({ status: 'PROCESSING' as OrderStatus });
        pushToast('success', locale === 'ar' ? 'تم بدء التحضير' : 'Processing started');
      } else if (label === 'ship') {
        await updateStatus.mutateAsync({ status: 'SHIPPED' as OrderStatus });
        pushToast('success', locale === 'ar' ? 'تم تحديث الحالة إلى مشحون' : 'Marked shipped');
      } else if (label === 'deliver') {
        await updateStatus.mutateAsync({ status: 'DELIVERED' as OrderStatus });
        pushToast('success', locale === 'ar' ? 'تم تحديث الحالة إلى مسلّم' : 'Marked delivered');
      } else if (label === 'cancel') {
        setCancelOpen(true);
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        pushToast('error', locale === 'ar' ? err.message_ar : err.message_en);
      } else {
        pushToast('error', dict.common.error);
      }
    }
  };

  const submitReject = async () => {
    const reason = rejectReason.trim();
    if (reason.length < 3) {
      pushToast('error', locale === 'ar' ? 'السبب قصير جداً.' : 'Reason is too short.');
      return;
    }
    try {
      // Backend treats any non-PAID PaymentStatus + a reason as "reject the
      // receipt" (there is no REJECTED PaymentStatus). Send UNPAID + reason.
      await updatePayment.mutateAsync({ status: 'UNPAID', reason });
      pushToast('success', locale === 'ar' ? 'تم رفض الدفع' : 'Payment rejected');
      setRejectOpen(false);
      setRejectReason('');
      setReceiptOpen(false);
    } catch (err) {
      if (err instanceof ApiClientError) {
        pushToast('error', locale === 'ar' ? err.message_ar : err.message_en);
      } else {
        pushToast('error', dict.common.error);
      }
    }
  };

  const submitCancel = async () => {
    try {
      await updateStatus.mutateAsync({
        status: 'CANCELLED' as OrderStatus,
        note: cancelNote.trim() || undefined,
      });
      pushToast('success', locale === 'ar' ? 'تم إلغاء الطلب' : 'Order cancelled');
      setCancelOpen(false);
      setCancelNote('');
    } catch (err) {
      if (err instanceof ApiClientError) {
        pushToast('error', locale === 'ar' ? err.message_ar : err.message_en);
      } else {
        pushToast('error', dict.common.error);
      }
    }
  };

  const labelFor = (label: typeof actions[number]['label']) => {
    switch (label) {
      case 'confirm':
        return t.confirmPayment;
      case 'reject':
        return t.rejectPayment;
      case 'process':
        return t.startProcessing;
      case 'ship':
        return t.markShipped;
      case 'deliver':
        return t.markDelivered;
      case 'cancel':
        return t.cancelOrder;
    }
  };
  const variantFor = (label: typeof actions[number]['label']) => {
    if (label === 'reject' || label === 'cancel') return 'danger' as const;
    if (label === 'confirm' || label === 'ship' || label === 'deliver') return 'primary' as const;
    return 'secondary' as const;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <div className="text-micro uppercase tracking-wider text-ink-mute dark:text-d-textMute">
            {dict.nav.orders}
          </div>
          <div className="font-mono text-h1 font-bold text-navy dark:text-d-text">
            {order.order_number}
          </div>
        </div>
        <AdmStatusPill status={order.status} locale={locale} />
        <AdmStatusPill status={order.payment_status} locale={locale} />
        <div className="ms-auto">
          <Link to="/orders" className="text-small font-semibold text-ink-mute dark:text-d-textMute hover:text-ink dark:hover:text-d-text">
            ←
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-4 min-w-0">
          <AdmCard>
            <div className="text-h3 font-semibold text-ink dark:text-d-text mb-3">
              {dict.orderDetail.statusTimeline}
            </div>
            <AdmStatusTimeline entries={order.history} locale={locale} />
          </AdmCard>

          <AdmCard padded={false}>
            <div className="px-5 py-3 border-b border-line dark:border-d-line text-h3 font-semibold text-ink dark:text-d-text">
              {dict.orderDetail.items} ({order.items.length})
            </div>
            <ul className="divide-y divide-line dark:divide-d-line">
              {order.items.map((it) => (
                <li key={it.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-bartal bg-sand dark:bg-d-raised shrink-0 overflow-hidden">
                    {it.image_url && (
                      <img src={it.image_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-small font-semibold text-ink dark:text-d-text truncate">
                      {locale === 'ar' ? it.name_ar : it.name_en}
                    </div>
                    <div className="text-micro text-ink-mute dark:text-d-textMute font-mono">
                      ×{it.quantity}
                    </div>
                  </div>
                  <PriceTag amount={it.line_total} locale={locale} />
                </li>
              ))}
            </ul>
            <div className="px-5 py-3 border-t border-line dark:border-d-line space-y-1.5">
              <div className="flex justify-between text-small">
                <span className="text-ink-mute dark:text-d-textMute">Subtotal</span>
                <PriceTag amount={order.subtotal} locale={locale} />
              </div>
              <div className="flex justify-between text-small">
                <span className="text-ink-mute dark:text-d-textMute">Delivery</span>
                <PriceTag amount={order.delivery_fee} locale={locale} />
              </div>
              <div className="flex justify-between text-body font-semibold pt-1.5 border-t border-line dark:border-d-line">
                <span>Total</span>
                <PriceTag amount={order.total} locale={locale} size={16} />
              </div>
            </div>
          </AdmCard>

          <AdmCard>
            <div className="text-h3 font-semibold text-ink dark:text-d-text mb-2">
              {dict.orderDetail.internalNotes}
            </div>
            <div className="text-small text-ink dark:text-d-text whitespace-pre-wrap">
              {order.internal_notes ?? dict.orderDetail.internalNotesEmpty}
            </div>
          </AdmCard>
        </div>

        <div className="space-y-4">
          <AdmCard>
            <div className="text-h3 font-semibold text-ink dark:text-d-text mb-2">
              {dict.orderDetail.customer}
            </div>
            <div className="text-small font-semibold text-ink dark:text-d-text">
              {order.user.name}
            </div>
            <div className="text-small text-ink-mute dark:text-d-textMute font-mono" dir="ltr">
              {order.user.phone}
            </div>
            {order.user.email && (
              <div className="text-small text-ink-mute dark:text-d-textMute">{order.user.email}</div>
            )}
            <a
              href={`https://wa.me/${order.user.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 text-small font-semibold text-ok"
            >
              WhatsApp →
            </a>
          </AdmCard>

          <AdmCard>
            <div className="text-h3 font-semibold text-ink dark:text-d-text mb-2">
              {dict.orderDetail.shippingAddress}
            </div>
            <div className="text-small text-ink dark:text-d-text">{order.address.full_name}</div>
            <div className="text-small text-ink-mute dark:text-d-textMute font-mono" dir="ltr">
              {order.address.phone}
            </div>
            <div className="text-small text-ink dark:text-d-text mt-1">
              {order.address.district} · {order.address.zone.replace('_', ' ')}
            </div>
            <div className="text-small text-ink-mute dark:text-d-textMute mt-0.5">
              {order.address.landmark}
            </div>
          </AdmCard>

          <AdmCard>
            <div className="text-h3 font-semibold text-ink dark:text-d-text mb-2">
              {dict.orderDetail.paymentBlock}
            </div>
            <div className="text-small text-ink dark:text-d-text">
              {dict.orders.paymentMethods[order.payment_method]}
            </div>
            <div className="text-small text-ink-mute dark:text-d-textMute">
              {order.receipt_url ? dict.orderDetail.receiptUploaded : dict.orderDetail.receiptNotUploaded}
            </div>
            {order.receipt_url && (
              <AdmButton
                size="sm"
                variant="ghost"
                className="mt-2"
                onClick={() => setReceiptOpen(true)}
              >
                {dict.orderDetail.viewReceipt}
              </AdmButton>
            )}
          </AdmCard>

          <AdmCard>
            <div className="text-h3 font-semibold text-ink dark:text-d-text mb-2">
              {t.heading}
            </div>
            {actions.length === 0 ? (
              <div className="text-small text-ink-mute dark:text-d-textMute">
                {t.noActions}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {actions.map(({ label }) => (
                  <AdmButton
                    key={label}
                    fullWidth
                    variant={variantFor(label)}
                    disabled={updateStatus.isPending || updatePayment.isPending}
                    onClick={() => handle(label)}
                  >
                    {labelFor(label)}
                  </AdmButton>
                ))}
              </div>
            )}
          </AdmCard>
        </div>
      </div>

      <ReceiptViewerDialog
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        receiptKey={order.receipt_url}
        orderNumber={order.order_number}
        amount={order.total}
        onApprove={() => handle('confirm')}
        onReject={() => handle('reject')}
        approving={updatePayment.isPending}
        rejecting={rejectOpen && updatePayment.isPending}
      />

      <AdmDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title={t.rejectPayment}
        size="sm"
      >
        <div className="p-5 space-y-3">
          <label className="block text-small font-semibold text-ink dark:text-d-text">
            {t.reasonLabel}
          </label>
          <AdmTextarea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <AdmButton variant="ghost" onClick={() => setRejectOpen(false)}>
              {t.cancel}
            </AdmButton>
            <AdmButton
              variant="danger"
              onClick={submitReject}
              disabled={updatePayment.isPending || rejectReason.trim().length < 3}
            >
              {t.confirm}
            </AdmButton>
          </div>
        </div>
      </AdmDialog>

      <AdmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title={t.cancelOrder}
        size="sm"
      >
        <div className="p-5 space-y-3">
          <label className="block text-small font-semibold text-ink dark:text-d-text">
            {t.noteLabel}
          </label>
          <AdmTextarea rows={3} value={cancelNote} onChange={(e) => setCancelNote(e.target.value)} />
          <div className="flex justify-end gap-2 pt-2">
            <AdmButton variant="ghost" onClick={() => setCancelOpen(false)}>
              {t.cancel}
            </AdmButton>
            <AdmButton variant="danger" onClick={submitCancel} disabled={updateStatus.isPending}>
              {t.confirm}
            </AdmButton>
          </div>
        </div>
      </AdmDialog>
    </div>
  );
}
