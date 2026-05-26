import type { DeliveryZone, PaginationMeta } from '@bartal/shared';

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
