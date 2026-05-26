import { randomUUID } from 'node:crypto';
import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';

/** R2 key for a public product image. Flat path → CDN URL `${publicUrlBase}/${key}`. */
export function productKey(): string {
  return `products/${randomUUID()}.webp`;
}

/**
 * R2 key for a private receipt image. Path is grouped by date + order so
 * admins can browse by date or by order id without a separate index.
 */
export function receiptKey(orderId: string, now: Date = new Date()): string {
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `receipts/${yyyy}/${mm}/${orderId}/${randomUUID()}.webp`;
}

/** R2 key for a public banner image. Mirrors `productKey` pattern. */
export function bannerKey(): string {
  return `banners/${randomUUID()}.webp`;
}

/** Stub-mode counterparts so tests can assert on a fixed prefix. */
export function stubProductKey(): string {
  return `stub/${productKey()}`;
}
export function stubReceiptKey(orderId: string, now?: Date): string {
  return `stub/${receiptKey(orderId, now)}`;
}
export function stubBannerKey(): string {
  return `stub/${bannerKey()}`;
}

export const ACCEPTED_IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

/**
 * Multer `fileFilter` enforcing the MIME allow-list before the file reaches
 * the service. Anything else throws a bilingual 400 — non-image data never
 * touches sharp.
 */
export function imageMimeFilter(
  _req: Request,
  file: { mimetype: string },
  cb: (error: Error | null, acceptFile: boolean) => void,
): void {
  if (ACCEPTED_IMAGE_MIME.has(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(
    new BadRequestException({
      code: 'INVALID_IMAGE_MIME',
      message_en: 'Unsupported image type. Use JPEG, PNG, or WebP.',
      message_ar: 'نوع الصورة غير مدعوم. يُرجى رفع JPEG أو PNG أو WebP.',
    }),
    false,
  );
}
