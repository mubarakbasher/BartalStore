import { useQuery } from '@tanstack/react-query';
import { apiGet, apiPost } from './client';
import type {
  AbandonedCartsResponse,
  AbandonedCartStage,
  AdminAnalyticsTopProductsResponse,
  AdminAuditListResponse,
  AdminBannersResponse,
  AdminCategoryNode,
  AdminCustomerDetail,
  AdminCustomerListResponse,
  AdminDashboardResponse,
  AdminOrderDetail,
  AdminOrderListResponse,
  AdminProductDetail,
  AdminProductListResponse,
  AdminPromoListResponse,
  AdminRefundListResponse,
  AdminReviewFilter,
  AdminReviewKpis,
  AdminReviewListResponse,
  AdminSettings,
  AdminStaffListResponse,
  AdminTemplatesResponse,
  AdminZoneRow,
  BannerFilter,
  InventoryMovementsResponse,
  InventoryMovementType,
  PromoFilter,
  RefundFilter,
  SalesAnalyticsResponse,
  SalesBreakdown,
  ShippingLabelFilter,
  ShippingLabelsResponse,
} from './types';

export interface OrdersListParams {
  status?: string;
  zone?: string;
  q?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export function useDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => apiGet<AdminDashboardResponse>('admin/dashboard'),
    staleTime: 30_000,
  });
}

export function useAdminOrders(params: OrdersListParams) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () => apiGet<AdminOrderListResponse>('admin/orders', { ...params }),
    placeholderData: (prev) => prev,
    staleTime: 15_000,
  });
}

export function useAdminOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: () => apiGet<AdminOrderDetail>(`admin/orders/${id}`),
    enabled: Boolean(id),
    staleTime: 5_000,
  });
}

export function useAdminCustomers(params: { q?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'customers', params],
    queryFn: () => apiGet<AdminCustomerListResponse>('admin/customers', { ...params }),
    placeholderData: (prev) => prev,
  });
}

export function useAdminCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'customers', id],
    queryFn: () => apiGet<AdminCustomerDetail>(`admin/customers/${id}`),
    enabled: Boolean(id),
  });
}

export function useDeliveryZones() {
  return useQuery({
    queryKey: ['delivery', 'zones'],
    queryFn: () =>
      apiGet<AdminZoneRow[]>('delivery/zones').then((rows) =>
        rows.map((r) => ({
          ...r,
          fee_sdg: Number(r.fee_sdg),
          free_above_sdg: r.free_above_sdg !== null ? Number(r.free_above_sdg) : null,
        })),
      ),
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => apiGet<AdminSettings>('admin/settings'),
  });
}

export interface SignedReceiptUrlBody {
  receipt_url: string;
}

export interface SignedReceiptUrlResult {
  url: string;
  expires_in: number;
}

export interface AdminProductsParams {
  status?: 'all' | 'active' | 'inactive' | 'out_of_stock' | 'featured';
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export function useAdminProducts(params: AdminProductsParams) {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => apiGet<AdminProductListResponse>('admin/products', { ...params }),
    placeholderData: (prev) => prev,
    staleTime: 15_000,
  });
}

export function useAdminProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'products', id],
    queryFn: () => apiGet<AdminProductDetail>(`admin/products/${id}`),
    enabled: Boolean(id),
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => apiGet<AdminCategoryNode[]>('admin/categories'),
    staleTime: 60_000,
  });
}

export function useReceiptSignedUrl(receiptKey: string | null | undefined) {
  return useQuery({
    queryKey: ['storage', 'receipt-signed-url', receiptKey],
    queryFn: () =>
      apiPost<SignedReceiptUrlResult, SignedReceiptUrlBody>('storage/receipts/signed-url', {
        receipt_url: receiptKey!,
      }),
    enabled: Boolean(receiptKey),
    staleTime: 30 * 60 * 1000,
  });
}

export interface AdminReviewsParams {
  status?: AdminReviewFilter;
  search?: string;
  page?: number;
  limit?: number;
}

export function useAdminReviews(params: AdminReviewsParams) {
  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: () => apiGet<AdminReviewListResponse>('admin/reviews', { ...params }),
    placeholderData: (prev) => prev,
    staleTime: 15_000,
  });
}

export function useAdminReviewKpis() {
  return useQuery({
    queryKey: ['admin', 'review-kpis'],
    queryFn: () => apiGet<AdminReviewKpis>('admin/reviews/kpis'),
    staleTime: 30_000,
  });
}

export function useAdminStaff() {
  return useQuery({
    queryKey: ['admin', 'staff'],
    queryFn: () => apiGet<AdminStaffListResponse>('admin/staff'),
    staleTime: 60_000,
  });
}

export function useAdminAuditFeed(params?: { entity_type?: string; actor_id?: string; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'audit-log', params],
    queryFn: () => apiGet<AdminAuditListResponse>('admin/audit-log', { ...(params ?? {}) }),
    staleTime: 30_000,
  });
}

// ─── Slice 3b-1 ──────────────────────────────────────────────────────

export interface AnalyticsSalesParams {
  from?: string;
  to?: string;
  breakdown?: SalesBreakdown;
}

export function useAdminAnalyticsSales(params: AnalyticsSalesParams) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'sales', params],
    queryFn: () =>
      apiGet<SalesAnalyticsResponse>('admin/analytics/sales', { ...params }),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
}

export function useAdminTopProducts(limit = 10) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'products', limit],
    queryFn: () =>
      apiGet<AdminAnalyticsTopProductsResponse>('admin/analytics/products', { limit }),
    staleTime: 60_000,
  });
}

export interface InventoryMovementsParams {
  type?: InventoryMovementType;
  product_id?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export function useAdminInventoryMovements(params: InventoryMovementsParams) {
  return useQuery({
    queryKey: ['admin', 'inventory', 'movements', params],
    queryFn: () =>
      apiGet<InventoryMovementsResponse>('admin/inventory/movements', { ...params }),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });
}

export interface AbandonedCartsParams {
  stage?: AbandonedCartStage;
  min_age_hours?: number;
  page?: number;
  limit?: number;
}

export function useAdminAbandonedCarts(params: AbandonedCartsParams) {
  return useQuery({
    queryKey: ['admin', 'abandoned-carts', params],
    queryFn: () =>
      apiGet<AbandonedCartsResponse>('admin/abandoned-carts', { ...params }),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
}

// ─── Slice 3b-2 ─────────────────────────────────────────────────────

export interface RefundsParams {
  status?: RefundFilter;
  page?: number;
  limit?: number;
}

export function useAdminRefunds(params: RefundsParams) {
  return useQuery({
    queryKey: ['admin', 'refunds', params],
    queryFn: () => apiGet<AdminRefundListResponse>('admin/refunds', { ...params }),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });
}

export interface ShippingLabelsParams {
  status?: ShippingLabelFilter;
}

export function useAdminShippingLabels(params: ShippingLabelsParams) {
  return useQuery({
    queryKey: ['admin', 'shipping-labels', params],
    queryFn: () => apiGet<ShippingLabelsResponse>('admin/shipping-labels', { ...params }),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });
}

export function useAdminTemplates() {
  return useQuery({
    queryKey: ['admin', 'templates'],
    queryFn: () => apiGet<AdminTemplatesResponse>('admin/templates'),
    staleTime: 60 * 60_000,
  });
}

// ─── Slice 3b-3 ─────────────────────────────────────────────────────

export interface AdminPromosParams {
  status?: PromoFilter;
  q?: string;
  page?: number;
  limit?: number;
}

export function useAdminPromos(params: AdminPromosParams) {
  return useQuery({
    queryKey: ['admin', 'promos', params],
    queryFn: () => apiGet<AdminPromoListResponse>('admin/promos', { ...params }),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });
}

export interface AdminBannersParams {
  status?: BannerFilter;
}

export function useAdminBanners(params: AdminBannersParams) {
  return useQuery({
    queryKey: ['admin', 'banners', params],
    queryFn: () => apiGet<AdminBannersResponse>('admin/banners', { ...params }),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
