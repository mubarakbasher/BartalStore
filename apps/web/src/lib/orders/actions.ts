'use server';

import { revalidatePath } from 'next/cache';
import { apiPost, apiDelete } from '../api/client';
import { readAccessToken } from '../auth/cookies';
import { actionFail, type ActionResult } from '../api/action-result';
import type { CreateOrderDto, OrderView } from '../api/types';
import type { Locale } from '../i18n/config';

const noAuth = {
  ok: false as const,
  error: {
    code: 'NOT_AUTHENTICATED',
    status: 401,
    message_en: 'Please sign in to continue.',
    message_ar: 'يرجى تسجيل الدخول للمتابعة.',
  },
};

/** Create a real order from the selected address + payment method + cart items. */
export async function placeOrderAction(
  dto: CreateOrderDto,
  locale: Locale = 'ar',
): Promise<ActionResult<{ id: string; order_number: string }>> {
  const token = readAccessToken();
  if (!token) return noAuth;
  try {
    const order = await apiPost<OrderView, CreateOrderDto>('orders', dto, {
      locale,
      accessToken: token,
    });
    revalidatePath(`/${locale}/orders`);
    return { ok: true, data: { id: order.id, order_number: order.order_number } };
  } catch (err) {
    return actionFail(err);
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

/**
 * Upload a receipt image (multipart → R2) then attach the returned key to the
 * order. Combines `POST /storage/receipts` + `POST /orders/:id/receipt`.
 */
export async function uploadReceiptAction(
  orderId: string,
  formData: FormData,
  locale: Locale = 'ar',
): Promise<ActionResult<{ status: string }>> {
  const token = readAccessToken();
  if (!token) return noAuth;

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return {
      ok: false,
      error: {
        code: 'NO_FILE',
        status: 400,
        message_en: 'Please choose a receipt image.',
        message_ar: 'يرجى اختيار صورة الإيصال.',
      },
    };
  }

  try {
    const body = new FormData();
    body.append('file', file);
    body.append('order_id', orderId);
    const res = await fetch(`${API_BASE}/storage/receipts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Accept-Language': locale },
      body,
    });
    const json = (await res.json()) as
      | { success: true; data: { key: string } }
      | { success: false; error: { code: string; status: number; message_en: string; message_ar: string } };
    if (!json.success) {
      return { ok: false, error: { ...json.error, status: json.error.status ?? res.status } };
    }
    return attachReceiptAction(orderId, json.data.key, locale);
  } catch (err) {
    return actionFail(err);
  }
}

/** Attach an uploaded receipt (R2 key) to an order. */
export async function attachReceiptAction(
  orderId: string,
  receiptUrl: string,
  locale: Locale = 'ar',
): Promise<ActionResult<{ status: string }>> {
  const token = readAccessToken();
  if (!token) return noAuth;
  try {
    const order = await apiPost<OrderView, { receipt_url: string }>(
      `orders/${orderId}/receipt`,
      { receipt_url: receiptUrl },
      { locale, accessToken: token },
    );
    revalidatePath(`/${locale}/orders/${orderId}`);
    return { ok: true, data: { status: order.status } };
  } catch (err) {
    return actionFail(err);
  }
}

export async function cancelOrderAction(
  orderId: string,
  locale: Locale = 'ar',
): Promise<ActionResult<{ status: string }>> {
  const token = readAccessToken();
  if (!token) return noAuth;
  try {
    const order = await apiDelete<OrderView>(`orders/${orderId}/cancel`, {
      locale,
      accessToken: token,
    });
    revalidatePath(`/${locale}/orders/${orderId}`);
    return { ok: true, data: { status: order.status } };
  } catch (err) {
    return actionFail(err);
  }
}

export async function submitReviewAction(
  productId: string,
  input: { rating: number; comment?: string },
  locale: Locale = 'ar',
): Promise<ActionResult<{ id: string }>> {
  const token = readAccessToken();
  if (!token) return noAuth;
  try {
    const review = await apiPost<{ id: string }, { rating: number; comment?: string }>(
      `products/${productId}/reviews`,
      input,
      { locale, accessToken: token },
    );
    return { ok: true, data: { id: review.id } };
  } catch (err) {
    return actionFail(err);
  }
}
