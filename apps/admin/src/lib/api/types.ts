import type {
  BannerStatus,
  DeliveryZone,
  InventoryMovementType,
  OrderStatus,
  PaymentStatus,
  PromoType,
  RefundStatus,
  ReviewModerationStatus,
} from '@bartal/shared';

// ─── Dashboard ─────────────────────────────────────────────

export interface DashboardKpiDelta {
  revenue_today: number;
  orders_today: number;
  pending_payments: number;
  low_stock: number;
}

export interface DashboardOrdersByStatus {
  status: OrderStatus;
  count: number;
}

export interface DashboardTopProduct {
  product_id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url: string | null;
  units_sold: number;
  revenue: number;
}

export interface DashboardDailyRevenue {
  date: string; // YYYY-MM-DD
  revenue: number;
}

export interface DashboardRecentOrder {
  id: string;
  order_number: string;
  total: number;
  status: OrderStatus;
  payment_method: 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  created_at: string;
  customer_name: string;
}

export interface AdminDashboardResponse {
  revenue_today: number;
  orders_today: number;
  pending_payments: number;
  low_stock_count: number;
  orders_by_status: DashboardOrdersByStatus[];
  top_products: DashboardTopProduct[];
  daily_revenue: DashboardDailyRevenue[];
  recent_orders: DashboardRecentOrder[];
}

// ─── Orders ────────────────────────────────────────────────

export interface AdminOrderListItem {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  total: number;
  item_count: number;
  created_at: string;
  user: { id: string; name: string; phone: string };
  address: { zone: DeliveryZone; district: string; full_name: string };
}

export interface AdminOrderListResponse {
  items: AdminOrderListItem[];
  page: number;
  limit: number;
  total: number;
}

export interface AdminOrderItem {
  id: string;
  product_id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface AdminOrderHistoryEntry {
  id: string;
  status: OrderStatus;
  note: string | null;
  changed_at: string;
  changed_by_id: string | null;
}

export interface AdminOrderDetail {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  subtotal: number;
  delivery_fee: number;
  total: number;
  receipt_url: string | null;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  notes: string | null;
  internal_notes: string | null;
  created_at: string;
  items: AdminOrderItem[];
  user: { id: string; name: string; phone: string; email: string | null };
  address: {
    full_name: string;
    phone: string;
    district: string;
    landmark: string;
    zone: DeliveryZone;
  };
  history: AdminOrderHistoryEntry[];
}

// ─── Customers ─────────────────────────────────────────────

export interface AdminCustomerListItem {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  is_verified: boolean;
  created_at: string;
  order_count: number;
  last_order_at: string | null;
}

export interface AdminCustomerListResponse {
  items: AdminCustomerListItem[];
  page: number;
  limit: number;
  total: number;
}

export interface AdminCustomerOrderRow {
  id: string;
  order_number: string;
  total: number;
  status: OrderStatus;
  created_at: string;
}

export interface AdminCustomerAddress {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  district: string;
  landmark: string;
  zone: DeliveryZone;
  is_default: boolean;
}

export interface AdminCustomerDetail {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  is_verified: boolean;
  language: 'ar' | 'en';
  created_at: string;
  order_count: number;
  total_spent: number;
  addresses: AdminCustomerAddress[];
  recent_orders: AdminCustomerOrderRow[];
}

// ─── Delivery zones ────────────────────────────────────────

export interface AdminZoneRow {
  zone: DeliveryZone;
  name_ar: string;
  name_en: string;
  fee_sdg: number;
  free_above_sdg: number | null;
  estimated_days_min: number;
  estimated_days_max: number;
}

// ─── Settings ──────────────────────────────────────────────

export type AdminSettings = Record<string, string>;

// ─── Catalog (admin scope) ─────────────────────────────────

export interface AdminCategoryRef {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
}

export interface AdminProductListItem {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  sku: string | null;
  price: number;
  compare_price: number | null;
  stock: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  category: AdminCategoryRef;
  primary_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminProductCounts {
  all: number;
  active: number;
  inactive: number;
  out_of_stock: number;
  featured: number;
}

export interface AdminProductListResponse {
  items: AdminProductListItem[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  counts: AdminProductCounts;
}

export interface AdminProductImage {
  id: string;
  url: string;
  alt_ar: string | null;
  alt_en: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface AdminProductDetail {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  slug: string;
  sku: string | null;
  price: number;
  compare_price: number | null;
  stock: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  category_id: string;
  weight_grams: number | null;
  views_count: number;
  category: AdminCategoryRef;
  images: AdminProductImage[];
  created_at: string;
  updated_at: string;
}

export interface AdminCategoryNode {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  parent_id: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  product_count: number;
  created_at: string;
}

// ─── Reviews moderation ────────────────────────────────────

export type { ReviewModerationStatus };
export type AdminReviewFilter = 'pending' | 'flagged' | 'approved' | 'rejected' | 'all';

export interface AdminReviewItem {
  id: string;
  product: { id: string; name_en: string; name_ar: string; sku: string | null; slug: string };
  user: { id: string; name: string; phone: string };
  rating: number;
  comment: string | null;
  is_verified_purchase: boolean;
  moderation_status: ReviewModerationStatus;
  flagged_reason: string | null;
  rejection_reason: string | null;
  moderated_at: string | null;
  moderated_by: string | null;
  created_at: string;
}

export interface AdminReviewListResponse {
  items: AdminReviewItem[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface AdminReviewKpis {
  pending: number;
  flagged: number;
  approvedThisMonth: number;
  avgRating30d: number | null;
  verifiedBuyerPct: number | null;
  avgResponseHours: number | null;
}

// ─── Staff + audit ─────────────────────────────────────────

export interface AdminStaffMember {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: 'ADMIN' | 'CUSTOMER';
  last_login_at: string | null;
  created_at: string;
}

export interface AdminStaffListResponse {
  items: AdminStaffMember[];
}

export interface AdminAuditEntry {
  id: string;
  actor: { id: string; name: string };
  entity_type: string;
  entity_id: string;
  action: string;
  created_at: string;
}

export interface AdminAuditListResponse {
  items: AdminAuditEntry[];
}

// ─── Slice 3b-1: Analytics breakdown ───────────────────────

export type SalesBreakdown = 'none' | 'zone';

export interface SalesAnalyticsDay {
  date: string;
  revenue: number;
  order_count: number;
}

export interface SalesAnalyticsDayByZone extends SalesAnalyticsDay {
  zone: DeliveryZone;
}

export interface SalesAnalyticsResponse {
  from: string;
  to: string;
  breakdown: SalesBreakdown;
  days: Array<SalesAnalyticsDay | SalesAnalyticsDayByZone>;
}

export interface AdminAnalyticsTopProduct {
  id: string;
  name_ar: string | null;
  name_en: string | null;
  image_url: string | null;
  units_sold: number;
  revenue: number;
}

export interface AdminAnalyticsTopProductsResponse {
  products: AdminAnalyticsTopProduct[];
}

// ─── Slice 3b-1: Inventory movements ───────────────────────

export type { InventoryMovementType };

export interface InventoryMovementRow {
  id: string;
  product_id: string;
  product_name_ar: string;
  product_name_en: string;
  sku: string | null;
  type: InventoryMovementType;
  quantity: number;
  stock_after: number;
  reference: string | null;
  actor_id: string | null;
  actor_name: string | null;
  created_at: string;
}

export interface InventoryMovementsResponse {
  items: InventoryMovementRow[];
  total: number;
  page: number;
  limit: number;
  kpis: {
    today_count: number;
    net_change_today: number;
    low_stock_count: number;
    pending_pos: number;
  };
}

// ─── Slice 3b-1: Abandoned carts ───────────────────────────

export type AbandonedCartStage = 'cart' | 'address' | 'payment';
export type AbandonedRecoveryScore = 'hot' | 'warm' | 'cold';

export interface AbandonedCartRow {
  user_id: string;
  user_name: string;
  user_phone: string;
  items_count: number;
  cart_value: number;
  stage: AbandonedCartStage;
  recovery_score: AbandonedRecoveryScore;
  updated_at: string;
  age_hours: number;
  last_event: string;
}

export interface AbandonedCartsResponse {
  items: AbandonedCartRow[];
  total: number;
  page: number;
  limit: number;
  summary: {
    active_carts: number;
    recoverable_value_sdg: number;
    items_in_carts: number;
  };
}

// ─── Slice 3b-2: Refunds ───────────────────────────────────

export type RefundStatusValue = RefundStatus;
export type RefundFilter = 'pending' | 'approved' | 'rejected' | 'all';

export interface AdminRefundRow {
  id: string;
  refund_number: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  amount: number;
  reason: string;
  status: RefundStatusValue;
  rejection_reason: string | null;
  requested_by: string;
  decided_by: string | null;
  decided_at: string | null;
  created_at: string;
}

export interface AdminRefundListResponse {
  items: AdminRefundRow[];
  total: number;
  page: number;
  limit: number;
  counts: {
    pending: number;
    approved: number;
    rejected: number;
    all: number;
  };
}

// ─── Slice 3b-2: Shipping labels ───────────────────────────

export type ShippingLabelFilter = 'ready' | 'printed' | 'all';

export interface ShippingLabelRow {
  id: string;
  order_number: string;
  tracking_number: string | null;
  status: OrderStatus;
  payment_method: 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  is_cod: boolean;
  total: number;
  items_count: number;
  customer_name: string;
  customer_phone: string;
  address: {
    full_name: string;
    phone: string;
    district: string;
    street: string | null;
    landmark: string;
    zone: DeliveryZone;
  };
  label_printed_at: string | null;
  created_at: string;
}

export interface ShippingLabelsResponse {
  items: ShippingLabelRow[];
  total: number;
}

// ─── Slice 3b-2: Templates viewer ──────────────────────────

export type TemplateEvent =
  | 'ORDER_CREATED_BANK'
  | 'ORDER_CREATED_COD'
  | 'RECEIPT_RECEIVED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_REJECTED'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'ORDER_REFUNDED'
  | 'CART_ABANDONED';

export interface AdminTemplateRow {
  event: TemplateEvent;
  name_en: string;
  name_ar: string;
  category: string;
  ar: string;
  en: string;
  variables: string[];
}

export interface AdminTemplatesResponse {
  templates: AdminTemplateRow[];
}

// ─── Slice 3b-3: Promos ────────────────────────────────────

export type { PromoType };
export type PromoStatus = 'active' | 'scheduled' | 'expired' | 'inactive';
export type PromoFilter = PromoStatus | 'all';

export interface AdminPromoRow {
  id: string;
  code: string;
  description_ar: string;
  description_en: string;
  type: PromoType;
  value: number;
  min_cart_amount: number | null;
  max_uses: number | null;
  current_uses: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  status: PromoStatus;
  created_at: string;
}

export interface AdminPromoListResponse {
  items: AdminPromoRow[];
  total: number;
  page: number;
  limit: number;
  counts: {
    active: number;
    scheduled: number;
    expired: number;
    inactive: number;
    all: number;
  };
}

// ─── Slice 3b-3: Banners ──────────────────────────────────

export type BannerStatusValue = BannerStatus;
export type BannerFilter = 'live' | 'draft' | 'all';

export interface AdminBannerRow {
  id: string;
  title_ar: string;
  title_en: string;
  image_url: string;
  cta_url: string | null;
  position: number;
  status: BannerStatusValue;
  click_count: number;
  created_at: string;
}

export interface AdminBannersResponse {
  items: AdminBannerRow[];
  total: number;
}
