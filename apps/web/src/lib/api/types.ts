import type {
  DeliveryZone,
  Gender as SharedGender,
  PaginationMeta,
  VerificationStatus as SharedVerificationStatus,
} from '@bartal/shared';

export interface ProductImage {
  id: string;
  url: string;
  alt_ar: string | null;
  alt_en: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductCategoryRef {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string | null;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: string;
  compare_price: string | null;
  stock: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  category_id: string;
  weight_grams: number | null;
  views_count: number;
  created_at: string;
  images: ProductImage[];
  category: ProductCategoryRef;
}

export interface CategoryNode {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  parent_id: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  product_count: number;
  children: CategoryNode[];
}

export interface DeliveryZoneInfo {
  zone: DeliveryZone;
  name_ar: string;
  name_en: string;
  districts_ar: string[];
  districts_en: string[];
  fee_sdg: number;
  free_above_sdg: number | null;
  estimated_days_min: number;
  estimated_days_max: number;
}

export interface ProductsPage {
  data: Product[];
  meta: PaginationMeta;
}

// ─── Auth ─────────────────────────────────────────────────────────────

export type OtpPurpose = 'REGISTER' | 'LOGIN' | 'RESET';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  language: 'ar' | 'en';
  is_verified: boolean;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export type AuthSuccess = { user: AuthUser } & TokenPair;

export interface RegisterDto {
  phone: string;
  name: string;
  password: string;
  email?: string;
}

export interface LoginDto {
  phone: string;
  password: string;
}

export interface VerifyOtpDto {
  phone: string;
  code: string;
  purpose: OtpPurpose;
}

export interface ResendOtpDto {
  phone: string;
  purpose: OtpPurpose;
}

export interface ForgotPasswordDto {
  phone: string;
}

export interface ResetPasswordDto {
  phone: string;
  code: string;
  newPassword: string;
}

export interface RegisterResult {
  userId: string;
  expiresAt: string;
}

// ─── Cart (server view) ───────────────────────────────────────────────

export interface CartItemView {
  product_id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  unit_price: number;
  image_url: string | null;
  quantity: number;
  stock: number;
  line_total: number;
}

export interface CartView {
  items: CartItemView[];
  subtotal: number;
  total_quantity: number;
}

// ─── Orders (server view) ─────────────────────────────────────────────

export type OrderStatusValue =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'RECEIPT_UPLOADED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_REJECTED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethodValue = 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
export type PaymentStatusValue = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface OrderItemView {
  id: string;
  product_id: string;
  product_name_ar: string;
  product_name_en: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderAddressView {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  secondary_phone: string | null;
  district: string;
  street: string | null;
  landmark: string;
  delivery_notes: string | null;
  zone: DeliveryZone;
}

export interface OrderStatusHistoryView {
  status: OrderStatusValue;
  note: string | null;
  created_at: string;
}

export interface OrderView {
  id: string;
  order_number: string;
  status: OrderStatusValue;
  payment_method: PaymentMethodValue;
  payment_status: PaymentStatusValue;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  notes: string | null;
  receipt_url: string | null;
  receipt_uploaded_at: string | null;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItemView[];
  address: OrderAddressView;
  timeline: OrderStatusHistoryView[];
}

export interface CreateOrderDto {
  address_id: string;
  payment_method: PaymentMethodValue;
  notes?: string;
  items: Array<{ product_id: string; quantity: number }>;
}

// ─── Users / profile (server view) ────────────────────────────────────

// Wire shapes now live in @bartal/shared (single source of truth with the
// API). Aliases preserved so existing imports keep working.
export type VerificationStatusValue = SharedVerificationStatus;
export type GenderValue = SharedGender;
export type { UserProfileView } from '@bartal/shared';

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  date_of_birth?: string | null;
  gender?: GenderValue;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// ─── Addresses (server view) ──────────────────────────────────────────

export interface ApiAddress {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  secondary_phone: string | null;
  district: string;
  street: string | null;
  landmark: string;
  delivery_notes: string | null;
  zone: DeliveryZone;
  is_default: boolean;
  created_at: string;
}

export interface CreateAddressDto {
  label: string;
  full_name: string;
  phone: string;
  secondary_phone?: string;
  district: string;
  street?: string;
  landmark: string;
  delivery_notes?: string;
  zone: DeliveryZone;
  is_default?: boolean;
}

// ─── Wishlist (server view) ───────────────────────────────────────────

export interface WishlistItemView {
  id: string;
  product_id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  price: number;
  compare_price: number | null;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  added_at: string;
}
