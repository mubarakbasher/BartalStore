import type {
  Address,
  AddressLabel,
  Order,
  OrderItem,
  OrderStatusEvent,
  DemoOrderStatus,
  UserProfile,
  VerificationState,
  WishlistItem,
} from '@bartal/shared';
import type {
  ApiAddress,
  GenderValue,
  OrderStatusValue,
  OrderView,
  UserProfileView,
  VerificationStatusValue,
  WishlistItemView,
} from './types';

// ─── Addresses ────────────────────────────────────────────────────────

const KNOWN_LABELS: AddressLabel[] = ['home', 'work', 'parents', 'other'];

/** 'ZONE_A' → 'A' (demo UI uses the short zone code). */
export function shortZone(zone: string): Address['zone'] {
  const tail = zone.replace('ZONE_', '');
  return (['A', 'B', 'C', 'D'].includes(tail) ? tail : 'A') as Address['zone'];
}

/** 'A' → 'ZONE_A' (API enum). */
export function fullZone(short: string): 'ZONE_A' | 'ZONE_B' | 'ZONE_C' | 'ZONE_D' {
  const z = short.startsWith('ZONE_') ? short : `ZONE_${short}`;
  return (['ZONE_A', 'ZONE_B', 'ZONE_C', 'ZONE_D'].includes(z) ? z : 'ZONE_A') as
    | 'ZONE_A'
    | 'ZONE_B'
    | 'ZONE_C'
    | 'ZONE_D';
}

/**
 * API addresses are single-language (the customer typed them once). The demo
 * UI shape splits ar/en — we fill both sides with the same stored text so
 * existing display components keep rendering without per-locale forks.
 */
export function mapAddress(api: ApiAddress): Address {
  const label = (KNOWN_LABELS.includes(api.label as AddressLabel)
    ? api.label
    : 'other') as AddressLabel;
  return {
    id: api.id,
    label,
    labelText: label === 'other' ? api.label : undefined,
    name: api.full_name,
    phone: api.phone,
    secondaryPhone: api.secondary_phone ?? undefined,
    line_ar: api.street ? `${api.district}، ${api.street}` : api.district,
    line_en: api.street ? `${api.district}, ${api.street}` : api.district,
    city_ar: api.district,
    city_en: api.district,
    zone: shortZone(api.zone),
    landmark_ar: api.landmark,
    landmark_en: api.landmark,
    deliveryNotes: api.delivery_notes ?? undefined,
    isDefault: api.is_default,
  };
}

// ─── Profile ──────────────────────────────────────────────────────────

function verState(b: boolean): VerificationState {
  return b ? 'verified' : 'unverified';
}

function nationalIdState(s: VerificationStatusValue): VerificationState {
  return s === 'VERIFIED' ? 'verified' : s === 'PENDING' ? 'pending' : 'unverified';
}

function genderToDemo(g: GenderValue | null): UserProfile['gender'] {
  if (g === 'MALE') return 'male';
  if (g === 'FEMALE') return 'female';
  if (g === 'OTHER') return 'other';
  return undefined;
}

export function mapProfile(api: UserProfileView): UserProfile {
  const [firstName, ...rest] = (api.name ?? '').trim().split(/\s+/);
  return {
    id: api.id,
    firstName: firstName ?? '',
    lastName: rest.join(' '),
    phone: api.phone,
    email: api.email ?? '',
    dob: api.date_of_birth ? api.date_of_birth.slice(0, 10) : undefined,
    gender: genderToDemo(api.gender),
    memberSince: api.created_at.slice(0, 10),
    ordersCount: api.orders_count,
    lifetimeSpend: api.lifetime_spend,
    loyaltyPoints: api.loyalty_points,
    verifications: {
      phone: verState(api.is_verified),
      email: api.email ? verState(api.email_verified) : 'unverified',
      nationalId: nationalIdState(api.national_id_status),
    },
  };
}

// ─── Orders ───────────────────────────────────────────────────────────

const STATUS_TO_DEMO: Record<OrderStatusValue, DemoOrderStatus> = {
  PENDING: 'placed',
  AWAITING_PAYMENT: 'placed',
  RECEIPT_UPLOADED: 'review',
  PAYMENT_CONFIRMED: 'verified',
  PAYMENT_REJECTED: 'review',
  PROCESSING: 'preparing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'cancelled',
};

function mapOrderItem(it: OrderView['items'][number]): OrderItem {
  return {
    productId: it.product_id,
    slug: '',
    name_ar: it.product_name_ar,
    name_en: it.product_name_en,
    brand: '',
    hue: 'amber',
    imageUrl: it.product_image,
    sku: '',
    unitPrice: it.unit_price,
    quantity: it.quantity,
  };
}

/**
 * Build the UI timeline from the order's discrete timestamps. The API also
 * returns a `timeline` history array; we derive from the canonical timestamps
 * so the ordering and "completed" state are deterministic.
 */
function buildTimeline(api: OrderView): OrderStatusEvent[] {
  const events: OrderStatusEvent[] = [{ status: 'placed', at: api.created_at }];
  if (api.receipt_uploaded_at) events.push({ status: 'review', at: api.receipt_uploaded_at });
  if (api.paid_at) events.push({ status: 'verified', at: api.paid_at });
  if (api.status === 'PROCESSING' || api.shipped_at || api.delivered_at) {
    events.push({ status: 'preparing' });
  }
  if (api.shipped_at) events.push({ status: 'shipped', at: api.shipped_at });
  if (api.delivered_at) events.push({ status: 'delivered', at: api.delivered_at });
  if (api.cancelled_at) events.push({ status: 'cancelled', at: api.cancelled_at });
  return events;
}

export function mapOrder(api: OrderView): Order {
  return {
    id: api.id,
    number: api.order_number,
    placedAt: api.created_at,
    status: STATUS_TO_DEMO[api.status],
    items: api.items.map(mapOrderItem),
    subtotal: api.subtotal,
    deliveryFee: api.delivery_fee,
    total: api.total,
    shippingAddress: mapAddress({
      ...api.address,
      is_default: false,
      created_at: api.created_at,
    }),
    payment: {
      method: api.payment_method === 'BANK_TRANSFER' ? 'bank_transfer' : 'cod',
      receipt: api.receipt_url
        ? {
            bank_ar: '',
            bank_en: '',
            amount: api.total,
            reference: api.order_number,
            uploadedAt: api.receipt_uploaded_at ?? api.created_at,
            status:
              api.payment_status === 'PAID'
                ? 'approved'
                : api.status === 'PAYMENT_REJECTED'
                  ? 'rejected'
                  : 'pending',
          }
        : undefined,
    },
    timeline: buildTimeline(api),
  };
}

// ─── Wishlist ─────────────────────────────────────────────────────────

export function mapWishlist(api: WishlistItemView): WishlistItem {
  return {
    productId: api.product_id,
    slug: api.slug,
    name_ar: api.name_ar,
    name_en: api.name_en,
    brand: '',
    hue: 'amber',
    imageUrl: api.image_url,
    price: api.price,
    addedAt: api.added_at,
    priceDropped: api.compare_price != null && api.price < api.compare_price,
  };
}
