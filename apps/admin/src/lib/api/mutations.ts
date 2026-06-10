import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { OrderStatus, PaymentStatus, DeliveryZone } from '@bartal/shared';
import { apiClient, apiDelete, apiPost, apiPut } from './client';
import type {
  AdminCategoryNode,
  AdminOrderDetail,
  AdminProductDetail,
  AdminProductImage,
  AdminSettings,
  AdminZoneRow,
} from './types';

export interface UpdateOrderStatusBody {
  status: OrderStatus;
  note?: string;
}

export function useUpdateOrderStatus(orderId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateOrderStatusBody) =>
      apiPut<AdminOrderDetail, UpdateOrderStatusBody>(`admin/orders/${orderId}/status`, body),
    onSuccess: () => {
      // Refetch the detail via GET /admin/orders/:id (the full AdminOrderDetail
      // shape with user + history). The PUT response is the customer OrderView
      // — caching it directly would drop user/history and crash the detail page.
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
      qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export interface UpdateOrderPaymentBody {
  // PaymentStatus = UNPAID | PAID | REFUNDED. Confirm = PAID; reject = UNPAID + reason.
  status: PaymentStatus;
  reason?: string;
}

export function useUpdateOrderPayment(orderId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateOrderPaymentBody) =>
      apiPut<AdminOrderDetail, UpdateOrderPaymentBody>(`admin/orders/${orderId}/payment`, body),
    onSuccess: () => {
      // Refetch the detail via GET /admin/orders/:id (the full AdminOrderDetail
      // shape with user + history). The PUT response is the customer OrderView
      // — caching it directly would drop user/history and crash the detail page.
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
      qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export interface UpdateZoneFeeBody {
  fee: number;
  free_above?: number | null;
  estimated_days_min: number;
  estimated_days_max: number;
}

export function useUpdateZoneFee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ zone, body }: { zone: DeliveryZone; body: UpdateZoneFeeBody }) =>
      apiPut<AdminZoneRow, UpdateZoneFeeBody>(`admin/delivery/zones/${zone}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['delivery', 'zones'] });
    },
  });
}

export interface UpdateSettingsBody {
  settings: Record<string, string>;
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateSettingsBody) =>
      apiPut<AdminSettings, UpdateSettingsBody>('admin/settings', body),
    onSuccess: (data) => {
      qc.setQueryData(['admin', 'settings'], data);
    },
  });
}

// ─── Catalog mutations ────────────────────────────────────

export interface CreateProductBody {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  slug: string;
  price: number;
  stock: number;
  category_id: string;
  sku?: string;
  compare_price?: number;
  weight_grams?: number;
  is_active?: boolean;
  is_featured?: boolean;
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProductBody) =>
      apiPost<AdminProductDetail, CreateProductBody>('admin/products', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
}

export type UpdateProductBody = Partial<CreateProductBody>;

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProductBody) =>
      apiPut<AdminProductDetail, UpdateProductBody>(`admin/products/${id}`, body),
    onSuccess: (data) => {
      qc.setQueryData(['admin', 'products', id], data);
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useDeleteProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiDelete<{ id: string; is_active: boolean }>(`admin/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export interface UploadProductImageInput {
  productId: string;
  file: File;
  is_primary?: boolean;
  sort_order?: number;
}

export function useUploadProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, file, is_primary, sort_order }: UploadProductImageInput) => {
      const form = new FormData();
      form.append('file', file);
      if (is_primary !== undefined) form.append('is_primary', String(is_primary));
      if (sort_order !== undefined) form.append('sort_order', String(sort_order));
      const res = await apiClient.post<{ success: boolean; data: AdminProductImage }>(
        `admin/products/${productId}/images`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      if (!res.data.success) throw new Error('upload failed');
      return res.data.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['admin', 'products', vars.productId] });
    },
  });
}

export interface UpdateProductImageBody {
  is_primary?: boolean;
  sort_order?: number;
  alt_ar?: string;
  alt_en?: string;
}

export function useUpdateProductImage(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId, body }: { imageId: string; body: UpdateProductImageBody }) =>
      apiPut<AdminProductImage, UpdateProductImageBody>(
        `admin/products/${productId}/images/${imageId}`,
        body,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products', productId] }),
  });
}

export function useDeleteProductImage(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) =>
      apiDelete<{ id: string; deleted: boolean }>(
        `admin/products/${productId}/images/${imageId}`,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products', productId] }),
  });
}

export interface CreateCategoryBody {
  name_ar: string;
  name_en: string;
  slug: string;
  parent_id?: string | null;
  sort_order?: number;
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCategoryBody) =>
      apiPost<AdminCategoryNode, CreateCategoryBody>('admin/categories', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  });
}

export type UpdateCategoryBody = Partial<CreateCategoryBody> & { is_active?: boolean };

export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateCategoryBody) =>
      apiPut<AdminCategoryNode, UpdateCategoryBody>(`admin/categories/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  });
}

// ─── Review moderation ────────────────────────────────────

interface ReviewActionResult {
  id: string;
  moderation_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason?: string;
}

function invalidateReviewQueries(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['admin', 'reviews'] });
  qc.invalidateQueries({ queryKey: ['admin', 'review-kpis'] });
  qc.invalidateQueries({ queryKey: ['admin', 'audit-log'] });
}

export function useApproveReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiPost<ReviewActionResult, Record<string, never>>(`admin/reviews/${id}/approve`, {}),
    onSuccess: () => invalidateReviewQueries(qc),
  });
}

export interface RejectReviewBody {
  reason: string;
}

export function useRejectReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: RejectReviewBody }) =>
      apiPost<ReviewActionResult, RejectReviewBody>(`admin/reviews/${id}/reject`, body),
    onSuccess: () => invalidateReviewQueries(qc),
  });
}

export function useResetReviewToPending() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiPost<ReviewActionResult, Record<string, never>>(`admin/reviews/${id}/reset`, {}),
    onSuccess: () => invalidateReviewQueries(qc),
  });
}

// ─── Slice 3b-2: refunds + shipping labels + abandoned-cart SMS ──────

export interface CreateRefundBody {
  order_id: string;
  amount: number;
  reason: string;
}

export function useCreateRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateRefundBody) =>
      apiPost<{ id: string; refund_number: string; status: string; amount: number }, CreateRefundBody>(
        'admin/refunds',
        body,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'refunds'] }),
  });
}

export function useApproveRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiPost<{ id: string; status: 'APPROVED' }, Record<string, never>>(
        `admin/refunds/${id}/approve`,
        {},
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'refunds'] });
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
      qc.invalidateQueries({ queryKey: ['admin', 'audit-log'] });
    },
  });
}

export interface RejectRefundBody { reason: string }

export function useRejectRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: RejectRefundBody }) =>
      apiPost<{ id: string; status: 'REJECTED' }, RejectRefundBody>(
        `admin/refunds/${id}/reject`,
        body,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'refunds'] }),
  });
}

export interface MarkLabelsPrintedBody { order_ids: string[] }

export function useMarkLabelsPrinted() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: MarkLabelsPrintedBody) =>
      apiPost<{ count: number; printed_at: string }, MarkLabelsPrintedBody>(
        'admin/shipping-labels/mark-printed',
        body,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'shipping-labels'] });
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}

export function useSendAbandonedCartSms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apiPost<{ sent_to: string }, Record<string, never>>(
        `admin/abandoned-carts/${userId}/sms`,
        {},
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'abandoned-carts'] }),
  });
}

// ─── Slice 3b-3: promos + banners ───────────────────────────────────

export interface CreatePromoBody {
  code: string;
  description_ar: string;
  description_en: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  min_cart_amount?: number;
  max_uses?: number;
  starts_at?: string;
  expires_at?: string;
  is_active?: boolean;
}

export function useCreatePromo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePromoBody) =>
      apiPost<{ id: string; code: string; type: string; value: number }, CreatePromoBody>(
        'admin/promos',
        body,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'promos'] }),
  });
}

export type UpdatePromoBody = Partial<Omit<CreatePromoBody, 'code' | 'type'>>;

export function useUpdatePromo(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdatePromoBody) =>
      apiPut<{ id: string; status: string }, UpdatePromoBody>(`admin/promos/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'promos'] }),
  });
}

export function useDeletePromo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete<{ id: string; is_active: boolean }>(`admin/promos/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'promos'] }),
  });
}

export interface CreateBannerBody {
  title_ar: string;
  title_en: string;
  image_url: string;
  cta_url?: string;
  status?: 'LIVE' | 'DRAFT';
}

export function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBannerBody) =>
      apiPost<{ id: string; position: number }, CreateBannerBody>('admin/banners', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'banners'] }),
  });
}

export type UpdateBannerBody = Partial<CreateBannerBody>;

export function useUpdateBanner(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateBannerBody) =>
      apiPut<{ id: string }, UpdateBannerBody>(`admin/banners/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'banners'] }),
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiDelete<{ id: string; deleted: boolean }>(`admin/banners/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'banners'] }),
  });
}

export interface MoveBannerBody { direction: 'up' | 'down' }

export function useMoveBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: MoveBannerBody }) =>
      apiPost<{ id: string; new_position: number; swapped_with: string }, MoveBannerBody>(
        `admin/banners/${id}/move`,
        body,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'banners'] }),
  });
}

export interface UploadBannerImageInput {
  bannerId: string;
  file: File;
}

export function useUploadBannerImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ bannerId, file }: UploadBannerImageInput) => {
      const form = new FormData();
      form.append('file', file);
      const res = await apiClient.post<{ success: boolean; data: { key: string; url: string } }>(
        `admin/banners/${bannerId}/image`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      if (!res.data.success) throw new Error('upload failed');
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'banners'] }),
  });
}
