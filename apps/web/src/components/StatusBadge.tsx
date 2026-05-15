import clsx from 'clsx';
import type { OrderStatus } from '@bartal/shared';
import type { Locale } from '@/lib/i18n/config';

interface StatusBadgeProps {
  status: OrderStatus | 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK' | 'FEATURED';
  locale: Locale;
}

const tone: Record<string, { bg: string; fg: string; ring: string }> = {
  PENDING: { bg: 'bg-amber-tint', fg: 'text-amber', ring: 'ring-amber/30' },
  AWAITING_PAYMENT: { bg: 'bg-amber-tint', fg: 'text-amber', ring: 'ring-amber/30' },
  RECEIPT_UPLOADED: { bg: 'bg-info/10', fg: 'text-info', ring: 'ring-info/30' },
  PAYMENT_CONFIRMED: { bg: 'bg-ok/10', fg: 'text-ok', ring: 'ring-ok/30' },
  PAYMENT_REJECTED: { bg: 'bg-danger/10', fg: 'text-danger', ring: 'ring-danger/30' },
  PROCESSING: { bg: 'bg-info/10', fg: 'text-info', ring: 'ring-info/30' },
  SHIPPED: { bg: 'bg-info/10', fg: 'text-info', ring: 'ring-info/30' },
  DELIVERED: { bg: 'bg-ok/10', fg: 'text-ok', ring: 'ring-ok/30' },
  CANCELLED: { bg: 'bg-line', fg: 'text-ink-mute', ring: 'ring-line' },
  REFUNDED: { bg: 'bg-line', fg: 'text-ink-mute', ring: 'ring-line' },
  IN_STOCK: { bg: 'bg-ok/10', fg: 'text-ok', ring: 'ring-ok/30' },
  OUT_OF_STOCK: { bg: 'bg-danger/10', fg: 'text-danger', ring: 'ring-danger/30' },
  LOW_STOCK: { bg: 'bg-amber-tint', fg: 'text-amber', ring: 'ring-amber/30' },
  FEATURED: { bg: 'bg-amber-tint', fg: 'text-amber', ring: 'ring-amber/30' },
};

const labels: Record<string, { ar: string; en: string }> = {
  PENDING: { ar: 'قيد الانتظار', en: 'Pending' },
  AWAITING_PAYMENT: { ar: 'بانتظار الدفع', en: 'Awaiting payment' },
  RECEIPT_UPLOADED: { ar: 'إيصال قيد المراجعة', en: 'Receipt review' },
  PAYMENT_CONFIRMED: { ar: 'تم تأكيد الدفع', en: 'Payment confirmed' },
  PAYMENT_REJECTED: { ar: 'تم رفض الدفع', en: 'Payment rejected' },
  PROCESSING: { ar: 'قيد التجهيز', en: 'Processing' },
  SHIPPED: { ar: 'تم الشحن', en: 'Shipped' },
  DELIVERED: { ar: 'تم التوصيل', en: 'Delivered' },
  CANCELLED: { ar: 'ملغى', en: 'Cancelled' },
  REFUNDED: { ar: 'تم الاسترداد', en: 'Refunded' },
  IN_STOCK: { ar: 'متوفر', en: 'In stock' },
  OUT_OF_STOCK: { ar: 'نفذت الكمية', en: 'Out of stock' },
  LOW_STOCK: { ar: 'كمية محدودة', en: 'Low stock' },
  FEATURED: { ar: 'مميّز', en: 'Featured' },
};

export function StatusBadge({ status, locale }: StatusBadgeProps) {
  const t = tone[status];
  const label = labels[status]?.[locale] ?? status;
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-micro font-semibold uppercase ring-1',
        t.bg,
        t.fg,
        t.ring,
      )}
    >
      {label}
    </span>
  );
}
