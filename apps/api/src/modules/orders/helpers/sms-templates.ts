import type { Language } from '@bartal/shared';

export type OrderSmsEvent =
  | 'ORDER_CREATED_BANK'
  | 'ORDER_CREATED_COD'
  | 'RECEIPT_RECEIVED'
  | 'ORDER_CANCELLED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_REJECTED'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'ORDER_REFUNDED'
  | 'CART_ABANDONED';

export interface OrderSmsContext {
  orderNumber: string;
  /** Total in SDG as a plain number — caller formats once. */
  total: number;
  /** Free-text reason; used by PAYMENT_REJECTED. */
  reason?: string;
  /** Customer's first name; used by CART_ABANDONED where no order exists yet. */
  customerName?: string;
}

const TEMPLATES: Record<OrderSmsEvent, Record<Language, (ctx: OrderSmsContext) => string>> = {
  ORDER_CREATED_BANK: {
    AR: ({ orderNumber, total }) =>
      `تم استلام طلبك ${orderNumber} بمبلغ ${total} ج.س. يرجى تحويل المبلغ ورفع إيصال الدفع. شكراً لاختيارك برتال.`,
    EN: ({ orderNumber, total }) =>
      `Bartal: order ${orderNumber} received for SDG ${total}. Please transfer and upload your receipt to proceed.`,
  },
  ORDER_CREATED_COD: {
    AR: ({ orderNumber, total }) =>
      `تم تأكيد طلبك ${orderNumber} بقيمة ${total} ج.س — الدفع عند الاستلام. سنتواصل قريباً للتجهيز.`,
    EN: ({ orderNumber, total }) =>
      `Bartal: order ${orderNumber} confirmed for SDG ${total} (cash on delivery). We'll contact you soon to arrange delivery.`,
  },
  RECEIPT_RECEIVED: {
    AR: ({ orderNumber }) =>
      `استلمنا إيصال الدفع لطلب ${orderNumber} وسنراجعه خلال ٢٤ ساعة. شكراً لك.`,
    EN: ({ orderNumber }) =>
      `Bartal: we received the receipt for order ${orderNumber}. We'll verify it within 24 hours.`,
  },
  ORDER_CANCELLED: {
    AR: ({ orderNumber }) =>
      `تم إلغاء طلبك ${orderNumber}. إذا كان الإلغاء عن طريق الخطأ، يمكنك إنشاء طلب جديد.`,
    EN: ({ orderNumber }) =>
      `Bartal: order ${orderNumber} has been cancelled. You're welcome to place a new order any time.`,
  },
  PAYMENT_CONFIRMED: {
    AR: ({ orderNumber }) =>
      `تم تأكيد دفعتك لطلب ${orderNumber}. سنبدأ تجهيز طلبك قريباً.`,
    EN: ({ orderNumber }) =>
      `Bartal: payment for order ${orderNumber} confirmed. We'll prepare your order shortly.`,
  },
  PAYMENT_REJECTED: {
    AR: ({ orderNumber, reason }) =>
      `تعذر قبول إيصال طلب ${orderNumber}. السبب: ${reason ?? 'غير محدد'}. يمكنك رفع إيصال جديد.`,
    EN: ({ orderNumber, reason }) =>
      `Bartal: receipt for order ${orderNumber} could not be accepted. Reason: ${reason ?? 'unspecified'}. Please re-upload.`,
  },
  ORDER_SHIPPED: {
    AR: ({ orderNumber }) =>
      `تم شحن طلبك ${orderNumber}. تواصل معنا عبر واتساب لأي استفسار.`,
    EN: ({ orderNumber }) =>
      `Bartal: order ${orderNumber} has shipped. Contact us on WhatsApp for any questions.`,
  },
  ORDER_DELIVERED: {
    AR: ({ orderNumber }) =>
      `تم تسليم طلبك ${orderNumber}. شكراً لاختيارك برتال.`,
    EN: ({ orderNumber }) =>
      `Bartal: order ${orderNumber} delivered. Thanks for choosing Bartal.`,
  },
  ORDER_REFUNDED: {
    AR: ({ orderNumber, total }) =>
      `تم استرداد المبلغ ${total} ج.س لطلبك ${orderNumber}. للاستفسار تواصل معنا عبر واتساب.`,
    EN: ({ orderNumber, total }) =>
      `Bartal: refund of SDG ${total} processed for order ${orderNumber}. Contact us on WhatsApp for any questions.`,
  },
  CART_ABANDONED: {
    AR: ({ customerName }) =>
      `مرحباً ${customerName ?? 'عميلنا'}، تركت بعض المنتجات في سلتك على برتال. أكمل الطلب الآن واستمتع بتجربتك.`,
    EN: ({ customerName }) =>
      `Bartal: hi ${customerName ?? 'there'}, you left items in your cart. Complete your order anytime — we'll save it for you.`,
  },
};

export function pickOrderSms(
  event: OrderSmsEvent,
  language: Language,
  ctx: OrderSmsContext,
): string {
  const lang: Language = language === 'EN' ? 'EN' : 'AR';
  return TEMPLATES[event][lang](ctx);
}
