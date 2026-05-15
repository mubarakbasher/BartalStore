import { Injectable, Logger, NotImplementedException } from '@nestjs/common';

/**
 * Cloudflare R2 storage service — scaffolded per PRD §11.2 + §16.4.
 *
 * Two buckets:
 *   - PUBLIC: product images, served via CDN (assets.bartal.sd).
 *   - RECEIPTS: private; accessed via signed URLs with 1-hour expiry.
 *
 * Phase 1 stubs — real implementation lands with the receipt-upload flow.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  /** Generate a presigned URL for uploading a product image (public bucket). */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async presignProductUpload(_filename: string, _contentType: string): Promise<unknown> {
    throw new NotImplementedException();
  }

  /** Generate a presigned URL for uploading a receipt image (private bucket). */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async presignReceiptUpload(_orderId: string, _contentType: string): Promise<unknown> {
    throw new NotImplementedException();
  }

  /** Generate a signed read URL for a receipt (used by admin). 1-hour TTL. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signedReceiptReadUrl(_key: string): Promise<string> {
    throw new NotImplementedException();
  }
}
