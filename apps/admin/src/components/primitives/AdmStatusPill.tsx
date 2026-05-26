import clsx from 'clsx';
import type { OrderStatus, PaymentStatus } from '@bartal/shared';
import type { AdminLocale } from '@/lib/state/prefs-store';

interface AdmStatusPillProps {
  status: OrderStatus | PaymentStatus | string;
  locale?: AdminLocale;
  className?: string;
}

const ORDER_LABELS: Record<string, { ar: string; en: string }> = {
  PENDING: { ar: 'قيد الانتظار', en: 'Pending' },
  AWAITING_PAYMENT: { ar: 'بانتظار الدفع', en: 'Awaiting payment' },
  RECEIPT_UPLOADED: { ar: 'تم رفع الإيصال', en: 'Receipt uploaded' },
  PAYMENT_CONFIRMED: { ar: 'الدفع مؤكد', en: 'Payment confirmed' },
  PAYMENT_REJECTED: { ar: 'الدفع مرفوض', en: 'Payment rejected' },
  PROCESSING: { ar: 'قيد التحضير', en: 'Processing' },
  SHIPPED: { ar: 'تم الشحن', en: 'Shipped' },
  DELIVERED: { ar: 'تم التسليم', en: 'Delivered' },
  CANCELLED: { ar: 'ملغي', en: 'Cancelled' },
  REFUNDED: { ar: 'مستردّ', en: 'Refunded' },
  // Payment statuses
  UNPAID: { ar: 'غير مدفوع', en: 'Unpaid' },
  PAID: { ar: 'مدفوع', en: 'Paid' },
  REJECTED: { ar: 'مرفوض', en: 'Rejected' },
};

const STYLE: Record<string, string> = {
  PENDING: 'bg-amber-tint text-amber',
  AWAITING_PAYMENT: 'bg-amber-tint text-amber',
  RECEIPT_UPLOADED: 'bg-info/15 text-info',
  PAYMENT_CONFIRMED: 'bg-ok/15 text-ok',
  PAYMENT_REJECTED: 'bg-danger/15 text-danger',
  PROCESSING: 'bg-info/15 text-info',
  SHIPPED: 'bg-info/20 text-info',
  DELIVERED: 'bg-ok/15 text-ok',
  CANCELLED: 'bg-danger/15 text-danger',
  REFUNDED: 'bg-line text-ink-mute',
  UNPAID: 'bg-amber-tint text-amber',
  PAID: 'bg-ok/15 text-ok',
  REJECTED: 'bg-danger/15 text-danger',
};

export function AdmStatusPill({ status, locale = 'en', className }: AdmStatusPillProps) {
  const label = ORDER_LABELS[status]?.[locale] ?? status;
  const style = STYLE[status] ?? 'bg-line text-ink-mute';
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-micro font-semibold',
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}
